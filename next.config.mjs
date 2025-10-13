/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // 禁用React严格模式
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
