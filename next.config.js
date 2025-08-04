/** @type {import('next').NextConfig} */
const nextConfig = {
  // 静的ファイル優先設定
  useFileSystemPublicRoutes: true,
  
  // APIルートのみ有効化
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  
  // 静的アセット配信設定
  assetPrefix: '',
  
  // 画像最適化無効（既存HTMLとの互換性）
  images: {
    unoptimized: true
  },
  
  // カスタムルーティング: 静的HTMLを優先
  async rewrites() {
    return {
      beforeFiles: [
        // 静的ファイルを優先
        {
          source: '/:path*',
          destination: '/:path*',
        },
      ],
      afterFiles: [
        // APIルートは正常に動作
      ],
    }
  },
}

module.exports = nextConfig