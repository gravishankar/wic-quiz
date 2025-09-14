import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';
const isGitHubPages = process.env.GITHUB_ACTIONS === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: isProd && isGitHubPages ? '/wic-quiz' : '',
  assetPrefix: isProd && isGitHubPages ? '/wic-quiz/' : '',
  distDir: 'out',
};

export default nextConfig;
