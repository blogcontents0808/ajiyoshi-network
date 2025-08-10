/**
 * 🔧 blog.html完全修復システム
 * 正確なSanity StudioコンテンツでblogDataを完全置換
 */

const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Sanity設定
const client = createClient({
  projectId: 'qier3tei',
  dataset: 'production',
  apiVersion: '2023-05-03',
  useCdn: false
});

/**
 * 🎯 PortableTextを完全なHTMLに変換
 */
function portableTextToHTML(portableText) {
  if (!portableText || !Array.isArray(portableText)) {
    return '';
  }

  return portableText.map(block => {
    if (block._type === 'block') {
      // テキストブロック処理
      const children = block.children.map(child => {
        let text = child.text || '';
        
        // マークの処理
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
          return children.trim() ? `<p>${children}</p>` : '';
      }
    } else if (block._type === 'image' && block.asset) {
      // 画像ブロック処理
      const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${block.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`;
      const alt = block.alt || '';
      const caption = block.caption || '';
      
      return `<figure style="text-align: center; margin: 2rem 0;">
        <img src="${imageUrl}" alt="${alt}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"/>
        ${caption ? `<figcaption style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">${caption}</figcaption>` : ''}
      </figure>`;
    }
    
    return '';
  }).filter(content => content.trim()).join('');
}

async function fixBlogData() {
  try {
    console.log('🔧 blog.html完全修復開始...');
    
    const blogHtmlPath = path.join(__dirname, 'public', 'blog.html');
    let htmlContent = fs.readFileSync(blogHtmlPath, 'utf8');
    
    console.log('🔍 Sanityから正確なデータを取得中...');
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
    console.log(`✅ ${posts.length}件の記事を取得しました`);
    
    // 記事をblog.html形式に変換
    const processedPosts = {};
    
    posts.forEach((post, index) => {
      const postNum = index + 1;
      const postKey = `post${postNum}`;
      
      // PortableTextをHTMLに変換
      const htmlContent = portableTextToHTML(post.content);
      
      // 日付を日本語形式に変換
      const publishDate = new Date(post.publishedAt);
      const japaneseDate = `${publishDate.getFullYear()}年${publishDate.getMonth() + 1}月${publishDate.getDate()}日`;
      
      processedPosts[postKey] = {
        title: post.title,
        date: japaneseDate,
        category: post.category || "活動報告",
        content: htmlContent,
        excerpt: post.excerpt || "",
        slug: post.slug.current,
        thumbnail: post.thumbnail || "images/default-blog.jpg"
      };
      
      console.log(`📰 ${postKey}: ${post.title}`);
      console.log(`   📝 Content: ${htmlContent.length} characters`);
      console.log(`   🖼️ Thumbnail: ${post.thumbnail ? '✅' : '❌'}`);
    });
    
    // 新しいblogDataオブジェクトを生成
    const newBlogData = {
      success: true,
      posts: processedPosts,
      total: Object.keys(processedPosts).length,
      timestamp: new Date().toISOString()
    };
    
    // blogDataの開始位置を見つける
    const blogDataStartPattern = 'const blogData = {';
    const startIndex = htmlContent.indexOf(blogDataStartPattern);
    
    if (startIndex === -1) {
      throw new Error('blogDataオブジェクトが見つかりません');
    }
    
    // JavaScriptセクションの終了位置（</script>）を見つける
    const scriptEndPattern = '</script>';
    const scriptEndIndex = htmlContent.indexOf(scriptEndPattern, startIndex);
    
    if (scriptEndIndex === -1) {
      throw new Error('スクリプト終了タグが見つかりません');
    }
    
    // 新しいblogDataで置換
    const beforeBlogData = htmlContent.substring(0, startIndex);
    const afterBlogData = htmlContent.substring(scriptEndIndex);
    
    const newBlogDataString = `const blogData = ${JSON.stringify(newBlogData, null, 2)};
                
                blogPosts = blogData.posts;
                console.log(\`✅ \${blogData.total}件の記事を読み込みました\`);
                console.log('📋 実際のSanity Studioコンテンツが正常に反映されました');
                updateBlogGrid();
                
            } catch (error) {
                console.error('❌ ブログデータ読み込みエラー:', error.message);
                showErrorMessage('ブログデータの読み込みに失敗しました。');
            } finally {
                isLoading = false;
            }
        }

        // エラーメッセージ表示
        function showErrorMessage(message) {
            const blogGrid = document.querySelector('.blog-posts-grid');
            if (blogGrid) {
                blogGrid.innerHTML = \`
                    <div style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #666;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: #E67E22;"></i>
                        <p>\${message}</p>
                        <button onclick="loadBlogPosts()" style="margin-top: 1rem; padding: 0.5rem 1rem; background: #E67E22; color: white; border: none; border-radius: 4px; cursor: pointer;">再読み込み</button>
                    </div>
                \`;
            }
        }

        // ブログ一覧の更新
        function updateBlogGrid() {
            const blogGrid = document.querySelector('.blog-posts-grid');
            if (!blogGrid || Object.keys(blogPosts).length === 0) return;

            const postCards = Object.keys(blogPosts).map(postId => {
                const post = blogPosts[postId];
                const excerpt = post.excerpt || post.content.replace(/<[^>]*>/g, '').substring(0, 100) + '...';
                
                // サムネイル画像を設定（Sanityから取得、またはデフォルト画像）
                const thumbnail = post.thumbnail || 'images/default-blog.jpg';
                
                return \`
                    <article class="blog-post-card">
                        <img src="\${thumbnail}" alt="\${post.title}" class="blog-post-image" loading="lazy">
                        <div class="blog-post-content">
                            <div class="blog-post-meta">
                                <time class="blog-post-date">\${post.date}</time>
                                <span class="blog-post-category">\${post.category}</span>
                            </div>
                            <h2 class="blog-post-title">
                                <a href="#" onclick="showFullPost('\${postId}'); return false;">\${post.title}</a>
                            </h2>
                            <p class="blog-post-excerpt">\${excerpt}</p>
                            <div class="blog-post-footer">
                                <div class="blog-post-author">
                                    <span>味美ネットワーク</span>
                                </div>
                                <a href="#" class="blog-post-readmore" onclick="showFullPost('\${postId}'); return false;">
                                    続きを読む →
                                </a>
                            </div>
                        </div>
                    </article>
                \`;
            }).join('');

            blogGrid.innerHTML = postCards;
        }

        // ページ読み込み時にブログデータを取得
        document.addEventListener('DOMContentLoaded', function() {
            loadBlogPosts();
        });

        function showFullPost(postId) {
            const post = blogPosts[postId];
            if (post) {
                const modalHtml = \`
                    <div id="postModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
                         background: rgba(0, 0, 0, 0.8); z-index: 1000; display: flex; align-items: center; justify-content: center; 
                         padding: 2rem; box-sizing: border-box;" onclick="closeModal()">
                        <div style="background: white; max-width: 800px; max-height: 90vh; overflow-y: auto; 
                             border-radius: 16px; position: relative;" onclick="event.stopPropagation()">
                            <div style="position: sticky; top: 0; background: white; padding: 1.5rem; border-bottom: 1px solid #eee; 
                                 display: flex; justify-content: space-between; align-items: center; border-radius: 16px 16px 0 0;">
                                <div>
                                    <h2 style="margin: 0; color: #333; font-size: 1.5rem;">\${post.title}</h2>
                                    <div style="margin-top: 0.5rem; color: #666; font-size: 0.9rem;">
                                        <span>\${post.date}</span>
                                        <span style="margin-left: 1rem; background: #E67E22; color: white; 
                                              padding: 0.2rem 0.6rem; border-radius: 12px; font-size: 0.8rem;">\${post.category}</span>
                                    </div>
                                </div>
                                <button onclick="closeModal()" style="background: none; border: none; font-size: 1.5rem; 
                                        color: #999; cursor: pointer; padding: 0.5rem; margin-left: 1rem;" 
                                        onmouseover="this.style.color='#333'" onmouseout="this.style.color='#999'">×</button>
                            </div>
                            <div style="padding: 2rem; line-height: 1.7; color: #444;">
                                \${post.content}
                            </div>
                        </div>
                    </div>
                \`;
                
                document.body.insertAdjacentHTML('beforeend', modalHtml);
                document.body.style.overflow = 'hidden';
            }
        }

        function closeModal() {
            const modal = document.getElementById('postModal');
            if (modal) {
                modal.remove();
                document.body.style.overflow = 'auto';
            }
        }

        // ESCキーでモーダルを閉じる
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                closeModal();
            }
        });
    `;
    
    const newHtmlContent = beforeBlogData + newBlogDataString + afterBlogData;
    
    // ファイルに書き込み
    fs.writeFileSync(blogHtmlPath, newHtmlContent, 'utf8');
    
    console.log('🎉 blog.html完全修復完了！');
    console.log(`📊 修復内容:`);
    console.log(`   - 記事数: ${Object.keys(processedPosts).length}件`);
    console.log(`   - すべて実際のSanity Studioコンテンツに更新`);
    console.log(`   - 2025さくらまつりのお礼記事: ${processedPosts.post2.content.length} characters`);
    
    return true;
    
  } catch (error) {
    console.error('❌ blog.html修復エラー:', error);
    throw error;
  }
}

fixBlogData();