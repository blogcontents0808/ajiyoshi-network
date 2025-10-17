/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercelでの静的ファイル配信を優先するため、standaloneを削除
  trailingSlash: false,
  assetPrefix: undefined,
  // セキュリティヘッダーの設定
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // Content Security Policy - XSS攻撃対策
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
              "style-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com https://fonts.googleapis.com",
              "img-src 'self' data: https: blob:",
              "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com",
              "connect-src 'self' https://api.vercel.com",
              "frame-src 'none'",
              "object-src 'none'",
              "base-uri 'self'",
              "form-action 'self'",
              "frame-ancestors 'none'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
          // セキュリティ関連ヘッダー
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block'
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin'
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=(), payment=()'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload'
          }
        ]
      },
      // API エンドポイント用の追加セキュリティ
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value: 'noindex, nofollow'
          },
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0'
          }
        ]
      }
    ];
  },
  // 静的HTMLファイルとの共存のため、rewritesとredirectsを追加
  async redirects() {
    return [
      // index.htmlへのアクセスはルートにリダイレクト
      {
        source: '/index.html',
        destination: '/',
        permanent: true,
      },
    ];
  },
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