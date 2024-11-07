import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  sassOptions: {
    implementation: require("sass"),
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
