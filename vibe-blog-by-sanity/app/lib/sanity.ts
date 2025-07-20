import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'
import { mockPosts, mockCategories, mockSettings, mockAuthor } from './mockData'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
  requestTagPrefix: 'ajiyoshi-network',
  withCredentials: false,
  timeout: 10000, // 10秒でタイムアウト
  maxRetries: 2,
  retryDelay: (attemptNumber: number) => 1000 * attemptNumber,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => {
  if (!source || !source.asset) {
    // モックデータ用のプレースホルダー画像
    const mockImageBuilder = {
      url: () => 'https://via.placeholder.com/800x400/4A90E2/FFFFFF?text=味美ネットワーク',
      width: (_w: number) => mockImageBuilder,
      height: (_h: number) => mockImageBuilder,
      fit: (_mode: string) => mockImageBuilder,
      auto: (_mode: string) => mockImageBuilder,
      format: (_format: string) => mockImageBuilder
    }
    return mockImageBuilder
  }
  return builder.image(source)
}

// GROQクエリ
export const postsQuery = `
  *[_type == "post" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    thumbnail,
    category->{
      title,
      slug,
      color
    },
    author->{
      name,
      slug,
      avatar
    },
    tags
  }
`

export const postQuery = `
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
    publishedAt,
    thumbnail,
    category->{
      title,
      slug,
      color
    },
    author->{
      name,
      slug,
      avatar,
      bio,
      social
    },
    tags
  }
`

export const categoriesQuery = `
  *[_type == "category"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    color
  }
`

export const postsByCategoryQuery = `
  *[_type == "post" && published == true && category->slug.current == $category] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    thumbnail,
    category->{
      title,
      slug,
      color
    },
    author->{
      name,
      slug,
      avatar
    },
    tags
  }
`

export const settingsQuery = `
  *[_type == "setting"][0] {
    title,
    description,
    url,
    logo,
    favicon,
    ogImage,
    googleAnalyticsId,
    socialLinks
  }
`

// フォールバック機能付きデータフェッチ関数
export async function getPosts() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  
  // ビルド時またはプロジェクトIDが未設定の場合はモックデータを返す
  if (projectId === 'your-project-id' || process.env.NODE_ENV === 'production') {
    console.warn('Sanityプロジェクトが設定されていないか、ビルド時のため、モックデータを使用します')
    return mockPosts
  }
  
  try {
    return await client.fetch(postsQuery)
  } catch (error) {
    console.error('Sanityからのデータ取得に失敗しました:', error)
    return mockPosts
  }
}

export async function getPost(slug: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  
  // ビルド時またはプロジェクトIDが未設定の場合はモックデータを返す
  if (projectId === 'your-project-id' || process.env.NODE_ENV === 'production') {
    console.warn('Sanityプロジェクトが設定されていないか、ビルド時のため、モックデータを使用します')
    return mockPosts.find(post => post.slug.current === slug) || null
  }
  
  try {
    return await client.fetch(postQuery, { slug })
  } catch (error) {
    console.error('Sanityからのデータ取得に失敗しました:', error)
    return mockPosts.find(post => post.slug.current === slug) || null
  }
}

export async function getCategories() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  
  // ビルド時またはプロジェクトIDが未設定の場合はモックデータを返す
  if (projectId === 'your-project-id' || process.env.NODE_ENV === 'production') {
    console.warn('Sanityプロジェクトが設定されていないか、ビルド時のため、モックデータを使用します')
    return mockCategories
  }
  
  try {
    return await client.fetch(categoriesQuery)
  } catch (error) {
    console.error('Sanityからのデータ取得に失敗しました:', error)
    return mockCategories
  }
}

export async function getPostsByCategory(category: string) {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  
  // ビルド時またはプロジェクトIDが未設定の場合はモックデータを返す
  if (projectId === 'your-project-id' || process.env.NODE_ENV === 'production') {
    console.warn('Sanityプロジェクトが設定されていないか、ビルド時のため、モックデータを使用します')
    return mockPosts.filter(post => post.category.slug.current === category)
  }
  
  try {
    return await client.fetch(postsByCategoryQuery, { category })
  } catch (error) {
    console.error('Sanityからのデータ取得に失敗しました:', error)
    return mockPosts.filter(post => post.category.slug.current === category)
  }
}

export async function getSettings() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id'
  
  // ビルド時またはプロジェクトIDが未設定の場合はモックデータを返す
  if (projectId === 'your-project-id' || process.env.NODE_ENV === 'production') {
    console.warn('Sanityプロジェクトが設定されていないか、ビルド時のため、モックデータを使用します')
    return mockSettings
  }
  
  try {
    return await client.fetch(settingsQuery)
  } catch (error) {
    console.error('Sanityからのデータ取得に失敗しました:', error)
    return mockSettings
  }
}

// Sanity接続テスト機能
export async function testSanityConnection() {
  try {
    const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
    console.log('Testing Sanity connection for project:', projectId)
    
    // 基本的な接続テスト
    const result = await client.fetch(`*[_type == "post"][0..0]`)
    console.log('Connection test result:', result)
    
    return { 
      success: true, 
      data: result,
      projectId,
      message: 'Sanity接続成功'
    }
  } catch (error) {
    console.error('Sanity connection error:', error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error),
      projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
      message: 'Sanity接続エラー'
    }
  }
}