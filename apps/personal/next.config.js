/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@binago/ui', '@binago/utils', '@binago/design-system', '@binago/types'],
};

module.exports = nextConfig;
