const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function checkAllPostsProper() {
  try {
    console.log('🔍 全記事の正しいデータ構造確認中...');
    
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
    
    console.log(`📊 取得した記事数: ${posts.length}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString('ja-JP');
      const hasContent = post.content && post.content.length > 0;
      const hasThumbnail = !!post.thumbnail;
      
      console.log(`${index + 1}. 📰 ${post.title}`);
      console.log(`   📅 公開: ${date}`);
      console.log(`   🔗 slug: ${post.slug.current}`);
      console.log(`   📝 Content: ${hasContent ? '✅ あり (' + post.content.length + ' blocks)' : '❌ なし'}`);
      console.log(`   🖼️ Thumbnail: ${hasThumbnail ? '✅ ' + post.thumbnail : '❌ なし'}`);
      
      if (hasContent && post.content.length > 0) {
        console.log(`   📋 Content preview: "${post.content[0].children?.[0]?.text?.substring(0, 50) || 'N/A'}..."`);
      }
      console.log('');
    });
    
    // 統計
    const withContent = posts.filter(p => p.content && p.content.length > 0).length;
    const withThumbnail = posts.filter(p => !!p.thumbnail).length;
    
    console.log('📈 統計:');
    console.log(`- コンテンツあり: ${withContent}/${posts.length}記事`);
    console.log(`- サムネイルあり: ${withThumbnail}/${posts.length}記事`);
    
    return posts;
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkAllPostsProper();