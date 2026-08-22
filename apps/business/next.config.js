/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@adatrack/ui', '@adatrack/utils', '@adatrack/design-system', '@adatrack/types', '@adatrack/maps', '@adatrack/geofences'],
};

module.exports = nextConfig;
