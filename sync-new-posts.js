/**
 * 🔄 新記事のみ同期システム
 * Sanity Studioで新しく作成された記事のみを既存ブログに追加
 */

const { createClient } = require('@sanity/client');

// Sanity設定
const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

/**
 * 📋 Sanityから新記事のみを取得
 */
async function fetchNewPosts() {
  try {
    console.log('🔍 Sanityから新記事をチェック中...');
    
    // 最新5件の記事を取得
    const query = `*[_type == "post"] | order(publishedAt desc)[0...5] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "thumbnail": mainImage.asset->url,
      "category": categories[0]->title,
      body
    }`;
    
    const posts = await client.fetch(query);
    console.log(`📊 Sanityに${posts.length}件の記事があります`);
    
    return posts;
    
  } catch (error) {
    console.error('❌ Sanity新記事取得エラー:', error);
    return [];
  }
}

/**
 * 🎯 Portable Textを簡単なHTMLに変換
 */
function convertToHTML(portableText) {
  if (!portableText || !Array.isArray(portableText)) return '';
  
  return portableText.map(block => {
    if (block._type === 'block' && block.children) {
      const text = block.children.map(child => child.text || '').join('');
      if (block.style === 'h1') return `<h1>${text}</h1>`;
      if (block.style === 'h2') return `<h2>${text}</h2>`;
      if (block.style === 'h3') return `<h3>${text}</h3>`;
      return text ? `<p>${text}</p>` : '';
    }
    
    if (block._type === 'image' && block.asset) {
      const imageRef = block.asset._ref;
      if (imageRef) {
        const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${imageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
        return `<p style="text-align: center; margin: 2rem 0;"><img src="${imageUrl}" alt="${block.alt || 'ブログ画像'}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></p>`;
      }
    }
    
    return '';
  }).filter(html => html).join('\n');
}

/**
 * 📝 新記事追加用のJavaScriptコードを生成
 */
function generateNewPostCode(post, postIndex) {
  const content = convertToHTML(post.body);
  const excerpt = post.excerpt || content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
  
  const date = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  return `
                        "post${postIndex}": {
                            "title": "${post.title}",
                            "date": "${date}",
                            "category": "${post.category || '活動報告'}",
                            "content": ${JSON.stringify(content)},
                            "excerpt": "${excerpt}",
                            "slug": "${post.slug.current}",
                            "thumbnail": "${post.thumbnail || 'images/default-blog.jpg'}"
                        },`;
}

/**
 * 🎯 新記事情報表示
 */
async function showNewPosts() {
  try {
    console.log('🌸 味美ネットワーク ブログ同期システム');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const posts = await fetchNewPosts();
    
    if (posts.length === 0) {
      console.log('📋 Sanityに記事がありません');
      return;
    }
    
    console.log('\\n📋 Sanity Studio の記事一覧:');
    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString('ja-JP');
      console.log(`${index + 1}. 📰 ${post.title} (${date})`);
    });
    
    console.log('\\n🔄 新記事を手動で追加する場合:');
    console.log('1. 上記リストから追加したい記事を確認');
    console.log('2. blog.html の blogData に以下のコードを追加:');
    console.log('\\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    posts.forEach((post, index) => {
      const postCode = generateNewPostCode(post, index + 8); // post8以降として追加
      console.log(postCode);
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\\n💡 使用方法:');
    console.log('- blog.html の blogData.posts に上記コードをコピー&ペースト');
    console.log('- "total": 7 を追加した記事数に変更');
    console.log('- Git add, commit, push でデプロイ');
    
    console.log('\\n🌐 Sanity Studio: https://ajiyoshi-network.sanity.studio/');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

// 実行
showNewPosts();