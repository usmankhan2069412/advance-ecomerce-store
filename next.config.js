/** @type {import('next').NextConfig} */

const nextConfig = {
    images: {
        domains: [
            'images.unsplash.com',
            'lbmatrvcyiefxukntwsu.supabase.co'  // Added Supabase domain
        ],
    },
    reactStrictMode: true,
    swcMinify: true,
    experimental: {
        // Remove Turbopack config as it's causing issues
        optimizeCss: true,
        scrollRestoration: true,
    },
    // Add CORS headers for API routes
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

// Simplified Tempo integration
if (process.env.NEXT_PUBLIC_TEMPO) {
    nextConfig.experimental = {
        ...nextConfig.experimental,
        swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]]
    }
}

module.exports = nextConfig;