import { createClient } from 'next-sanity'
import imageUrlBuilder from '@sanity/image-url'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2023-05-03',
  useCdn: true,
})

const builder = imageUrlBuilder(client)

export const urlFor = (source: any) => builder.image(source)

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