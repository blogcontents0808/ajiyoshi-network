/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  experimental: {
    outputFileTracingRoot: undefined,
  },
}

module.exports = nextConfig