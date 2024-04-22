/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  redirects() {
    return [
      {
        source: '/settings',
        destination: '/settings/appearance',
        permanent: false
      }
    ]
  }
}

module.exports = nextConfig
