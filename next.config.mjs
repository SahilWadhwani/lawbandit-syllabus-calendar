/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Let the app deploy even if ESLint errors exist.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
