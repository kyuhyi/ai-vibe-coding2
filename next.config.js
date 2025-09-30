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
  // Spline 라이브러리 최적화 및 Windows 파일 시스템 이슈 해결
  webpack: (config, { isServer, dev }) => {
    // Spline 라이브러리가 클라이언트에서만 로드되도록 설정
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        path: false,
        os: false,
      }

      // Spline 관련 모듈 외부화 방지
      config.externals = config.externals || []
      config.externals.push(function (context, request, callback) {
        if (request.includes('@splinetool')) {
          return callback()
        }
        return callback()
      })
    }

    // 개발 환경에서 더 관대한 설정
    if (dev) {
      // Windows 개발 환경에서 파일 시스템 워치 최적화
      config.watchOptions = {
        poll: 1000, // 1초마다 폴링
        aggregateTimeout: 300, // 300ms 디바운스
        ignored: ['**/node_modules', '**/.git', '**/.next'],
      }

      // 개발 환경에서 Spline 모듈 최적화
      config.optimization = {
        ...config.optimization,
        moduleIds: 'named',
        splitChunks: {
          ...config.optimization.splitChunks,
          cacheGroups: {
            ...config.optimization.splitChunks?.cacheGroups,
            spline: {
              name: 'spline',
              test: /[\\/]node_modules[\\/]@splinetool[\\/]/,
              chunks: 'all',
              priority: 20,
            }
          }
        }
      }
    }

    return config
  },
  // 실험적 기능 활성화
  experimental: {
    optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime'],
    // Windows에서 빌드 워커 비활성화 (파일 락 이슈 완화)
    webpackBuildWorker: false,
  },

  // 개발 모드 최적화
  onDemandEntries: {
    // 메모리에 페이지를 유지하는 시간 (ms) - 짧게 설정하여 메모리 사용량 감소
    maxInactiveAge: 25 * 1000,
    // 동시에 유지할 페이지 수
    pagesBufferLength: 2,
  }
}

module.exports = nextConfig