/**
 * Next.js configuration with proper settings to ignore ESLint and TypeScript errors during build
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
  // Additional configuration options can be added here as needed
};

export default nextConfig; 