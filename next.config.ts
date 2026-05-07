import type { NextConfig } from 'next';

const STRAPI_URL = process.env.STRAPI_URL ?? 'http://localhost:1337';
const strapiHostname = new URL(STRAPI_URL).hostname;

const nextConfig: NextConfig = {
  experimental: {
    cacheComponents: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: STRAPI_URL.startsWith('https') ? 'https' : 'http',
        hostname: strapiHostname,
      },
      {
        protocol: 'https',
        hostname: 'images-1258070316.cos.ap-nanjing.myqcloud.com',
      },
    ],
  },
};

export default nextConfig;
