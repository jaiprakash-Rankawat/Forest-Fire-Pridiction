/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "unpkg.com",
      },
      {
        protocol: "https",
        hostname: "tile.openstreetmap.org",
      },
    ],
    unoptimized: true,
  },
  turbopack: {},
  serverExternalPackages: ["leaflet"],
  webpack: (config) => {
    // This is needed for Leaflet to work properly with Next.js
    config.resolve.fallback = {
      fs: false,
      path: false,
      os: false,
      crypto: false,
      stream: false,
      http: false,
      https: false,
      zlib: false,
    };
    return config;
  },
  // Enable standalone output for production
  output: "standalone",
};

module.exports = nextConfig;
