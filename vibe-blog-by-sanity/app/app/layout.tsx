import './globals.css'
import { getSettings } from '@/lib/sanity'

export async function generateMetadata() {
  const settings = await getSettings()
  
  return {
    title: settings?.title || '味美ネットワーク ブログ',
    description: settings?.description || '味美ネットワークの活動報告・お知らせ',
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </head>
      <body className="font-noto">
        <div className="min-h-screen bg-white">
          <header className="header">
            <div className="container">
              <a href="/home" className="header-logo">
                <img src="/images/kantaro_yoroshiku.png" alt="炭ぬり貫太郎" className="logo-character" />
                <h1>味美ネットワーク</h1>
              </a>
              <nav className="header-nav">
                <ul>
                  <li><a href="/home">ホーム</a></li>
                  <li><a href="/home">味美ネットワークとは</a></li>
                  <li><a href="/members.html">メンバー紹介</a></li>
                  <li><a href="/history.html">沿革</a></li>
                  <li><a href="/activities.html">活動内容</a></li>
                  <li><a href="/" className="blog-link">ブログ</a></li>
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
          <main>{children}</main>
          <footer className="footer">
            <div className="container">
              <div className="social-links">
                <a href="https://www.facebook.com/watch/?v=1872150119939498" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://www.instagram.com/ajiyoshi.net.work/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
              <p>© 2024 味美ネットワーク. All Rights Reserved.</p>
            </div>
          </footer>
        </div>
        <script src="/script.js"></script>
      </body>
    </html>
  )
}