# 퍼널띵 AI 바이브코딩 교육 플랫폼 프로젝트

## 📋 프로젝트 개요

**프로젝트명**: AI 바이브코딩 교육 플랫폼
**버전**: 0.1.0
**개발 시작**: 2025년 (추정)
**현재 상태**: 개발 진행중

### 🎯 프로젝트 목표
ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 더 빠르고 효율적으로 프로그래밍을 배울 수 있는 실무 중심 교육 플랫폼 구축

---

## 🛠 기술 스택

### Frontend
- **Framework**: Next.js 14.0.3 (React 18.2.0)
- **Language**: TypeScript 5.2.2
- **Styling**: Tailwind CSS 3.3.6
- **Animation**: Framer Motion 12.23.22
- **Icons**: Lucide React 0.294.0
- **3D Graphics**: Spline (@splinetool/react-spline 4.1.0)

### Backend & Database
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **File Storage**: Firebase Storage
- **Admin SDK**: Firebase Admin 13.5.0

### Payment System
- **결제 시스템**: 토스페이먼츠
- **SDK**: @tosspayments/tosspayments-sdk 2.4.0
- **MCP 통합**: @tosspayments/integration-guide-mcp 0.0.13

### Development Tools
- **Linting**: ESLint 8.54.0
- **PostCSS**: 8.4.31
- **Error Handling**: React Error Boundary 6.0.0

---

## 📁 프로젝트 구조

```
ai-vibe-coding-education/
├── app/                          # Next.js 13+ App Router
│   ├── admin/                    # 관리자 페이지
│   ├── api/                      # API 라우트
│   │   ├── payment/              # 결제 관련 API
│   │   │   ├── confirm/          # 결제 확인
│   │   │   └── history/          # 결제 내역
│   │   └── test-firebase/        # Firebase 테스트
│   ├── courses/                  # 강의 페이지
│   ├── payment/                  # 결제 페이지
│   │   ├── success/              # 결제 성공
│   │   └── fail/                 # 결제 실패
│   ├── auth/                     # 인증 관련 페이지
│   │   ├── login/                # 로그인
│   │   └── signup/               # 회원가입
│   └── [기타 페이지들]/           # 정적 페이지들
├── components/                   # React 컴포넌트
│   ├── home/                     # 홈페이지 컴포넌트
│   ├── layout/                   # 레이아웃 컴포넌트
│   ├── ui/                       # UI 기본 컴포넌트
│   ├── courses/                  # 강의 관련 컴포넌트
│   └── providers/                # Provider 컴포넌트
├── contexts/                     # React Context
├── lib/                          # 유틸리티 라이브러리
├── docs/                         # 프로젝트 문서
└── public/                       # 정적 파일
```

---

## 🔧 주요 설정 파일

### package.json
- 프로젝트 의존성 및 스크립트 관리
- 주요 의존성: Next.js, React, Firebase, TossPayments, Spline

### next.config.js
- CSP 설정 (Spline, TossPayments, Firebase 도메인 허용)
- 이미지 최적화 설정
- Webpack 설정 (Spline 라이브러리 최적화)

### .env.example
- 환경변수 템플릿
- Firebase, TossPayments, Admin 설정

---

## 📊 주요 기능

### 1. 홈페이지 (/)
- **Hero 섹션**: 3D Spline 로봇과 인터랙티브 UI
- **Features**: 주요 특징 소개
- **PopularCourses**: 인기 강의 목록
- **CourseReviews**: 실제 수강생 리뷰 (이미지 포함)
- **Testimonials**: 추천사
- **CTA**: 행동 유도 섹션

### 2. 인증 시스템
- **로그인/회원가입**: Firebase Auth 기반
- **AuthContext**: 전역 인증 상태 관리
- **보호된 라우트**: 인증 필요 페이지 접근 제어

### 3. 강의 시스템
- **강의 목록**: 카테고리별 강의 분류
- **강의 상세**: 개별 강의 정보
- **강의 카드**: 재사용 가능한 강의 표시 컴포넌트

### 4. 결제 시스템
- **토스페이먼츠 통합**: 안전한 결제 처리
- **결제 확인**: API를 통한 결제 검증
- **결제 내역**: 사용자별 결제 기록 관리

### 5. 리뷰 시스템
- **리뷰 작성**: 이미지 업로드 포함 리뷰
- **리뷰 표시**: 평점, 내용, 이미지 갤러리
- **Firebase Storage**: 리뷰 이미지 저장 관리

### 6. 관리자 시스템
- **관리자 대시보드**: 전체 데이터 관리
- **리뷰 관리**: 리뷰 및 이미지 삭제 기능
- **사용자 관리**: 회원 정보 조회

---

## 🔒 보안 설정

### Content Security Policy (CSP)
```javascript
frame-src 'self'
  https://my.spline.design
  https://prod.spline.design
  https://vercel.live
  https://payment-gateway-sandbox.tosspayments.com
  https://js.tosspayments.com
  https://bsdtest1981-634bc.firebaseapp.com
  https://accounts.google.com
  https://content.googleapis.com
```

### 환경변수 보안
- 민감한 정보는 환경변수로 분리
- 클라이언트/서버 사이드 변수 구분
- Firebase Admin SDK 키 보안 관리

---

## 🚀 개발 명령어

```bash
# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build

# 프로덕션 서버 실행
npm start

# 린팅 검사
npm run lint
```

---

## 📝 추가 정보

### 개발 환경
- **Node.js**: 권장 18+ 버전
- **Package Manager**: npm
- **개발 포트**: 3001 (localhost:3001)

### 배포 환경
- **플랫폼**: Vercel (추정)
- **도메인**: 미정
- **SSL**: 자동 설정

### 성능 최적화
- **이미지 최적화**: Next.js Image 컴포넌트
- **코드 스플리팅**: Dynamic imports
- **SEO**: Next.js 메타데이터 API
- **CDN**: Vercel Edge Network (추정)