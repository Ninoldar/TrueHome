/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    // Use environment variable for API URL, fallback to localhost for dev
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:4000';
    
    // If API_URL is set to '/api', don't rewrite (for serverless functions)
    if (apiUrl === '/api' || apiUrl.startsWith('/')) {
      return [];
    }
    
    // For external API (Railway, Render, etc.)
    return [
      {
        source: '/api/:path*',
        destination: `${apiUrl}/:path*`,
      },
    ];
  },
}

module.exports = nextConfig
