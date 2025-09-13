import { getPosts } from '@/lib/sanity'
import { urlForImage } from '@/lib/urlForImage'
import Link from 'next/link'
import Image from 'next/image'

// 動的レンダリングを強制してビルド時エラーを回避
export const dynamic = 'force-dynamic'

export default async function Home() {
  const posts = await getPosts()

  return (
    <div>
      <section className="blog-hero">
        <div className="blog-hero-content">
          <div className="container">
            <h1>活動報告・お知らせ</h1>
            <p>味美ネットワークの最新情報をお伝えします</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {posts.length > 0 ? (
            <div className="blog-posts-grid">
              {posts.map((post: any) => (
                <article key={post._id} className="blog-post-card">
                  {post.thumbnail && (
                    <Image
                      src={urlForImage(post.thumbnail, 600)}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="blog-post-image"
                    />
                  )}
                  <div className="blog-post-content">
                    <div className="blog-post-meta">
                      <time className="blog-post-date">
                        {new Date(post.publishedAt).toLocaleDateString('ja-JP')}
                      </time>
                      {post.category && (
                        <span
                          className="blog-post-category"
                          style={{ backgroundColor: post.category.color }}
                        >
                          {post.category.title}
                        </span>
                      )}
                    </div>
                    <h2 className="blog-post-title">
                      <Link href={`/posts/${post.slug.current}`}>
                        {post.title}
                      </Link>
                    </h2>
                    {post.excerpt && (
                      <p className="blog-post-excerpt">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="blog-post-footer">
                      <div className="blog-post-author">
                        {post.author?.avatar && (
                          <Image
                            src={urlForImage(post.author.avatar, 40)}
                            alt={post.author.name}
                            width={40}
                            height={40}
                          />
                        )}
                        <span>{post.author?.name}</span>
                      </div>
                      <Link
                        href={`/posts/${post.slug.current}`}
                        className="blog-post-readmore"
                      >
                        続きを読む →
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="blog-empty">
              <h2>記事がありません</h2>
              <p>
                まだ記事がありません。<br />
                Sanity Studioで記事を作成してください。
              </p>
              <Link href="/studio" className="btn">
                Sanity Studioを開く
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}