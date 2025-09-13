/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercelでの静的ファイル配信を優先するため、standaloneを削除
  trailingSlash: false,
  assetPrefix: undefined,
  // 静的HTMLファイルとの共存のため、rewritesを追加
  async rewrites() {
    return [
      // 静的HTMLファイルは直接配信
      {
        source: '/:path*.html',
        destination: '/:path*.html',
      },
    ];
  },
}

module.exports = nextConfig