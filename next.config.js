// eslint-disable-next-line @typescript-eslint/no-require-imports
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
// reactStrictMode: false — in dev mode, React Strict Mode causes double rendering of components,
// leading to duplicate useEffect calls, API requests, and other side effects.
const nextConfig = {
  reactStrictMode: false,
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: process.env.NODE_ENV === 'development',
    },
  },
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [],
      fallback: [
        {
          source: '/:path*',
          destination: '/_fallback/:path*',
        },
      ],
    }
  },
}

module.exports = withBundleAnalyzer(nextConfig)
