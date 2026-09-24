/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    // The public resume moved from /cv to /; keep old links working
    return [{ source: "/cv", destination: "/", permanent: true }];
  },
};

module.exports = nextConfig;
