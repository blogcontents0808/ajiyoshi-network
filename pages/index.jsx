import Head from 'next/head'

export default function Home() {
  return (
    <>
      <Head>
        <title>メンテナンス中 | 味美ネットワーク</title>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@400;700&display=swap" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css" />
      </Head>
      <style jsx global>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Noto Sans JP', sans-serif;
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          text-align: center;
          padding: 20px;
        }
        .maintenance-container {
          max-width: 600px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .icon {
          font-size: 80px;
          margin-bottom: 30px;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        h1 {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 20px;
        }
        .subtitle {
          font-size: 18px;
          line-height: 1.8;
          margin-bottom: 30px;
          opacity: 0.9;
        }
        .message {
          font-size: 14px;
          opacity: 0.7;
          line-height: 1.6;
        }
        .logo {
          margin-top: 40px;
          font-size: 16px;
          opacity: 0.8;
        }
        @media (max-width: 480px) {
          .maintenance-container {
            padding: 30px 20px;
          }
          h1 {
            font-size: 22px;
          }
          .subtitle {
            font-size: 16px;
          }
          .icon {
            font-size: 60px;
          }
        }
      `}</style>

      <div className="maintenance-container">
        <div className="icon">
          <i className="fas fa-tools"></i>
        </div>
        <h1>ただいまメンテナンス中です</h1>
        <p className="subtitle">
          サイトの改善作業を行っております。<br />
          ご不便をおかけして申し訳ございません。
        </p>
        <p className="message">
          しばらく経ってから再度アクセスしてください。<br />
          お急ぎの場合は、SNSからお問い合わせください。
        </p>
        <div className="logo">
          <p>味美ネットワーク</p>
        </div>
      </div>
    </>
  )
}