/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  output: 'standalone',
  transpilePackages: ['@adatrack/ui', '@adatrack/utils', '@adatrack/design-system', '@adatrack/types', '@adatrack/maps', '@adatrack/geofences'],
};

module.exports = nextConfig;

