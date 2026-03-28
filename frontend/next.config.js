/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { dev }) => {
    if (dev) {
      // Fully disable webpack's persistent disk cache in dev.
      // The project path contains a space ("finance-ai ") which prevents
      // webpack's PackFileCacheStrategy from snapshotting dependencies,
      // producing repeated "<w> Caching failed" warnings. memory cache is
      // still active so hot-reload performance is unaffected.
      config.cache = false;

      config.snapshot = {
        ...(config.snapshot ?? {}),
        managedPaths: [],
        immutablePaths: [],
      };
    }
    return config;
  },
};

module.exports = nextConfig;
