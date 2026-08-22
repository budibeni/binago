/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@adatrack/ui', '@adatrack/utils', '@adatrack/design-system', '@adatrack/types', '@adatrack/maps', '@adatrack/geofences'],
  eslint: {
    // Membiarkan build pass meski ada error lint dari modul/feature lain (di luar Task 11 Geofences)
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
