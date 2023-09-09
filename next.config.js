/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PINATA_JWT: process.env.PINATA_JWT,
  },
  images: {
    domains: ['gateway.pinata.cloud'],
  },
};

module.exports = nextConfig;
