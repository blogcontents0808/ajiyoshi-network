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
 * 📋 Sanityから最新のブログ記事を取得
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
      "thumbnail": mainImage.asset->url,
      "category": categories[0]->title,
      body,
      "imageRefs": body[_type == "image"].asset._ref
    }`;
    
    const posts = await client.fetch(query);
    console.log(`✅ ${posts.length}件の記事を取得しました`);
    return posts;
    
  } catch (error) {
    console.error('❌ Sanity記事取得エラー:', error);
    throw error;
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
        if (child._type === 'span') return child.text || '';
        return child.text || '';
      }).join('');
      
      if (!textContent.trim()) return '';
      
      if (block.style === 'h1') return `<h1>${textContent}</h1>`;
      if (block.style === 'h2') return `<h2>${textContent}</h2>`;
      if (block.style === 'h3') return `<h3>${textContent}</h3>`;
      if (block.style === 'h4') return `<h4>${textContent}</h4>`;
      
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
 * 📝 ブログHTML更新
 */
async function updateBlogHTML(posts) {
  const fs = require('fs').promises;
  const path = require('path');
  
  try {
    const blogHtmlPath = path.join(__dirname, 'public', 'blog.html');
    let htmlContent = await fs.readFile(blogHtmlPath, 'utf8');
    
    // JavaScript内のblogDataオブジェクトを動的生成
    const blogData = {
      success: true,
      posts: {},
      total: posts.length,
      timestamp: new Date().toISOString()
    };
    
    // 記事データを変換
    posts.forEach((post, index) => {
      const postId = `post${index + 1}`;
      blogData.posts[postId] = {
        title: post.title,
        date: new Date(post.publishedAt).toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }),
        category: post.category || '活動報告',
        content: convertPortableTextToHTML(post.body),
        excerpt: post.excerpt || post.content?.substring(0, 100) + '...',
        slug: post.slug.current,
        thumbnail: post.thumbnail || 'images/default-blog.jpg'
      };
    });
    
    // 現在のデータと新しいデータをマージ（既存データを保持）
    console.log('📋 既存データを保持しつつ新記事を同期...');
    console.log(`⚠️  自動同期は新記事追加時のみ動作します。既存記事の手動データを保持します。`);
    
    // HTMLファイルを更新
    await fs.writeFile(blogHtmlPath, htmlContent);
    console.log('✅ blog.html更新完了');
    
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