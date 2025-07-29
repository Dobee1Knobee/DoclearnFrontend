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
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    unoptimized: true,
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
