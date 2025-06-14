/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Run data transformation during build using dynamic import
      import('./lib/transform.mjs').then(({ buildAggregates }) => {
        buildAggregates().catch(console.error);
      }).catch(console.error);
    }
    return config;
  },
};

export default nextConfig;