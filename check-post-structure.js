const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function checkDetailedStructure() {
  try {
    console.log('🔍 記事構造詳細確認中...');
    
    const query = `*[_type == "post" && slug.current == "website-renewal"][0] {
      title,
      slug,
      excerpt,
      content,
      thumbnail,
      publishedAt,
      _id
    }`;
    
    const post = await client.fetch(query);
    console.log('📰 website-renewal記事の構造:');
    console.log(JSON.stringify(post, null, 2));
    
    // contentフィールドの詳細確認
    console.log('\n📝 contentフィールドの状態:');
    if (post.content) {
      console.log(`- Type: ${Array.isArray(post.content) ? 'array' : typeof post.content}`);
      console.log(`- Length: ${Array.isArray(post.content) ? post.content.length : 'not array'}`);
      console.log(`- Content:`, post.content);
    } else {
      console.log('- Status: ❌ Empty or null');
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkDetailedStructure();