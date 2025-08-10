/**
 * 🔍 特定記事のSanity Studio実際コンテンツ詳細デバッグ
 * ユーザーが提供したSanity Studioスクリーンショットと一致するかチェック
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function debugSpecificPost() {
  try {
    console.log('🔍 「2025　さくらまつりのお礼」記事の詳細デバッグ...');
    
    // さくらまつり記事を特定するクエリ（タイトルで検索）
    const query = `*[_type == "post" && title match "*さくらまつり*お礼*"][0] {
      _id,
      title,
      slug,
      publishedAt,
      excerpt,
      content,
      "thumbnail": thumbnail.asset->url,
      "thumbnailRef": thumbnail.asset._ref,
      "category": categories[0]->title,
      _createdAt,
      _updatedAt
    }`;
    
    const post = await client.fetch(query);
    
    if (!post) {
      console.log('❌ さくらまつりのお礼記事が見つかりません');
      
      // 全記事タイトルを確認
      const allPosts = await client.fetch(`*[_type == "post"] { title, slug }`);
      console.log('\n📋 利用可能な記事一覧:');
      allPosts.forEach((p, i) => {
        console.log(`${i+1}. ${p.title} (${p.slug.current})`);
      });
      return;
    }
    
    console.log('📰 記事情報:');
    console.log(`- タイトル: ${post.title}`);
    console.log(`- スラッグ: ${post.slug.current}`);
    console.log(`- 公開日: ${post.publishedAt}`);
    console.log(`- ID: ${post._id}`);
    console.log(`- 最終更新: ${post._updatedAt}`);
    
    console.log('\n📝 Content構造分析:');
    if (post.content && Array.isArray(post.content)) {
      console.log(`- Content Blocks: ${post.content.length}`);
      
      post.content.forEach((block, index) => {
        console.log(`\n--- Block ${index + 1} ---`);
        console.log(`Type: ${block._type}`);
        
        if (block._type === 'block') {
          console.log(`Style: ${block.style || 'normal'}`);
          if (block.children) {
            const fullText = block.children.map(child => child.text || '').join('');
            console.log(`Text Length: ${fullText.length} characters`);
            console.log(`Text Preview: "${fullText.substring(0, 200)}..."`);
            
            if (fullText.includes('令和７年４月５日')) {
              console.log('✅ ユーザー提供コンテンツと一致する可能性あり');
            }
          }
        } else if (block._type === 'image') {
          console.log(`Image Asset: ${block.asset?._ref || 'N/A'}`);
          console.log(`Alt Text: ${block.alt || 'N/A'}`);
        }
      });
      
      // 全テキストを結合して確認
      const fullContent = post.content
        .filter(block => block._type === 'block')
        .map(block => block.children?.map(child => child.text || '').join('') || '')
        .join(' ');
      
      console.log('\n📖 完全なテキストコンテンツ:');
      console.log(fullContent);
      
      // ユーザーが提供した期待コンテンツとの比較
      const expectedText = '令和７年４月５日（土）二子山公園で桜まつりが開催されました！当日は満開の桜と天気に恵まれ、とても多くの方で賑わいました。午前中は白山小音楽部や春日井ジュニアウインドウエスト、ＫＣジャズオーケストラの皆さんのすてきな演奏がありました。さらに石黒直樹春日井市長がオカリナを演奏してくださり、驚きました！';
      
      console.log('\n🔍 期待されるコンテンツとの比較:');
      if (fullContent.includes('令和７年４月５日')) {
        console.log('✅ 日付情報一致');
      } else {
        console.log('❌ 日付情報不一致');
      }
      
      if (fullContent.includes('二子山公園')) {
        console.log('✅ 場所情報一致');  
      } else {
        console.log('❌ 場所情報不一致');
      }
      
      if (fullContent.includes('白山小音楽部')) {
        console.log('✅ 演奏団体情報一致');
      } else {
        console.log('❌ 演奏団体情報不一致');
      }
      
    } else {
      console.log('❌ Content配列が空またはnull');
    }
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

debugSpecificPost();