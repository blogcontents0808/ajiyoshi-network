const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function fixAllThumbnails() {
  try {
    console.log('🔍 Sanityから全記事のサムネイル情報を取得中...');
    
    const query = `*[_type == "post"] | order(publishedAt desc) {
      _id,
      title,
      slug,
      publishedAt,
      "thumbnailRef": thumbnail.asset._ref,
      "mainImageRef": mainImage.asset._ref
    }`;
    
    const posts = await client.fetch(query);
    
    console.log(`📊 ${posts.length}件の記事を取得`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const thumbnailMap = {};
    
    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString('ja-JP');
      let thumbnailUrl = 'images/default-blog.jpg';
      
      // サムネイル優先、なければメイン画像を使用
      if (post.thumbnailRef) {
        thumbnailUrl = `https://cdn.sanity.io/images/qier3tei/production/${post.thumbnailRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      } else if (post.mainImageRef) {
        thumbnailUrl = `https://cdn.sanity.io/images/qier3tei/production/${post.mainImageRef.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      }
      
      console.log(`${index + 1}. 📰 ${post.title} (${date})`);
      console.log(`   🔗 slug: ${post.slug.current}`);
      console.log(`   🖼️ Thumbnail: ${post.thumbnailRef ? '✅' : '❌'} Main: ${post.mainImageRef ? '✅' : '❌'}`);
      console.log(`   📸 URL: ${thumbnailUrl}`);
      console.log('');
      
      thumbnailMap[post.slug.current] = thumbnailUrl;
    });
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 blog.html修正用のサムネイルマッピング:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    // 既存のpost1-7の対応を推測
    const postMapping = {
      'post1': 'website-renewal',
      'post2': '20250405sakura',
      'post3': '20241117oshi',
      'post4': '20231021',
      'post5': '2023sakura',
      'post6': '2022030501',
      'post7': '20211206',
      'post8': '2024sakura'
    };
    
    console.log('\\n🔧 修正が必要な記事のサムネイル:');
    Object.entries(postMapping).forEach(([postId, slug]) => {
      const thumbnailUrl = thumbnailMap[slug];
      if (thumbnailUrl && !thumbnailUrl.includes('default-blog.jpg')) {
        console.log(`${postId} (${slug}): "${thumbnailUrl}"`);
      }
    });
    
    return thumbnailMap;
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

fixAllThumbnails();