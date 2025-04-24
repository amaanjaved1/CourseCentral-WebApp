/**
 * Next.js configuration optimized for Vercel deployment
 */
const nextConfig = {
  /* config options here */
  output: 'standalone',
  eslint: {
    // Don't run ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Don't run type checking during builds
    ignoreBuildErrors: true,
  },
  // Increase memory limit for builds
  experimental: {
    serverMinification: true,
    serverSourceMaps: false,
  },
  // Setting strict mode for React
  reactStrictMode: true,
  // Add image domains if needed
  images: {
    // Add any domains you need to load images from
    domains: [],
    // Set reasonable image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Disable x-powered-by header for security
  poweredByHeader: false,
  // Additional configuration options can be added here as needed
};

export default nextConfig; 