/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: `${process.env.HOST || "192.168.236.15:3000"}`,

      },

      {
        protocol: 'https',
        hostname: "storage.googleapis.com"
      }
    ],
  },
};

export default nextConfig;
