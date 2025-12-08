const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function inspectPost() {
  const targetId = '054af95f-677b-45ba-b218-6b525bd46fe1';
  console.log(`🔍 記事ID: ${targetId} を検索中...`);

  try {
    // 特定のIDで検索
    const query = `*[_id == "${targetId}"][0]`;
    const post = await client.fetch(query);

    if (!post) {
      console.log('❌ 記事が見つかりません');
      return;
    }

    console.log('🎉 記事が見つかりました！');
    console.log('----------------------------------------');
    console.log('タイトル:', post.title);
    console.log('タイプ:', post._type);
    console.log('公開日:', post.publishedAt);
    console.log('Slug:', post.slug?.current);
    console.log('----------------------------------------');
    console.log('全データ:', JSON.stringify(post, null, 2));

  } catch (error) {
    console.error('❌ エラーが発生しました:', error.message);
  }
}

inspectPost();
