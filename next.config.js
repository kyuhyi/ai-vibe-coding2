/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ui-avatars.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  // Spline과 iframe 임베드를 위한 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "frame-src 'self' https://my.spline.design https://prod.spline.design https://vercel.live https://payment-gateway-sandbox.tosspayments.com https://js.tosspayments.com https://bsdtest1981-634bc.firebaseapp.com https://accounts.google.com https://content.googleapis.com; frame-ancestors 'self';"
          }
        ],
      },
    ]
  },
  // Spline 라이브러리 최적화
  webpack: (config, { isServer }) => {
    // Spline을 클라이언트 사이드에서만 로드
    if (!isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@splinetool/react-spline': '@splinetool/react-spline',
      }
    }
    return config
  },
  transpilePackages: ['@splinetool/react-spline', '@splinetool/runtime'],
}

module.exports = nextConfig