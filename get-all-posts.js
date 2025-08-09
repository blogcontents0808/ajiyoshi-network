const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function getAllPosts() {
  try {
    console.log('🔍 Sanityから全記事を取得中...');
    
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      "thumbnail": mainImage.asset->url,
      "category": categories[0]->title,
      body,
      _updatedAt
    }`;
    
    const posts = await client.fetch(query);
    
    console.log(`📊 合計 ${posts.length} 件の記事を発見`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString('ja-JP');
      const updated = new Date(post._updatedAt).toLocaleString('ja-JP');
      console.log(`${index + 1}. 📰 ${post.title}`);
      console.log(`   📅 公開: ${date} | 更新: ${updated}`);
      console.log(`   🔗 slug: ${post.slug.current}`);
      console.log(`   📝 Body blocks: ${post.body?.length || 0}`);
      console.log(`   🖼️ Thumbnail: ${post.thumbnail ? '✅' : '❌'}`);
      console.log(`   📋 Excerpt: ${post.excerpt?.substring(0, 50) || 'なし'}...`);
      console.log('');
    });
    
    // 2024さくらまつりの詳細情報
    const sakura2024 = posts.find(p => p.slug.current === '2024sakura');
    if (sakura2024) {
      console.log('🌸 2024さくらまつり記事の詳細:');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('Title:', sakura2024.title);
      console.log('Slug:', sakura2024.slug.current);
      console.log('Published:', new Date(sakura2024.publishedAt).toLocaleString('ja-JP'));
      console.log('Updated:', new Date(sakura2024._updatedAt).toLocaleString('ja-JP'));
      console.log('Category:', sakura2024.category || 'なし');
      console.log('Excerpt:', sakura2024.excerpt || 'なし');
      console.log('Thumbnail:', sakura2024.thumbnail || 'なし');
      console.log('Body blocks:', sakura2024.body?.length || 0);
      
      if (sakura2024.body && sakura2024.body.length > 0) {
        console.log('\\nBody content:');
        sakura2024.body.forEach((block, i) => {
          console.log(`Block ${i + 1} (${block._type}):`, JSON.stringify(block, null, 2));
        });
      }
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

getAllPosts();