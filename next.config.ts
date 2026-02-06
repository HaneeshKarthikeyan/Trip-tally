import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // <--- This line is mandatory
  images: {
    unoptimized: true,
  },
};

export default nextConfig;