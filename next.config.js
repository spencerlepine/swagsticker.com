/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  trailingSlash: false,
  experimental: {
    optimizePackageImports: ['react-icons'],
  },
  swcMinify: true,
  output: 'standalone', // for Docker
};

module.exports = nextConfig