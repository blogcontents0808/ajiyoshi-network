/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化無効（既存HTMLとの互換性）
  images: {
    unoptimized: true
  },
  
  // トレーリングスラッシュを無効化
  trailingSlash: false,
  
  // 静的ファイルへのリライト設定
  async rewrites() {
    return [
      {
        source: '/',
        destination: '/index.html'
      },
      {
        source: '/index.html',
        destination: '/index.html'
      }
    ]
  }
}

module.exports = nextConfig