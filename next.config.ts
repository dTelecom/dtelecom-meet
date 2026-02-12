import type { NextConfig } from "next";
import { resolve } from "path";

const nextConfig: NextConfig = {
  turbopack: {
    root: resolve(__dirname, ".."),
  },
  serverExternalPackages: ["@dtelecom/server-sdk-js"],
};

export default nextConfig;
