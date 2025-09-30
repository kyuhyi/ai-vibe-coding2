# 환경 설정 및 배포 가이드

## 🔧 환경 설정

### 📋 필수 요구사항

#### Node.js 환경
- **Node.js**: 18.0.0 이상 권장
- **npm**: 9.0.0 이상 권장
- **운영체제**: Windows, macOS, Linux 지원

#### 브라우저 지원
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

---

### 🔑 환경 변수 설정

#### `.env.local` 파일 생성
프로젝트 루트에 `.env.local` 파일 생성:

```bash
# Firebase Configuration (클라이언트 사이드용)
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# TossPayments Configuration (서버 사이드용)
TOSS_PAYMENTS_SECRET_KEY=your_toss_payments_secret_key

# Admin Configuration (개발 환경에서만 사용)
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PASSWORD=admin_password

# Firebase Admin SDK Configuration (서버 사이드용)
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY_ID=your_private_key_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key\n-----END PRIVATE KEY-----"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
FIREBASE_CLIENT_ID=your_client_id
FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-xxxxx%40your-project.iam.gserviceaccount.com
```

#### 환경 변수 보안 가이드

**🟢 클라이언트 사이드 변수** (`NEXT_PUBLIC_` 접두사):
- 브라우저에서 접근 가능
- 민감하지 않은 설정값만 사용
- Firebase 클라이언트 설정, API 엔드포인트 등

**🔴 서버 사이드 변수** (접두사 없음):
- 서버에서만 접근 가능
- 민감한 정보 저장 (API 시크릿 키, 프라이빗 키 등)
- 절대 클라이언트에 노출되지 않음

---

## 🚀 로컬 개발 환경 설정

### 1. 프로젝트 클론 및 설치
```bash
# 프로젝트 클론
git clone [repository-url]
cd ai-vibe-coding-education

# 의존성 설치
npm install

# 환경 변수 설정
cp .env.example .env.local
# .env.local 파일 수정하여 실제 값 입력
```

### 2. Firebase 프로젝트 설정

#### Firebase 콘솔에서 프로젝트 생성
1. [Firebase Console](https://console.firebase.google.com/) 접속
2. 새 프로젝트 생성
3. 프로젝트 설정에서 웹 앱 추가
4. 구성 정보를 `.env.local`에 복사

#### Firestore 데이터베이스 설정
```javascript
// 보안 규칙 예시 (firebase-rules.txt)
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 리뷰 컬렉션 - 인증된 사용자만 읽기/쓰기
    match /reviews/{document} {
      allow read: if true; // 모든 사용자가 리뷰 조회 가능
      allow write: if request.auth != null; // 인증된 사용자만 작성 가능
    }

    // 결제 컬렉션 - 본인 데이터만 접근 가능
    match /payments/{document} {
      allow read, write: if request.auth != null &&
        request.auth.token.email == resource.data.customerEmail;
    }
  }
}
```

#### Firebase Storage 설정
```javascript
// 스토리지 보안 규칙 (storage-rules.txt)
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 리뷰 이미지 - 인증된 사용자만 업로드
    match /reviews/{userId}/{allPaths=**} {
      allow read: if true; // 모든 사용자가 이미지 조회 가능
      allow write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 3. 토스페이먼츠 설정

#### 개발자 센터 설정
1. [토스페이먼츠 개발자 센터](https://developers.tosspayments.com/) 접속
2. 계정 생성 및 앱 등록
3. 테스트/라이브 시크릿 키 발급
4. 시크릿 키를 `.env.local`에 설정

#### 결제 테스트
```javascript
// 테스트 카드 정보
{
  cardNumber: "4000000000000002", // 성공 테스트 카드
  expiryMonth: "12",
  expiryYear: "2025",
  cvc: "123",
  password: "1234"
}
```

### 4. 개발 서버 실행
```bash
# 개발 서버 시작
npm run dev

# 브라우저에서 확인
# http://localhost:3000 (기본 포트)
# 또는 http://localhost:3001 (설정된 포트)
```

---

## 🌐 배포 가이드

### Vercel 배포 (권장)

#### 1. Vercel 계정 설정
```bash
# Vercel CLI 설치
npm i -g vercel

# Vercel 로그인
vercel login

# 프로젝트 초기화
vercel

# 프로덕션 배포
vercel --prod
```

#### 2. 환경 변수 설정
Vercel 대시보드에서 환경 변수 설정:
- Project Settings → Environment Variables
- 모든 환경 변수를 프로덕션 환경에 추가
- Preview와 Development 환경도 필요에 따라 설정

#### 3. 도메인 설정
```bash
# 커스텀 도메인 추가
vercel domains add yourdomain.com

# DNS 설정
# A 레코드: 76.76.19.61
# CNAME 레코드: cname.vercel-dns.com
```

### 네트리파이 배포

#### 1. 빌드 설정
```bash
# netlify.toml 파일 생성
[build]
  publish = ".next"
  command = "npm run build"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

#### 2. 환경 변수 설정
- Netlify 대시보드 → Site settings → Environment variables
- 모든 환경 변수 추가

### 기타 플랫폼 배포

#### Railway
```bash
# Railway CLI 설치
npm install -g @railway/cli

# 로그인 및 배포
railway login
railway init
railway up
```

#### Heroku
```bash
# Heroku CLI 설치 후
heroku create your-app-name
heroku config:set NODE_ENV=production
heroku config:set [환경변수들]
git push heroku main
```

---

## 🔧 프로덕션 최적화

### 1. 빌드 최적화

#### Next.js 설정 최적화
```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 성능 최적화
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 이미지 최적화
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },

  // 번들 분석 (필요시)
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.resolve.alias = {
        ...config.resolve.alias,
        '@': path.resolve(__dirname),
      };
    }
    return config;
  },
};
```

#### 번들 크기 분석
```bash
# 번들 분석기 설치
npm install --save-dev @next/bundle-analyzer

# 번들 분석 실행
npm run analyze
```

### 2. 성능 모니터링

#### Core Web Vitals 추적
```javascript
// pages/_app.tsx
export function reportWebVitals(metric) {
  // 분석 도구로 메트릭 전송
  console.log(metric);
}
```

#### 에러 모니터링
```bash
# Sentry 설치 (선택사항)
npm install @sentry/nextjs

# 설정 후 에러 자동 추적
```

### 3. 보안 강화

#### 보안 헤더 설정
```javascript
// next.config.js
const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

---

## 🛠 개발 도구 및 스크립트

### package.json 스크립트
```json
{
  "scripts": {
    "dev": "next dev -p 3001",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "type-check": "tsc --noEmit",
    "analyze": "ANALYZE=true npm run build",
    "test": "jest",
    "test:watch": "jest --watch",
    "clean": "rm -rf .next out"
  }
}
```

### Git Hooks 설정
```bash
# Husky 설치 (선택사항)
npm install --save-dev husky lint-staged

# pre-commit 훅 설정
npx husky add .husky/pre-commit "lint-staged"
```

### `.gitignore` 설정
```gitignore
# 환경 변수
.env*.local
.env.production

# 빌드 결과물
.next/
out/
build/

# 의존성
node_modules/

# 로그
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# IDE
.vscode/
.idea/

# 맥 OS
.DS_Store
```

---

## 🚨 트러블슈팅

### 자주 발생하는 문제들

#### 1. 환경 변수가 인식되지 않는 경우
```bash
# 해결 방법:
# 1. .env.local 파일 위치 확인 (프로젝트 루트)
# 2. 파일명 정확성 확인
# 3. 개발 서버 재시작
npm run dev
```

#### 2. Firebase 연결 오류
```javascript
// 해결 방법:
// 1. Firebase 설정 확인
// 2. 프로젝트 ID 정확성 확인
// 3. 보안 규칙 확인
```

#### 3. 토스페이먼츠 결제 실패
```javascript
// 해결 방법:
// 1. 시크릿 키 확인
// 2. 테스트 환경 설정 확인
// 3. CORS 설정 확인
```

#### 4. 이미지 업로드 실패
```javascript
// 해결 방법:
// 1. Firebase Storage 보안 규칙 확인
// 2. 파일 크기 제한 확인
// 3. 파일 형식 지원 여부 확인
```

### 로그 및 디버깅
```javascript
// 개발 환경에서 상세 로그 활성화
if (process.env.NODE_ENV === 'development') {
  console.log('Debug information:', data);
}

// 프로덕션에서는 에러만 로깅
if (process.env.NODE_ENV === 'production') {
  console.error('Production error:', error);
}
```

---

## 📊 모니터링 및 분석

### 성능 모니터링 도구
- **Vercel Analytics**: 내장 분석 도구
- **Google Analytics**: 사용자 행동 분석
- **Lighthouse**: 성능 점수 측정
- **Web Vitals**: 사용자 경험 지표

### 에러 추적
- **Sentry**: 실시간 에러 모니터링
- **LogRocket**: 사용자 세션 재생
- **Firebase Crashlytics**: 앱 크래시 분석

### 사용법
```javascript
// 커스텀 이벤트 추적
gtag('event', 'purchase', {
  transaction_id: orderId,
  value: amount,
  currency: 'KRW'
});
```