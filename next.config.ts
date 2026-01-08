import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // Add the Cloudinary domain to allow Next.js Image optimization
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
