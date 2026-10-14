/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      { source: '/hotels/rome', destination: '/hotel-deals', permanent: true },
      { source: '/airbnb/italy', destination: '/airbnb-deals', permanent: true },
    ]
  },
}

module.exports = nextConfig
