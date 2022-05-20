/** @type {import('next').NextConfig} */

const withTM = require("next-transpile-modules")([
  "lodash-es",
  "react-d3-speedometer"
]);

module.exports = withTM();

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  async redirects()
  {
    return [
      {
        source: '/stake/:slug*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/foundation/:slug*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/swap/:slug*',
        destination: '/',
        permanent: false,
      },
      {
        source: '/treasury/:slug*',
        destination: '/',
        permanent: false,
      },
      // {
      //   source: '/',
      //   destination: '/stake?tab=overview',
      //   permanent: false,
      // },
    ]
  },
}

module.exports = nextConfig
