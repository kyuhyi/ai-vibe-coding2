/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.unsplash.com'],
  },
  // Spline과 iframe 임베드를 위한 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://my.spline.design https://prod.spline.design; frame-ancestors 'self';"
          }
        ],
      },
    ]
  },
  // Spline 라이브러리 최적화
  webpack: (config, { isServer }) => {
    // Spline 라이브러리가 클라이언트에서만 로드되도록 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
      }
    }

    return config
  },
  // 실험적 기능 활성화
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime']
  }
}

module.exports = nextConfig