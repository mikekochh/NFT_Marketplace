/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    PINATA_JWT: process.env.PINATA_JWT,
    PINATA_API_KEY: process.env.PINATA_API_KEY,
    PINATA_SECRET_KEY: process.env.PINATA_SECRET_KEY,
  },
  images: {
    domains: ['gateway.pinata.cloud'],
  },
};

module.exports = nextConfig;
