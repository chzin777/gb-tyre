import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Next 16 requires an explicit allowlist. Anything outside it is coerced to
    // the nearest entry, which is what quietly downgraded the hero to 75.
    qualities: [75, 92],
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
