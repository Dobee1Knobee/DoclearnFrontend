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

  async rewrites() {
    return [
      {
        source: '/auth/:path*',
        destination: 'http://localhost:8080/auth/:path*',
      },
      {
        source: '/user/:path*',
        destination: 'http://localhost:8080/user/:path*',
      },
      {
        source: '/admin/:path*',
        destination: 'http://localhost:8080/admin/:path*',
      },
      {
        source: '/post/:path*',
        destination: 'http://localhost:8080/post/:path*',
      },
    ]
  },

  experimental: {
    serverActions: {
      allowedOrigins: ["doclearn.ru", "localhost:3000", "localhost:3002"],
    },
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
