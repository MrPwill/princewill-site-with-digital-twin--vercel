import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  async rewrites() {
    if (process.env.NODE_ENV === "development") {
      return [
        {
          source: "/api/chat/:path*",
          destination: "http://127.0.0.1:8000/api/chat/:path*",
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
