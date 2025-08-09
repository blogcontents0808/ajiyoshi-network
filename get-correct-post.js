const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function getCorrectPost() {
  try {
    const query = `*[_type == "post" && slug.current == "2024sakura"][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "thumbnailRef": thumbnail.asset._ref,
      content
    }`;
    
    const post = await client.fetch(query);
    
    if (!post) {
      console.log('❌ 記事が見つかりません');
      return;
    }
    
    console.log('🎉 記事データ取得成功！');
    console.log('Title:', post.title);
    console.log('Content blocks:', post.content?.length || 0);
    console.log('Thumbnail ref:', post.thumbnailRef);
    
    // HTMLコンテンツ生成
    let htmlContent = '';
    if (post.content && Array.isArray(post.content)) {
      htmlContent = post.content.map(block => {
        if (block._type === 'block' && block.children) {
          let text = block.children.map(child => {
            let content = child.text || '';
            if (child.marks && child.marks.includes('strong')) {
              content = `<strong>${content}</strong>`;
            }
            if (child.marks && child.marks.includes('em')) {
              content = `<em>${content}</em>`;
            }
            return content;
          }).join('');
          
          if (!text.trim()) return '';
          
          if (block.style === 'h1') return `<h1>${text}</h1>`;
          if (block.style === 'h2') return `<h2>${text}</h2>`;
          if (block.style === 'h3') return `<h3>${text}</h3>`;
          
          if (block.listItem === 'bullet') {
            return `<li>${text}</li>`;
          }
          
          return `<p>${text}</p>`;
        }
        
        if (block._type === 'image' && block.asset) {
          const imageRef = block.asset._ref;
          if (imageRef) {
            const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${imageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
            return `<p style="text-align: center; margin: 2rem 0;"><img src="${imageUrl}" alt="2024さくらまつり" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></p>`;
          }
        }
        
        return '';
      }).filter(html => html.trim()).join('\n');
    }
    
    // サムネイル画像URL生成
    let thumbnailUrl = 'images/default-blog.jpg';
    if (post.thumbnailRef) {
      thumbnailUrl = `https://cdn.sanity.io/images/qier3tei/production/${post.thumbnailRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
    }
    
    const date = new Date(post.publishedAt).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    console.log('\n📋 blog.html更新用データ:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const postData = {
      title: post.title,
      date: date,
      category: '活動報告',
      content: htmlContent,
      excerpt: post.excerpt,
      slug: post.slug.current,
      thumbnail: thumbnailUrl
    };
    
    console.log(JSON.stringify(postData, null, 2));
    
    return postData;
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

getCorrectPost();