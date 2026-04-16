/** @type {import('next').NextConfig} */
const nextConfig = {
  // Forzar el uso de Webpack en vez de Turbopack en producción
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;