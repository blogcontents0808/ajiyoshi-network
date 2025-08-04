import Head from 'next/head'
import { useEffect } from 'react'

export default function Home() {
  useEffect(() => {
    // クライアントサイドでのスクリプト読み込み
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
      });
    };

    // 既存のJavaScriptファイルを読み込み
    loadScript('/script.js').catch(console.error);
    loadScript('/cookie-consent.js').catch(console.error);
  }, []);

  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>味美ネットワーク｜春日井市味美地区の地域コミュニティ</title>
        <link rel="stylesheet" href="/style.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </Head>

      <header className="header">
        <div className="container">
          <a href="/" className="header-logo">
            <img src="/images/kantaro_yoroshiku.png" alt="炭ぬり貫太郎" className="logo-character" />
            <h1>味美ネットワーク</h1>
          </a>
          <nav className="header-nav">
            <ul>
              <li><a href="/">ホーム</a></li>
              <li><a href="/#intro">味美ネットワークとは</a></li>
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
            <div className="intro-content">
              <div className="intro-text">
                <p>味美ネットワークは、春日井市味美地区を中心とした地域コミュニティです。</p>
                <p>私たちは、地域の皆さんが安心して暮らせる街づくりを目指し、様々な活動を行っています。</p>
                <p>お祭りやイベントの企画・運営、地域の課題解決に向けた取り組み、そして何より地域の皆さんとのつながりを大切にしています。</p>
              </div>
              <div className="intro-image">
                <img src="/images/ajiyoshi_fukei.jpg" alt="味美地区の風景" />
              </div>
            </div>
          </div>
        </section>

        <section className="section activities-preview fade-in">
          <div className="container">
            <h2 className="section-title">主な活動</h2>
            <div className="activities-grid">
              <div className="activity-card">
                <img src="/images/ajiyoshi_activities.jpg" alt="地域活動" />
                <h3>地域イベント</h3>
                <p>お祭りや季節のイベントを企画・運営しています。</p>
              </div>
              <div className="activity-card">
                <img src="/images/sum_2023.jpg" alt="夏の活動" />
                <h3>夏の活動</h3>
                <p>夏祭りや子供向けイベントを開催しています。</p>
              </div>
              <div className="activity-card">
                <img src="/images/sak_2024.jpg" alt="桜の季節" />
                <h3>桜の季節</h3>
                <p>桜祭りや地域清掃活動を行っています。</p>
              </div>
            </div>
          </div>
        </section>

        <section className="section cta fade-in">
          <div className="container">
            <h2 className="section-title">一緒に活動しませんか？</h2>
            <p>味美ネットワークでは、新しいメンバーを募集しています。</p>
            <p>地域を愛する気持ちがあれば、どなたでも参加できます。</p>
            <div className="cta-buttons">
              <a href="/contact.html" className="btn btn-primary">お問い合わせ</a>
              <a href="/activities.html" className="btn btn-secondary">活動内容を見る</a>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <img src="/images/kantaro_yoroshiku.png" alt="炭ぬり貫太郎" className="logo-character" />
              <h3>味美ネットワーク</h3>
            </div>
            <nav className="footer-nav">
              <ul>
                <li><a href="/">ホーム</a></li>
                <li><a href="/members.html">メンバー紹介</a></li>
                <li><a href="/history.html">沿革</a></li>
                <li><a href="/activities.html">活動内容</a></li>
                <li><a href="/contact.html">お問い合わせ</a></li>
              </ul>
            </nav>
            <div className="footer-links">
              <a href="/privacy.html">プライバシーポリシー</a>
              <a href="/terms.html">利用規約</a>
              <a href="/data-deletion.html">データ削除について</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 味美ネットワーク. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  )
}