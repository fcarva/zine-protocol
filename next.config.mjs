/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1280, 1536, 1920],
    imageSizes: [32, 48, 64, 96, 128, 256, 384],
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias ?? {}),
      "@react-native-async-storage/async-storage": false,
    };

    config.resolve.fallback = {
      ...(config.resolve.fallback ?? {}),
      "@react-native-async-storage/async-storage": false,
    };

    return config;
  },
};

export default nextConfig;

