import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@svazqz/api-contract-kit'],
  experimental: {
    externalDir: true,
  },
};

export default nextConfig;
