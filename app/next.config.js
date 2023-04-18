/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [process.env.NEXT_IMAGE_DOMAIN],
  },
  output: 'standalone',
}
// RD NOTE-  i think we need 'standalone' in here - google this!
// https://nextjs.org/docs/api-reference/next.config.js/introduction
module.exports = nextConfig
