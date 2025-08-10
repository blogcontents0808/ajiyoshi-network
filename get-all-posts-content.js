const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

// PortableTextをHTMLに変換する関数
function portableTextToHtml(portableText) {
  if (!portableText || !Array.isArray(portableText)) {
    return '';
  }

  return portableText.map(block => {
    if (block._type === 'block') {
      // テキストブロックの処理
      const children = block.children.map(child => {
        let text = child.text || '';
        
        // マークの処理（bold, italic, etc.）
        if (child.marks && child.marks.length > 0) {
          child.marks.forEach(mark => {
            switch (mark) {
              case 'strong':
                text = `<strong>${text}</strong>`;
                break;
              case 'em':
                text = `<em>${text}</em>`;
                break;
              case 'underline':
                text = `<u>${text}</u>`;
                break;
              case 'code':
                text = `<code>${text}</code>`;
                break;
            }
          });
        }
        
        return text;
      }).join('');

      // ブロックスタイルの処理
      switch (block.style) {
        case 'h1':
          return `<h1>${children}</h1>`;
        case 'h2':
          return `<h2>${children}</h2>`;
        case 'h3':
          return `<h3>${children}</h3>`;
        case 'h4':
          return `<h4>${children}</h4>`;
        case 'blockquote':
          return `<blockquote>${children}</blockquote>`;
        case 'normal':
        default:
          return `<p>${children}</p>`;
      }
    } else if (block._type === 'image') {
      // 画像ブロックの処理
      if (block.asset && block.asset.url) {
        const alt = block.alt || '';
        const caption = block.caption || '';
        return `<figure><img src="${block.asset.url}" alt="${alt}" style="max-width: 100%; height: auto;"/>${caption ? `<figcaption>${caption}</figcaption>` : ''}</figure>`;
      }
      return '';
    }
    
    return '';
  }).join('\\n');
}

async function getAllPostsContent() {
  try {
    console.log('🔍 Sanityから全記事のcontentフィールドを取得中...');
    
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
    
    // 各記事のslugとcontentを対応させる
    const slugToPostMap = {
      'website-renewal': 'post1',
      '20250405sakura': 'post2',
      '20241117oshi': 'post3',
      '20231021': 'post4',
      '2023sakura': 'post5',
      '2022030501': 'post6',
      '20211206': 'post7',
      '2024sakura': 'post8'
    };

    const contentsResult = {};

    posts.forEach((post, index) => {
      const date = new Date(post.publishedAt).toLocaleDateString('ja-JP');
      const slug = post.slug.current;
      const postKey = slugToPostMap[slug];
      
      console.log(`${index + 1}. 📰 ${post.title}`);
      console.log(`   📅 公開: ${date}`);
      console.log(`   🔗 slug: ${slug} → ${postKey || '未マップ'}`);
      
      if (postKey) {
        // PortableTextをHTMLに変換
        const htmlContent = portableTextToHtml(post.body);
        contentsResult[postKey] = {
          slug: slug,
          title: post.title,
          content: htmlContent,
          contentLength: htmlContent.length,
          bodyBlocks: post.body?.length || 0
        };
        
        console.log(`   📝 Content length: ${htmlContent.length} characters`);
        console.log(`   📄 Body blocks: ${post.body?.length || 0}`);
        
        // 最初の100文字を表示
        const preview = htmlContent.replace(/<[^>]*>/g, '').substring(0, 100);
        console.log(`   👀 Preview: ${preview}...`);
      } else {
        console.log(`   ⚠️ 未知のslug: ${slug}`);
      }
      
      console.log('');
    });
    
    console.log('\\n🎯 取得したcontentデータの概要:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    Object.entries(contentsResult).forEach(([postKey, data]) => {
      console.log(`${postKey}: ${data.title}`);
      console.log(`  📏 Content: ${data.contentLength} chars (${data.bodyBlocks} blocks)`);
      console.log(`  🔗 Slug: ${data.slug}`);
    });

    // 結果をJSONファイルとして保存
    const fs = require('fs');
    fs.writeFileSync('extracted-contents.json', JSON.stringify(contentsResult, null, 2), 'utf8');
    
    console.log('\\n✅ extracted-contents.json ファイルに保存しました！');
    console.log('\\n📋 次のステップ: このデータを使用してblog.htmlを更新してください');
    
    return contentsResult;
    
  } catch (error) {
    console.error('❌ エラー:', error);
  }
}

getAllPostsContent();