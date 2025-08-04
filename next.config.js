/** @type {import('next').NextConfig} */
const nextConfig = {
  // 画像最適化無効（既存HTMLとの互換性）
  images: {
    unoptimized: true
  },
  
  // トレーリングスラッシュを無効化
  trailingSlash: false,
}

module.exports = nextConfig