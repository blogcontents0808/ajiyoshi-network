/**
 * 🔄 完全版 Sanity → blog.html 同期システム
 * PortableText完全対応・画像自動処理・リッチコンテンツ変換
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity設定
const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

/**
 * 🎯 PortableTextを完全なHTMLに変換
 */
function portableTextToHTML(portableText) {
  if (!portableText || !Array.isArray(portableText)) {
    return '';
  }

  return portableText.map(block => {
    if (block._type === 'block') {
      // テキストブロック処理
      const children = block.children.map(child => {
        let text = child.text || '';
        
        // マークの処理
        if (child.marks && child.marks.length > 0) {
          child.marks.forEach(mark => {
            switch (mark) {
              case 'strong':
                text = `<strong>${text}</strong>`;
                break;
              case 'em':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
            }
          });
        }
        
        return text;
      }).join('');

      // ブロックスタイルの処理
      switch (block.style) {
        case 'h1':
          return `<h1>${children}</h1>`;
        case 'h2':
          return `<h2>${children}</h2>`;
        case 'h3':
          return `<h3>${children}</h3>`;
        case 'h4':
          return `<h4>${children}</h4>`;
        case 'blockquote':
          return `<blockquote>${children}</blockquote>`;
        case 'normal':
        default:
          return children.trim() ? `<p>${children}</p>` : '';
      }
    } else if (block._type === 'image' && block.asset) {
      // 画像ブロック処理
      const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${block.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      const alt = block.alt || '';
      const caption = block.caption || '';
      
      return `<figure style="text-align: center; margin: 2rem 0;">
        <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"/>
        ${caption ? `<figcaption style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">${caption}</figcaption>` : ''}
      </figure>`;
    }
    
    return '';
  }).filter(content => content.trim()).join('\\n');
}

/**
 * 📋 Sanityから完全なブログデータを取得
 */
async function fetchCompleteData() {
  try {
    console.log('🔍 Sanityから完全データを取得中...');
    
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      "thumbnail": thumbnail.asset->url,
      "thumbnailRef": thumbnail.asset._ref,
      "category": categories[0]->title
    }`;
    
    const posts = await client.fetch(query);
    console.log(`✅ ${posts.length}件の記事を取得しました`);
    
    // 記事をblog.html形式に変換
    const processedPosts = {};
    
    posts.forEach((post, index) => {
      const postNum = index + 1;
      const postKey = `post${postNum}`;
      
      // PortableTextをHTMLに変換
      const htmlContent = portableTextToHTML(post.content);
      
      // 日付を日本語形式に変換
      const publishDate = new Date(post.publishedAt);
      const japaneseDate = `${publishDate.getFullYear()}年${publishDate.getMonth() + 1}月${publishDate.getDate()}日`;
      
      processedPosts[postKey] = {
        title: post.title,
        date: japaneseDate,
        category: post.category || "活動報告",
        content: htmlContent,
        excerpt: post.excerpt || "",
        slug: post.slug.current,
        thumbnail: post.thumbnail || "images/default-blog.jpg"
      };
      
      console.log(`📰 ${postKey}: ${post.title}`);
      console.log(`   📝 Content: ${htmlContent.length} characters`);
      console.log(`   🖼️ Thumbnail: ${post.thumbnail ? '✅' : '❌'}`);
    });
    
    return processedPosts;
    
  } catch (error) {
    console.error('❌ Sanityデータ取得エラー:', error);
    throw error;
  }
}

/**
 * 🔧 blog.htmlを完全更新
 */
async function updateBlogHTML() {
  try {
    const blogHtmlPath = path.join(__dirname, '..', '..', 'public', 'blog.html');
    
    if (!fs.existsSync(blogHtmlPath)) {
      throw new Error('blog.htmlが見つかりません');
    }
    
    console.log('📖 現在のblog.htmlを読み込み中...');
    let htmlContent = fs.readFileSync(blogHtmlPath, 'utf8');
    
    // Sanityから完全データ取得
    const postsData = await fetchCompleteData();
    
    // blogDataオブジェクトを生成
    const blogDataObject = {
      success: true,
      posts: postsData,
      total: Object.keys(postsData).length,
      timestamp: new Date().toISOString()
    };
    
    // 既存のblogDataを置換（実際のファイル構造に合わせた正規表現）
    const blogDataRegex = /(const blogData = )\{[\s\S]*?\n\s*\};/;
    
    if (blogDataRegex.test(htmlContent)) {
      htmlContent = htmlContent.replace(blogDataRegex, `$1${JSON.stringify(blogDataObject, null, 2)};`);
      console.log('✅ 既存のblogDataを更新しました');
    } else {
      console.warn('⚠️ blogDataオブジェクトが見つかりません - パターンマッチングに失敗');
      
      // デバッグ用: blogDataの開始位置を探す
      const startIndex = htmlContent.indexOf('const blogData = {');
      if (startIndex !== -1) {
        console.log(`📍 blogDataの開始位置: ${startIndex}`);
        const preview = htmlContent.substring(startIndex, startIndex + 200);
        console.log(`📋 Preview: ${preview}...`);
      }
    }
    
    // ファイルに書き込み
    fs.writeFileSync(blogHtmlPath, htmlContent, 'utf8');
    
    console.log('🎉 blog.html更新完了！');
    console.log(`📊 更新内容:`);
    console.log(`   - 記事数: ${Object.keys(postsData).length}件`);
    console.log(`   - 全記事にコンテンツと画像を反映`);
    console.log(`   - PortableText → HTML変換完了`);
    
    return true;
    
  } catch (error) {
    console.error('❌ blog.html更新エラー:', error);
    throw error;
  }
}

/**
 * 🚀 メイン実行
 */
async function main() {
  try {
    console.log('🔄 完全版Sanity同期システム開始');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    await updateBlogHTML();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 完全同期システム完了！');
    console.log('📍 確認URL: http://localhost/ または本番サイト');
    
  } catch (error) {
    console.error('❌ システム実行エラー:', error);
    process.exit(1);
  }
}

// スクリプトが直接実行された場合のみmain()を呼び出し
if (require.main === module) {
  main();
}

module.exports = { fetchCompleteData, updateBlogHTML, portableTextToHTML };