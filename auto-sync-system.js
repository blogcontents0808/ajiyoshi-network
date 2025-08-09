/**
 * 🔄 味美ネットワーク ブログ自動同期システム
 * Sanity Studio → フロントエンドブログ自動更新
 */

const { createClient } = require('@sanity/client');

// Sanity設定
const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false, // リアルタイム更新のためCDN無効
  token: process.env.SANITY_API_TOKEN // 書き込み権限トークン（環境変数で設定）
});

/**
 * 📋 Sanityから最新のブログ記事を取得（サムネイル保護付き）
 */
async function fetchLatestBlogPosts() {
  try {
    console.log('🔍 Sanityから最新記事を取得中...');
    
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "thumbnailRef": thumbnail.asset._ref,
      "mainImageRef": mainImage.asset._ref,
      "category": categories[0]->title,
      content,
      "imageRefs": content[_type == "image"].asset._ref
    }`;
    
    const posts = await client.fetch(query);
    console.log(`✅ ${posts.length}件の記事を取得しました`);
    
    // サムネイル情報を保護・生成
    posts.forEach(post => {
      let thumbnailUrl = 'images/default-blog.jpg';
      
      // サムネイル優先、なければメイン画像を使用
      if (post.thumbnailRef) {
        thumbnailUrl = `https://cdn.sanity.io/images/qier3tei/production/${post.thumbnailRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      } else if (post.mainImageRef) {
        thumbnailUrl = `https://cdn.sanity.io/images/qier3tei/production/${post.mainImageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      }
      
      post.protectedThumbnail = thumbnailUrl;
      console.log(`🖼️ ${post.title}: サムネイル保護 ${thumbnailUrl}`);
    });
    
    return posts;
    
  } catch (error) {
    console.error('❌ Sanity記事取得エラー:', error);
    throw error;
  }
}

/**
 * 🛡️ 既存HTMLからサムネイル情報を抽出（保護用）
 */
function extractExistingThumbnails(htmlContent) {
  const existingThumbnails = {};
  
  try {
    // blogDataオブジェクトから既存のサムネイル情報を抽出
    const blogDataMatch = htmlContent.match(/const blogData = (\{[\s\S]*?\});/);
    if (blogDataMatch) {
      const blogDataStr = blogDataMatch[1];
      const postsMatches = blogDataStr.match(/"post\d+":\s*\{[\s\S]*?\}/g);
      
      if (postsMatches) {
        postsMatches.forEach(postMatch => {
          const slugMatch = postMatch.match(/"slug":\s*"([^"]+)"/);
          const thumbnailMatch = postMatch.match(/"thumbnail":\s*"([^"]+)"/);
          
          if (slugMatch && thumbnailMatch) {
            existingThumbnails[slugMatch[1]] = thumbnailMatch[1];
          }
        });
      }
    }
    
    console.log(`🔍 既存サムネイル ${Object.keys(existingThumbnails).length}件を抽出`);
    return existingThumbnails;
    
  } catch (error) {
    console.warn('⚠️ 既存サムネイル抽出エラー:', error);
    return {};
  }
}

/**
 * 🎯 Portable Textを綺麗なHTMLに変換
 */
function convertPortableTextToHTML(portableText) {
  if (!portableText || !Array.isArray(portableText)) return '';
  
  return portableText.map(block => {
    if (block._type === 'block') {
      if (!block.children || block.children.length === 0) return '';
      
      const textContent = block.children.map(child => {
        let content = child.text || '';
        if (child.marks && child.marks.includes('strong')) {
          content = `<strong>${content}</strong>`;
        }
        if (child.marks && child.marks.includes('em')) {
          content = `<em>${content}</em>`;
        }
        return content;
      }).join('');
      
      if (!textContent.trim()) return '';
      
      if (block.style === 'h1') return `<h1>${textContent}</h1>`;
      if (block.style === 'h2') return `<h2>${textContent}</h2>`;
      if (block.style === 'h3') return `<h3>${textContent}</h3>`;
      if (block.style === 'h4') return `<h4>${textContent}</h4>`;
      
      if (block.listItem === 'bullet') {
        return `<li>${textContent}</li>`;
      }
      
      return `<p>${textContent}</p>`;
    }
    
    if (block._type === 'image' && block.asset) {
      const imageRef = block.asset._ref || block.asset._id;
      if (imageRef) {
        const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${imageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png').replace('-jpeg', '.jpeg')}`;
        const altText = block.alt || 'ブログ画像';
        return `<p style="text-align: center; margin: 2rem 0;"><img src="${imageUrl}" alt="${altText}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></p>`;
      }
    }
    
    return '';
  }).filter(html => html.trim()).join('\n');
}

/**
 * 📝 ブログHTML更新（サムネイル保護機能付き）
 */
async function updateBlogHTML(posts) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const blogHtmlPath = path.join(__dirname, 'public', 'blog.html');
    let htmlContent = await fs.readFile(blogHtmlPath, 'utf8');
    
    // 既存のblogDataから現在のサムネイルを抽出して保護
    const existingThumbnails = extractExistingThumbnails(htmlContent);
    
    // JavaScript内のblogDataオブジェクトを動的生成
    const blogData = {
      success: true,
      posts: {},
      total: posts.length,
      timestamp: new Date().toISOString()
    };
    
    // 記事データを変換（サムネイル保護適用）
    posts.forEach((post, index) => {
      const postId = `post${index + 1}`;
      const slug = post.slug.current;
      
      // サムネイル保護: 既存の有効なサムネイルがあれば保持
      let finalThumbnail = post.protectedThumbnail;
      if (existingThumbnails[slug] && !existingThumbnails[slug].includes('default-blog.jpg')) {
        finalThumbnail = existingThumbnails[slug];
        console.log(`🛡️ サムネイル保護適用: ${post.title} → ${finalThumbnail}`);
      }
      
      blogData.posts[postId] = {
        title: post.title,
        date: new Date(post.publishedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        category: post.category || '活動報告',
        content: convertPortableTextToHTML(post.content),
        excerpt: post.excerpt || post.content?.substring(0, 100) + '...',
        slug: slug,
        thumbnail: finalThumbnail
      };
    });
    
    // HTMLにblogDataを埋め込み
    const blogDataString = JSON.stringify(blogData, null, 2)
      .split('\n')
      .map((line, index) => index === 0 ? line : '          ' + line)
      .join('\n');
    
    const blogDataRegex = /const blogData = \{[\s\S]*?\};/;
    if (blogDataRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(blogDataRegex, `const blogData = ${blogDataString};`);
    }
    
    console.log('🛡️ サムネイル保護システム適用済み');
    console.log('📋 全記事のサムネイル情報を保護・更新');
    
    // HTMLファイルを更新
    await fs.writeFile(blogHtmlPath, htmlContent);
    console.log('✅ blog.html更新完了（サムネイル保護適用）');
    
    return blogData;
    
  } catch (error) {
    console.error('❌ HTML更新エラー:', error);
    throw error;
  }
}

/**
 * 🚀 自動Git更新
 */
async function autoGitCommit() {
  const { exec } = require('child_process');
  const util = require('util');
  const execPromise = util.promisify(exec);
  
  try {
    console.log('🔄 Git自動コミット開始...');
    
    await execPromise('git add public/blog.html');
    
    const commitMessage = `🔄 ブログ自動同期: ${new Date().toLocaleString('ja-JP')}

📋 Sanity Studioからの記事を自動同期
🤖 自動同期システムによる更新

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;
    
    await execPromise(`git commit -m "${commitMessage}"`);
    await execPromise('git push');
    
    console.log('✅ Git自動コミット完了');
    
  } catch (error) {
    console.error('❌ Git更新エラー:', error);
    throw error;
  }
}

/**
 * 🎯 メイン同期処理
 */
async function syncBlogPosts() {
  try {
    console.log('🚀 ブログ自動同期開始...');
    
    // 1. Sanityから最新記事取得
    const posts = await fetchLatestBlogPosts();
    
    // 2. HTMLファイル更新
    const blogData = await updateBlogHTML(posts);
    
    // 3. Git自動コミット
    await autoGitCommit();
    
    console.log('🎉 ブログ自動同期完了！');
    console.log(`📊 処理結果: ${blogData.total}件の記事を同期`);
    
    return {
      success: true,
      postsCount: blogData.total,
      timestamp: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ ブログ同期エラー:', error);
    return {
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    };
  }
}

/**
 * 🔄 定期実行設定（オプション）
 */
function setupScheduledSync() {
  // 毎時0分に同期実行
  const schedule = require('node-cron');
  
  schedule.schedule('0 * * * *', () => {
    console.log('⏰ 定期同期実行開始...');
    syncBlogPosts();
  });
  
  console.log('⏰ 定期同期スケジュール設定完了（毎時0分）');
}

// 直接実行の場合
if (require.main === module) {
  syncBlogPosts();
}

module.exports = {
  syncBlogPosts,
  fetchLatestBlogPosts,
  updateBlogHTML,
  setupScheduledSync
};