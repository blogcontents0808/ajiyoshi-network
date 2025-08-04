/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的ファイル優先設定
  useFileSystemPublicRoutes: true,
  
  // ページとAPIルートを有効化
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 静的アセット配信設定
  assetPrefix: '',
  
  // 画像最適化無効（既存HTMLとの互換性）
  images: {
    unoptimized: true
  },
  
  // トレーリングスラッシュを無効化
  trailingSlash: false,
  
  // カスタムルーティング: 静的HTMLファイルへのアクセスを許可
  async rewrites() {
    return {
      beforeFiles: [
        // 静的HTMLファイルを直接配信
        {
          source: '/:path*.html',
          destination: '/:path*.html',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

module.exports = nextConfig