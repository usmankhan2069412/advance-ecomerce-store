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

// Tempo integration (if needed)
if (process.env.NEXT_PUBLIC_TEMPO) {
  try {
    const fs = require("fs");
    const path = require("path");
    const tempoDevtoolsPath = require.resolve("tempo-devtools");

    // Determine the correct SWC plugin path
    let swcPluginPath = "";
    const possiblePaths = [
      path.join(path.dirname(tempoDevtoolsPath), "swc"),
      path.join(path.dirname(tempoDevtoolsPath), "swc", "index.js"),
      path.join(path.dirname(tempoDevtoolsPath), "swc", "1.0", "index.js"),
    ];

    for (const potentialPath of possiblePaths) {
      if (fs.existsSync(potentialPath)) {
        swcPluginPath = potentialPath;
        break;
      }
    }

    if (swcPluginPath) {
      nextConfig.experimental = {
        ...nextConfig.experimental,
        swcPlugins: [[swcPluginPath, {}]],
      };
      console.log("Tempo SWC plugin path found:", swcPluginPath);
    } else {
      console.warn(
        "Could not find a valid Tempo SWC plugin path. Skipping SWC plugin configuration.",
      );
    }

    // Ensure .next directory and fallback-build-manifest.json exist
    const nextDir = path.join(process.cwd(), ".next");
    const manifestPath = path.join(nextDir, "fallback-build-manifest.json");

    if (!fs.existsSync(nextDir)) {
      fs.mkdirSync(nextDir, { recursive: true });
    }

    if (!fs.existsSync(manifestPath)) {
      fs.writeFileSync(manifestPath, JSON.stringify({ version: 1, pages: {} }));
      console.log("Created fallback-build-manifest.json");
    }
  } catch (error) {
    console.error("Failed to configure Tempo integration:", error);
  }
}

module.exports = nextConfig;
