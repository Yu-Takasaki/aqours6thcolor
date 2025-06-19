import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: "export",
  distDir: process.env.NODE_ENV === 'production' ? 'docs' : '.next',
  basePath: "/aqours6thcolor",
};

export default nextConfig;
