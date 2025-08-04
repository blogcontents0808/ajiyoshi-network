import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // 既存のJavaScript読み込み
    const script = document.createElement('script')
    script.src = '/script.js'
    script.defer = true
    document.body.appendChild(script)

    return () => {
      // クリーンアップ
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [])

  return (
    <>
      <Head>
        <title>味美ネットワーク｜春日井市味美地区の地域コミュニティ</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </Head>

      <div>
        <header className="header">
          <div className="container">
            <a href="index.html" className="header-logo">
              <img src="/images/kantaro_yoroshiku.png" alt="炭ぬり貫太郎" className="logo-character" />
              <h1>味美ネットワーク</h1>
            </a>
            <nav className="header-nav">
              <ul>
                <li><a href="index.html">ホーム</a></li>
                <li><a href="index.html#intro">味美ネットワークとは</a></li>
                <li><a href="/members.html">メンバー紹介</a></li>
                <li><a href="/history.html">沿革</a></li>
                <li><a href="/activities.html">活動内容</a></li>
                <li><a href="http://localhost:3000" className="blog-link" target="_blank">ブログ</a></li>
                <li><a href="/contact.html">お問い合わせ</a></li>
              </ul>
            </nav>
            <button className="hamburger-btn" id="hamburger-btn" aria-label="メニューを開く">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </header>

        <main>
          <section className="hero">
            <div className="container">
              <h2 className="hero-title">この街が、もっと好きになる。</h2>
              <p className="hero-subtitle">自分たちが関わる街が、もっと住みよく愛される街になるように。</p>
            </div>
          </section>

          <section id="intro" className="section fade-in">
            <div className="container">
              <h2 className="section-title">味美ネットワークとは？</h2>
              <p className="section-description">
                味美ネットワークは、春日井市味美地区を中心とした地域コミュニティです。<br />
                地域の皆様と共に、より良い街づくりに取り組んでいます。
              </p>
              
              <div className="features">
                <div className="feature-item fade-in">
                  <div className="feature-icon">
                    <i className="fas fa-users"></i>
                  </div>
                  <h3>地域交流</h3>
                  <p>住民同士の交流を深め、地域のつながりを強化します。</p>
                </div>
                
                <div className="feature-item fade-in">
                  <div className="feature-icon">
                    <i className="fas fa-leaf"></i>
                  </div>
                  <h3>環境活動</h3>
                  <p>地域の環境保護と美化活動に積極的に取り組んでいます。</p>
                </div>
                
                <div className="feature-item fade-in">
                  <div className="feature-icon">
                    <i className="fas fa-heart"></i>
                  </div>
                  <h3>支援活動</h3>
                  <p>地域の高齢者や子育て家庭をサポートしています。</p>
                </div>
              </div>
            </div>
          </section>

          <section className="cta-section">
            <div className="container">
              <h2 className="cta-title">一緒に地域を盛り上げませんか？</h2>
              <p className="cta-description">
                味美ネットワークでは、地域づくりに参加していただける方を募集しています。
              </p>
              <div className="cta-buttons">
                <a href="/contact.html" className="btn btn-primary">
                  <i className="fas fa-envelope"></i>
                  お問い合わせ
                </a>
                <a href="/activities.html" className="btn btn-secondary">
                  <i className="fas fa-calendar-alt"></i>
                  活動内容を見る
                </a>
              </div>
            </div>
          </section>
        </main>

        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <div className="footer-info">
                <div className="footer-logo">
                  <img src="/images/kantaro_yoroshiku.png" alt="炭ぬり貫太郎" className="logo-character" />
                  <h3>味美ネットワーク</h3>
                </div>
                <p>春日井市味美地区の地域コミュニティ</p>
              </div>
              
              <nav className="footer-nav">
                <ul>
                  <li><a href="index.html">ホーム</a></li>
                  <li><a href="/members.html">メンバー紹介</a></li>
                  <li><a href="/history.html">沿革</a></li>
                  <li><a href="/activities.html">活動内容</a></li>
                  <li><a href="/contact.html">お問い合わせ</a></li>
                </ul>
              </nav>
            </div>
            
            <div className="footer-bottom">
              <p>&copy; 2024 味美ネットワーク. All rights reserved.</p>
            </div>
          </div>
        </footer>

        {/* Cookie同意バナー */}
        <div id="cookie-banner" className="cookie-banner" style={{ display: 'none' }}>
          <div className="cookie-content">
            <p>
              このサイトではCookieを使用して、より良いユーザー体験を提供しています。
              <a href="/privacy.html" target="_blank">プライバシーポリシー</a>をご確認ください。
            </p>
            <div className="cookie-buttons">
              <button id="accept-cookies" className="btn btn-primary btn-sm">同意する</button>
              <button id="decline-cookies" className="btn btn-secondary btn-sm">拒否する</button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}