import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
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
            <div className="intro-text">
              <p>私たち味美ネットワークは、自分たちが関わる街が住みよく愛される街になるように、春日井市南部の味美地区を中心に、平成４年より活動しています。</p>
              <p>味美の夏夜を彩るサマーフェスタ味美（味美炭ぬりまつり）をはじめ、春は白山神社さくらまつりと地域の皆様に楽しんでいただける事業を中心に取り組んでいます。</p>
              <p>街作りは行政や大企業だけの力ではどうにもなりません。地域に住む人々の想いにこそ大きな可能性があります。そんな想いを発信していく団体が味美ネットワークです。</p>
            </div>
          </div>
        </section>

        <section id="blog-section" className="section blog-highlight fade-in">
          <div className="container">
            <div className="blog-banner">
              <div className="blog-banner-content">
                <div className="blog-banner-text">
                  <h2 className="blog-banner-title">活動報告・お知らせ</h2>
                  <p className="blog-banner-subtitle">味美ネットワークの最新情報をブログで発信中！</p>
                  <p className="blog-banner-description">イベントの開催報告や地域の情報、メンバーの活動など、味美ネットワークの「今」をお伝えします。</p>
                </div>
                <div className="blog-banner-action">
                  <a href="/" className="blog-btn">
                    <i className="fas fa-external-link-alt"></i>
                    ブログを見る
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section section-bg fade-in">
          <div className="container">
            <h2 className="section-title">味美ネットワークについて</h2>
            <div className="card-grid">
              <div className="card fade-in">
                <div className="card-icon"><i className="fas fa-users"></i></div>
                <div className="card-content">
                  <h3 className="card-title">参加メンバー紹介</h3>
                  <p className="card-text">味美ネットワークで活動する、地域を愛する個性豊かなメンバーを紹介します。</p>
                  <a href="/members" className="btn">詳しく見る</a>
                </div>
              </div>
              <div className="card fade-in">
                <div className="card-icon"><i className="fas fa-landmark"></i></div>
                <div className="card-content">
                  <h3 className="card-title">これまでの活動（沿革）</h3>
                  <p className="card-text">平成4年の発足から現在までの、私たちの歩みと主な活動の歴史をご紹介します。</p>
                  <a href="/history" className="btn">詳しく見る</a>
                </div>
              </div>
              <div className="card fade-in">
                <div className="card-icon"><i className="fas fa-star"></i></div>
                <div className="card-content">
                  <h3 className="card-title">主な活動内容</h3>
                  <p className="card-text">お祭りやイベントなど、私たちが取り組んでいる具体的な活動内容を紹介します。</p>
                  <a href="/activities" className="btn">詳しく見る</a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}