import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["www.themealdb.com"], // whitelist TheMealDB image domain
  },
  reactCompiler: true,
};

export default nextConfig;
