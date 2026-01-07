import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    domains: ["www.themealdb.com", "www.thecocktaildb.com"], // whitelist domains
  },
  reactCompiler: true,
};

export default nextConfig;
