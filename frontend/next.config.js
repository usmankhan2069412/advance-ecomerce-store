/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com", "lbmatrvcyiefxukntwsu.supabase.co"],
  },
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Optimize chunk loading
    config.optimization.splitChunks = {
      chunks: "all",
      minSize: 20000,
      maxSize: 70000,
      cacheGroups: {
        default: false,
        vendors: false,
        commons: {
          name: "commons",
          chunks: "all",
          minChunks: 2,
          reuseExistingChunk: true,
        },
        shared: {
          name: (module, chunks) => {
            return `shared-${chunks.map((c) => c.name).join("-")}`;
          },
          test: /[\\/]node_modules[\\/]/,
          chunks: "all",
          minChunks: 2,
          reuseExistingChunk: true,
        },
      },
    };
    return config;
  },
  experimental: {
    optimizeCss: true,
    scrollRestoration: true,
  },
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
          { key: "Access-Control-Allow-Methods", value: "GET,POST,PUT,DELETE" },
        ],
      },
    ];
  },
};

// Tempo integration
if (process.env.NEXT_PUBLIC_TEMPO) {
  // Use a more compatible configuration for the SWC plugin
  nextConfig.experimental = {
    ...nextConfig.experimental,
    swcPlugins: [],
  };
}

module.exports = nextConfig;
