const { createClient } = require('@sanity/client')

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qier3tei',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2023-05-03',
  useCdn: false, // リアルタイム更新のためfalse
})

// CORS設定のヘルパー関数
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
}

// 日付フォーマット関数
function formatDate(dateString) {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    return `${year}年${month}月${day}日`
  } catch (error) {
    return dateString
  }
}

// カテゴリ名をマッピング
function mapCategoryName(category) {
  const categoryMap = {
    'activity': '活動報告',
    'news': 'お知らせ',
    '活動報告': '活動報告',
    'お知らせ': 'お知らせ'
  }
  
  return categoryMap[category] || category || 'お知らせ'
}

// ポータブルテキストをHTMLに変換（簡易版）
function convertPortableTextToHtml(blocks) {
  if (!blocks || !Array.isArray(blocks)) return ''
  
  return blocks.map(block => {
    if (block._type === 'block') {
      const style = block.style || 'normal'
      const children = block.children || []
      
      let content = children.map(child => {
        if (child._type === 'span') {
          let text = child.text || ''
          
          // マークの処理
          if (child.marks && child.marks.length > 0) {
            child.marks.forEach(mark => {
              if (mark === 'strong') {
                text = `<strong>${text}</strong>`
              } else if (mark === 'em') {
                text = `<em>${text}</em>`
              }
            })
          }
          
          return text
        }
        return child.text || ''
      }).join('')
      
      // スタイルに応じてタグを選択
      switch (style) {
        case 'h1':
          return `<h1>${content}</h1>`
        case 'h2':
          return `<h2>${content}</h2>`
        case 'h3':
          return `<h3>${content}</h3>`
        case 'blockquote':
          return `<blockquote>${content}</blockquote>`
        default:
          return `<p>${content}</p>`
      }
    } else if (block._type === 'image') {
      // 画像の処理（Sanity CDNのURL生成）
      if (block.asset && block.asset._ref) {
        const imageUrl = `https://cdn.sanity.io/images/qier3tei/production/${block.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}`
        const alt = block.alt || 'ブログ画像'
        return `<p style="text-align: center; margin: 2rem 0;"><img src="${imageUrl}" alt="${alt}" style="max-width: 100%; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"></p>`
      }
    }
    
    return ''
  }).join('\n')
}

module.exports = async (req, res) => {
  // CORS設定
  setCorsHeaders(res)
  
  // OPTIONSリクエストの処理
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }
  
  try {
    console.log('ブログデータ取得開始...')
    
    // 公開済み記事を取得（最新順）
    const posts = await client.fetch(`
      *[_type == "post" && published == true] | order(publishedAt desc) {
        _id,
        title,
        slug,
        excerpt,
        content,
        publishedAt,
        thumbnail,
        category->{
          title,
          slug
        },
        author->{
          name,
          slug
        }
      }
    `)
    
    console.log(`取得記事数: ${posts.length}`)
    
    // フロントエンド用にデータを変換
    const formattedPosts = {}
    
    posts.forEach((post, index) => {
      const postId = `post${index + 1}`
      
      formattedPosts[postId] = {
        title: post.title || 'タイトル未設定',
        date: formatDate(post.publishedAt),
        category: mapCategoryName(post.category?.title),
        content: convertPortableTextToHtml(post.content),
        excerpt: post.excerpt || post.title || '',
        slug: post.slug?.current || '',
        thumbnail: post.thumbnail ? `https://cdn.sanity.io/images/qier3tei/production/${post.thumbnail.asset._ref.replace('image-', '').replace('-jpg', '.jpg').replace('-png', '.png')}` : null
      }
    })
    
    console.log('データ変換完了')
    
    // レスポンス
    res.status(200).json({
      success: true,
      posts: formattedPosts,
      total: posts.length,
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('ブログデータ取得エラー:', error.message)
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'ブログデータの取得に失敗しました'
    })
  }
}