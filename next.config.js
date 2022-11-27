/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: { domains: ["api-cdn.myanimelist.net"] },
  webpack: (config) => {
    config.experiments = {
        "topLevelAwait": true
    }
    return config
  },
};

module.exports = nextConfig;
