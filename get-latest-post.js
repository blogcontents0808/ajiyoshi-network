const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function getLatestPost() {
  try {
    const query = `*[_type == "post" && slug.current == "2024sakura"][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "thumbnail": mainImage.asset->url,
      "category": categories[0]->title,
      body
    }`;
    
    const post = await client.fetch(query);
    
    if (!post) {
      console.log('❌ 2024sakura記事が見つかりません');
      return;
    }
    
    console.log('📰 記事詳細:');
    console.log('Title:', post.title);
    console.log('Date:', new Date(post.publishedAt).toLocaleDateString('ja-JP'));
    console.log('Category:', post.category);
    console.log('Excerpt:', post.excerpt);
    console.log('Thumbnail:', post.thumbnail);
    console.log('Body blocks:', post.body?.length || 0);
    
    // HTMLコンテンツを生成
    let content = '';
    if (post.body && Array.isArray(post.body)) {
      content = post.body.map(block => {
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
      }).filter(html => html).join('\\n');
    }
    
    const date = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // post8として追加用のコードを生成
    console.log('\\n📋 blog.htmlに追加するコード:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const postData = {
      title: post.title,
      date: date,
      category: post.category || '活動報告',
      content: content,
      excerpt: post.excerpt || content.replace(/<[^>]*>/g, '').substring(0, 100) + '...',
      slug: post.slug.current,
      thumbnail: post.thumbnail || 'images/default-blog.jpg'
    };
    
    console.log(`                        "post8": ${JSON.stringify(postData, null, 28)},`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\\n💡 追加手順:');
    console.log('1. blog.html の blogData.posts の最後に上記コードを追加');
    console.log('2. "total": 7 を "total": 8 に変更');
    console.log('3. git add, commit, push で反映');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

getLatestPost();