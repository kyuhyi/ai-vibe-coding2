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
            value: "frame-src 'self' https://my.spline.design https://prod.spline.design https://vercel.live https://payment-gateway-sandbox.tosspayments.com https://js.tosspayments.com https://bsdtest1981-634bc.firebaseapp.com https://accounts.google.com https://content.googleapis.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://unpkg.com https://prod.spline.design https://www.gstatic.com https://apis.google.com https://t1.kakaocdn.net https://www.googletagmanager.com https://vercel.live; worker-src 'self' blob:; connect-src 'self' https://prod.spline.design https://unpkg.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://firebaseinstallations.googleapis.com https://www.googleapis.com https://firestore.googleapis.com https://firebase.googleapis.com https://www.google-analytics.com https://kapi.kakao.com; frame-ancestors 'self';"
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig