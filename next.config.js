/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    swcPlugins: process.env.NEXT_PUBLIC_TEMPO
      ? [["tempo-devtools/swc", {}]]
      : [],
  },
};

module.exports = nextConfig;
