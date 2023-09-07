/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    REACT_APP_PROJECT_ID: process.env.REACT_APP_PROJECT_ID,
    REACT_APP_PROJECT_SECRET_KEY: process.env.REACT_APP_PROJECT_SECRET_KEY,
  },
};

module.exports = nextConfig;
