/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // for Docker
  trailingSlash: false,
};

export default nextConfig;
