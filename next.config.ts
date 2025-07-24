import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {

    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        pathname: '/dl-ld-scm/avatars/**', // только папка с аватарами
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["doclearn.ru", "localhost:3000"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
