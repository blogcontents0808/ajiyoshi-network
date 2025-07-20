import { getPost, urlFor } from '@/lib/sanity'
import { PortableText } from '@portabletext/react'
import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'

// 動的レンダリングを強制してビルド時エラーを回避
export const dynamic = 'force-dynamic'

export default async function Post({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug)
  
  if (!post) {
    notFound()
  }

  return (
    <div>
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="container">
            <h1>{post.title}</h1>
            <div className="blog-post-meta" style={{ justifyContent: 'center', color: '#fff', opacity: 0.9 }}>
              <time>
                {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
              </time>
              {post.category && (
                <span
                  className="blog-post-category"
                  style={{ backgroundColor: 'rgba(255,255,255,0.2)', color: '#fff' }}
                >
                  {post.category.title}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <article className="blog-post-single">
            {post.thumbnail && (
              <div className="blog-post-thumbnail">
                <Image
                  src={urlFor(post.thumbnail).width(1200).height(600).url()}
                  alt={post.title}
                  width={1200}
                  height={600}
                  className="blog-post-image"
                  style={{ width: '100%', height: 'auto', maxHeight: '400px', objectFit: 'cover', borderRadius: '12px', marginBottom: '30px' }}
                />
              </div>
            )}

            <div className="blog-post-content-wrapper">
              <div className="blog-post-content">
                <PortableText
                  value={post.content}
                  components={{
                    types: {
                      image: ({ value }) => (
                        <div style={{ margin: '30px 0' }}>
                          <Image
                            src={urlFor(value).width(800).height(600).url()}
                            alt={value.alt || ''}
                            width={800}
                            height={600}
                            style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                          />
                        </div>
                      ),
                    },
                    block: {
                      h1: ({ children }) => <h1 style={{ fontSize: '2rem', marginBottom: '20px', marginTop: '40px' }}>{children}</h1>,
                      h2: ({ children }) => <h2 style={{ fontSize: '1.5rem', marginBottom: '15px', marginTop: '30px' }}>{children}</h2>,
                      h3: ({ children }) => <h3 style={{ fontSize: '1.3rem', marginBottom: '12px', marginTop: '25px' }}>{children}</h3>,
                      normal: ({ children }) => <p style={{ marginBottom: '20px', lineHeight: '1.8' }}>{children}</p>,
                      blockquote: ({ children }) => (
                        <blockquote style={{ borderLeft: '4px solid var(--primary-color)', paddingLeft: '20px', margin: '30px 0', fontStyle: 'italic', color: '#666' }}>
                          {children}
                        </blockquote>
                      ),
                    },
                    list: {
                      bullet: ({ children }) => <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>{children}</ul>,
                      number: ({ children }) => <ol style={{ marginBottom: '20px', paddingLeft: '20px' }}>{children}</ol>,
                    },
                    listItem: {
                      bullet: ({ children }) => <li style={{ marginBottom: '8px' }}>{children}</li>,
                      number: ({ children }) => <li style={{ marginBottom: '8px' }}>{children}</li>,
                    },
                    marks: {
                      strong: ({ children }) => <strong>{children}</strong>,
                      em: ({ children }) => <em>{children}</em>,
                      code: ({ children }) => (
                        <code style={{ backgroundColor: '#f5f5f5', padding: '2px 6px', borderRadius: '4px', fontSize: '0.9em' }}>
                          {children}
                        </code>
                      ),
                      link: ({ children, value }) => (
                        <a href={value.href} style={{ color: 'var(--primary-color)', textDecoration: 'none' }} target="_blank" rel="noopener noreferrer">
                          {children}
                        </a>
                      ),
                    },
                  }}
                />
              </div>

              <div className="blog-post-author-info" style={{ marginTop: '50px', padding: '30px', backgroundColor: 'var(--bg-color-light)', borderRadius: '12px' }}>
                <div className="blog-post-author">
                  {post.author?.avatar && (
                    <Image
                      src={urlFor(post.author.avatar).width(80).height(80).url()}
                      alt={post.author.name}
                      width={80}
                      height={80}
                      style={{ width: '60px', height: '60px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                  )}
                  <div>
                    <h4 style={{ margin: '0 0 5px 0', fontSize: '1.1rem' }}>{post.author?.name}</h4>
                    {post.author?.bio && (
                      <p style={{ margin: '0', color: '#666', fontSize: '0.9rem', lineHeight: '1.6' }}>{post.author.bio}</p>
                    )}
                    {post.author?.social && (
                      <div style={{ marginTop: '15px', display: 'flex', gap: '15px' }}>
                        {post.author.social.facebook && (
                          <a href={post.author.social.facebook} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                            <i className="fab fa-facebook-f"></i>
                          </a>
                        )}
                        {post.author.social.instagram && (
                          <a href={post.author.social.instagram} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                            <i className="fab fa-instagram"></i>
                          </a>
                        )}
                        {post.author.social.twitter && (
                          <a href={post.author.social.twitter} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)' }}>
                            <i className="fab fa-twitter"></i>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="blog-post-navigation" style={{ marginTop: '40px', textAlign: 'center' }}>
                <Link href="/" className="btn">
                  ← ブログ一覧に戻る
                </Link>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}