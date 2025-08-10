/**
 * 🔍 現在のブログ表示順序を確認
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

async function checkBlogOrder() {
  try {
    console.log('🔍 現在のブログ記事の日付順序を確認中...');
    
    const query = `*[_type == "post"] | order(publishedAt desc) {
      title,
      publishedAt,
      "formattedDate": publishedAt
    }`;
    
    const posts = await client.fetch(query);
    
    console.log('📊 Sanityでの正しい日時順序 (publishedAt desc):');
    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt);
      const japaneseDate = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
      console.log(`${index + 1}. ${post.title}`);
      console.log(`   📅 ${japaneseDate} (${post.publishedAt})`);
      console.log('');
    });
    
    // blog.htmlの現在の順序と比較
    console.log('🔍 現在のblog.htmlでの順序:');
    console.log('post1: ウェブサイトをリニューアルしました (2025年7月16日)');
    console.log('post2: 2025　さくらまつりのお礼 (2025年4月13日)');
    console.log('post3: 2024味美推しフェス (2024年11月18日)');
    console.log('post4: 2024　さくらまつり (2024年4月6日)');
    console.log('post5: ハンドーボール知多中学校に寄贈 (2023年10月21日)');
    console.log('post6: 2023　さくらまつり (2023年4月5日)');
    console.log('post7: 今年も白山神社で桜まつりを開催予定です (2022年3月5日)');
    console.log('post8: 令和3年度　しめ縄作り体験 (2021年12月6日)');
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

checkBlogOrder();