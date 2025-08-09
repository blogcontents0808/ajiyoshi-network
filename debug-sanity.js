const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function debugSanity() {
  try {
    console.log('🔍 Sanity接続テスト...');
    
    // 基本的なクエリテスト
    const basicQuery = `*[_type == "post" && slug.current == "2024sakura"][0]`;
    const basicResult = await client.fetch(basicQuery);
    
    console.log('📋 基本クエリ結果:');
    console.log(JSON.stringify(basicResult, null, 2));
    
    if (!basicResult) {
      console.log('❌ 記事が見つかりません');
      
      // 全記事のslugを確認
      const allSlugs = await client.fetch(`*[_type == "post"].slug.current`);
      console.log('📝 利用可能なslugs:', allSlugs);
      return;
    }
    
    // より詳細なクエリ
    const detailQuery = `*[_type == "post" && slug.current == "2024sakura"][0] {
      ...,
      "thumbnail": mainImage.asset->url,
      "category": categories[0]->title,
      body[] {
        ...,
        _type == "image" => {
          ...,
          "imageUrl": asset->url
        }
      }
    }`;
    
    const detailResult = await client.fetch(detailQuery);
    
    console.log('\\n🔍 詳細クエリ結果:');
    console.log('Title:', detailResult.title);
    console.log('Body array length:', detailResult.body?.length || 0);
    console.log('Main Image:', detailResult.mainImage);
    console.log('Thumbnail URL:', detailResult.thumbnail);
    console.log('Categories:', detailResult.categories);
    console.log('Category title:', detailResult.category);
    
    if (detailResult.body && detailResult.body.length > 0) {
      console.log('\\n📝 Body content:');
      detailResult.body.forEach((block, index) => {
        console.log(`Block ${index + 1}:`, {
          type: block._type,
          style: block.style,
          text: block.children ? block.children.map(c => c.text).join('') : 'N/A',
          hasAsset: !!block.asset
        });
      });
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

debugSanity();