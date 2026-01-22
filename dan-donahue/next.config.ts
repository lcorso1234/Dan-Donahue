import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  turbopack: {
    // Ensure the project treats this directory as the root when multiple lockfiles exist
    root: __dirname,
  },
};

export default nextConfig;
