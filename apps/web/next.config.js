/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/participants',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
