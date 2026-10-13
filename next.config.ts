import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Performance optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Enable React strict mode for better performance and error detection
  reactStrictMode: true,

  // Turbopack configuration (Next.js 16+ default)
  turbopack: {
    // Empty config to acknowledge Turbopack usage
    // Webpack config below is only used when explicitly running with --webpack
  },

  // Experimental features for better performance
  experimental: {
    // Enable optimized package imports
    optimizePackageImports: ["lucide-react", "@radix-ui/react-icons"],
  },

  // Webpack optimizations
  webpack: (config, { isServer }) => {
    // Enable tree shaking
    config.optimization = {
      ...config.optimization,
      usedExports: true,
      sideEffects: true,
    };

    // Add bundle analyzer only when ANALYZE=true
    if (process.env.ANALYZE === "true") {
      const { BundleAnalyzerPlugin } = require("webpack-bundle-analyzer");
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: "static",
          reportFilename: isServer
            ? "../analyze/server.html"
            : "./analyze/client.html",
          openAnalyzer: true,
        })
      );
    }

    return config;
  },

  // Long-lived caching for public images in production only. Next.js already
  // caches /_next/static itself; forcing `immutable` there in dev pins stale
  // JS in the browser (dev chunk names don't change when code changes).
  async headers() {
    if (process.env.NODE_ENV !== "production") return [];
    return [
      {
        source: "/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
