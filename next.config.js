/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
  },
  // Disable automatic static optimization for all pages
  images: {
    domains: ['images.unsplash.com'],
  },
  // Configure server-side functions
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname,
  },
}

module.exports = nextConfig 