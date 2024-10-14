/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/proxy',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
