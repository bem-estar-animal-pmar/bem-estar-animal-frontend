import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "pub-39568f5f755f4010bcdd9d36ace3a124.r2.dev", /* public r2 cdn for images, must change later */
            },
        ],
    },
};

export default nextConfig;