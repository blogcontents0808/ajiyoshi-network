const fs = require('fs')
const path = require('path')
const { createClient } = require('@sanity/client')

// Simple .env.local parser for this script
function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return
  
  const content = fs.readFileSync(filePath, 'utf8')
  content.split('\n').forEach(line => {
    line = line.trim()
    if (line && !line.startsWith('#')) {
      const [key, ...values] = line.split('=')
      if (key && values.length > 0) {
        process.env[key] = values.join('=').replace(/^"|"$/g, '')
      }
    }
  })
}

// Load environment variables from .env.local
loadEnvFile(path.join(__dirname, '../.env.local'))

// Debug: Check loaded environment variables
console.log('Loaded Sanity config:')
console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qier3tei')
console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET || 'production')

// Sanity client configuration
const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'qier3tei',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
})

// contentsディレクトリのパス
const contentsDir = path.join(__dirname, '../../contents')

// 記事をインポートする関数
async function importPosts() {
  const postsDir = path.join(contentsDir, 'posts')
  
  if (!fs.existsSync(postsDir)) {
    console.log('posts directory not found')
    return
  }

  const postDirs = fs.readdirSync(postsDir)
  
  for (const postDir of postDirs) {
    const postPath = path.join(postsDir, postDir)
    const textPath = path.join(postPath, 'text.md')
    
    if (fs.existsSync(textPath)) {
      const content = fs.readFileSync(textPath, 'utf-8')
      const [frontmatter, ...bodyParts] = content.split('---').slice(1)
      const body = bodyParts.join('---').trim()
      
      // Parse frontmatter
      const meta = {}
      frontmatter.split('\\n').forEach(line => {
        const [key, ...valueParts] = line.split(':')
        if (key && valueParts.length > 0) {
          const value = valueParts.join(':').trim()
          meta[key.trim()] = value
        }
      })
      
      // Create Sanity document
      const doc = {
        _type: 'post',
        title: meta.title || 'Untitled',
        slug: {
          _type: 'slug',
          current: postDir
        },
        excerpt: meta.excerpt || '',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [
              {
                _type: 'span',
                text: body
              }
            ]
          }
        ],
        publishedAt: new Date(meta.date || Date.now()).toISOString(),
        published: meta.publish === 'true',
        tags: meta.tags || []
      }
      
      try {
        await client.create(doc)
        console.log(`Imported post: ${meta.title}`)
      } catch (error) {
        console.error(`Error importing post ${postDir}:`, error)
      }
    }
  }
}

// 著者情報をインポートする関数
async function importAuthor() {
  const authorPath = path.join(contentsDir, 'common', 'author.md')
  
  if (fs.existsSync(authorPath)) {
    const content = fs.readFileSync(authorPath, 'utf-8')
    const [frontmatter, ...bodyParts] = content.split('---').slice(1)
    const bio = bodyParts.join('---').trim()
    
    // Parse frontmatter
    const meta = {}
    frontmatter.split('\\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length > 0) {
        const value = valueParts.join(':').trim()
        meta[key.trim()] = value
      }
    })
    
    const authorDoc = {
      _type: 'author',
      name: meta.name || 'Unknown Author',
      slug: {
        _type: 'slug',
        current: 'default-author'
      },
      role: meta.role || '',
      bio: bio,
      social: meta.social || {}
    }
    
    try {
      await client.create(authorDoc)
      console.log(`Imported author: ${meta.name}`)
    } catch (error) {
      console.error('Error importing author:', error)
    }
  }
}

// メイン処理
async function main() {
  console.log('Starting content import...')
  
  try {
    await importAuthor()
    await importPosts()
    console.log('Import completed successfully!')
  } catch (error) {
    console.error('Import failed:', error)
  }
}

main()