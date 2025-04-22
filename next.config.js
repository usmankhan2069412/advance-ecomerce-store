/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'images.unsplash.com',
          },
          {
            protocol: 'https',
            hostname: 'lbmatrvcyiefxukntwsu.supabase.co',
          },
        ],
      },

    reactStrictMode: true,
    webpack: (config, { dev }) => {
        // Only apply custom chunk splitting in production
        if (!dev) {
            // Optimize chunk loading
            config.optimization.splitChunks = {
                chunks: 'all',
                minSize: 20000,
                maxSize: 70000,
                cacheGroups: {
                    default: false,
                    vendors: false,
                    commons: {
                        name: 'commons',
                        chunks: 'all',
                        minChunks: 2,
                        reuseExistingChunk: true,
                    },
                    shared: {
                        name: (_, chunks) => {
                            return `shared-${chunks.map(c => c.name).join('-')}`
                        },
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        minChunks: 2,
                        reuseExistingChunk: true,
                    }
                }
            };
        }
        return config;
    },
    experimental: {
        optimizeCss: true,
        scrollRestoration: true
    },
    async headers() {
        return [
            {
                source: '/api/:path*',
                headers: [
                    { key: 'Access-Control-Allow-Origin', value: '*' },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE' },
                ]
            }
        ]
    }
};

// Tempo integration (if needed)
if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig.experimental = {
        ...nextConfig.experimental,
        swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]
    }
}

module.exports = nextConfig;