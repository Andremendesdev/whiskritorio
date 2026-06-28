import type { NextConfig } from "next";

/** Demo ligado na Vercel por padrão; desligue com NEXT_PUBLIC_DEMO_IMAGES=false. */
const demoImagesEnv =
  process.env.NEXT_PUBLIC_DEMO_IMAGES ??
  (process.env.VERCEL === "1" ? "true" : "");

const nextConfig: NextConfig = {
  env: {
    NEXT_PUBLIC_DEMO_IMAGES: demoImagesEnv,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.pexels.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
        pathname: "/f/**",
      },
      {
        protocol: "https",
        hostname: "**.ufs.sh",
        pathname: "/f/**",
      },
    ],
  },
};

export default nextConfig;
