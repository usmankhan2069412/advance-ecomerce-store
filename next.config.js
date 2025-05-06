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
          {
            protocol: 'https',
            hostname: 'placehold.co',
          },
        ],
        dangerouslyAllowSVG: true,
        contentDispositionType: 'attachment',
        contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
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
                        priority: -10
                    },
                    framework: {
                        name: 'framework',
                        test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
                        chunks: 'all',
                        priority: 40,
                        enforce: true,
                        reuseExistingChunk: true
                    },
                    lib: {
                        test: /[\\/]node_modules[\\/]/,
                        name(module) {
                            // Get the name. E.g. node_modules/packageName/not/this/part.js
                            // or node_modules/packageName
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            // Some package names need special handling
                            if (packageName === 'tempo-devtools') {
                                return 'npm.tempo';
                            }

                            // npm package names are URL-safe, but some servers don't like @ symbols
                            return `npm.${packageName.replace('@', '')}`;
                        },
                        priority: 30,
                        chunks: 'all',
                        reuseExistingChunk: true
                    },
                    shared: {
                        name: (_, chunks) => {
                            return `shared-${chunks.map(c => c.name).join('-')}`
                        },
                        test: /[\\/]node_modules[\\/]/,
                        chunks: 'all',
                        minChunks: 2,
                        reuseExistingChunk: true,
                        priority: 10
                    }
                }
            };
        }

        // Add error handling for chunk loading
        const originalEntry = config.entry;
        config.entry = async () => {
            const entries = await originalEntry();

            // Add chunk error handling to all entries
            if (entries['main.js'] && !entries['main.js'].includes('chunk-error-handling')) {
                entries['main.js'].unshift('./src/utils/chunk-error-handling.js');
            }

            return entries;
        };

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