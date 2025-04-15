/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['mongoose']
  },
  webpack: (config) => {
    // This is to handle the MongoDB connection issues
    config.experiments = {
      ...config.experiments,
      topLevelAwait: true,
    }
    return config
  },
  // Disable static optimization for certain routes that need to be dynamic
  excludeDefaultMomentLocales: false,
  images: {
    domains: ['*'],
  },
  // Increase serverless function timeout
  serverRuntimeConfig: {
    PROJECT_ROOT: __dirname
  }
}

module.exports = nextConfig 