/** @type {import('next').NextConfig} */
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  images: { formats: ["image/avif","image/webp"], remotePatterns: [{ protocol:"https", hostname:"**" }] },
  experimental: { optimizePackageImports: ["@supabase/supabase-js"] },
};
export default nextConfig;
