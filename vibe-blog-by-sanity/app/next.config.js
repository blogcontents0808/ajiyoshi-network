/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cdn.sanity.io', 'via.placeholder.com'],
  },
  transpilePackages: ['framer-motion'],
  experimental: {
    esmExternals: 'loose',
  },
  async rewrites() {
    return [
      {
        source: '/home',
        destination: '/api/static/index.html',
      },
      {
        source: '/members',
        destination: '/api/static/members.html',
      },
      {
        source: '/history',
        destination: '/api/static/history.html',
      },
      {
        source: '/activities',
        destination: '/api/static/activities.html',
      },
      {
        source: '/contact',
        destination: '/api/static/contact.html',
      },
    ]
  },
}

module.exports = nextConfig