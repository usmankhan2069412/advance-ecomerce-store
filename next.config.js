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
            hostname: '*.supabase.co', // Use wildcard for Supabase subdomains
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
    
    // Environment variables validation
    env: {
        CUSTOM_KEY: process.env.CUSTOM_KEY,
    },

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
                            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

                            if (packageName === 'tempo-devtools') {
                                return 'npm.tempo';
                            }

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

            // Add chunk error handling to all entries
            const originalEntry = config.entry;
            config.entry = async () => {
                const entries = await originalEntry();

                if (entries['main.js'] && !entries['main.js'].includes('chunk-error-handling')) {
                    entries['main.js'].unshift('./src/utils/chunk-error-handling.js');
                }

                return entries;
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
                    // More restrictive CORS - replace '*' with your actual domain in production
                    { 
                        key: 'Access-Control-Allow-Origin', 
                        value: process.env.NODE_ENV === 'production' 
                            ? 'https://yourdomain.com' 
                            : 'http://localhost:3000'
                    },
                    { key: 'Access-Control-Allow-Methods', value: 'GET,POST,PUT,DELETE,OPTIONS' },
                    { key: 'Access-Control-Allow-Headers', value: 'Content-Type, Authorization' },
                    { key: 'Access-Control-Max-Age', value: '86400' },
                ]
            },
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    }
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