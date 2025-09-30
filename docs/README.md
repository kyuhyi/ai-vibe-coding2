# 퍼널띵 AI 바이브코딩 교육 플랫폼 - 프로젝트 문서

## 📚 문서 구조

이 `docs/` 폴더에는 프로젝트의 전체적인 구조, 개발 가이드, 그리고 히스토리가 정리되어 있습니다.

### 📖 문서 목록

#### [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)
- **프로젝트 전체 개요**
- 기술 스택, 프로젝트 구조, 주요 기능
- 개발 환경 및 명령어
- 성능 최적화 및 보안 설정

#### [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)
- **컴포넌트 및 기능 상세 가이드**
- 각 컴포넌트의 목적과 사용법
- 타입 정의 및 인터페이스
- 성능 최적화 기법 및 개발 팁

#### [API_DATABASE_GUIDE.md](./API_DATABASE_GUIDE.md)
- **API 엔드포인트 및 데이터베이스 구조**
- 결제 API, Firebase 통합 API 상세
- Firestore 컬렉션 구조 및 보안 규칙
- 데이터베이스 유틸리티 함수 사용법

#### [ENVIRONMENT_DEPLOYMENT_GUIDE.md](./ENVIRONMENT_DEPLOYMENT_GUIDE.md)
- **환경 설정 및 배포 가이드**
- 로컬 개발 환경 세팅
- 프로덕션 배포 (Vercel, Netlify 등)
- 보안 설정 및 성능 최적화

#### [DEVELOPMENT_HISTORY.md](./DEVELOPMENT_HISTORY.md)
- **개발 히스토리 및 해결된 이슈**
- 주요 문제점들과 해결 과정
- 개발 단계별 진행 과정
- 학습 인사이트 및 향후 계획

---

## 🚀 빠른 시작 가이드

### 1. 프로젝트 이해하기
1. [PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md) - 전체 구조 파악
2. [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md) - 주요 기능 이해

### 2. 개발 환경 설정
1. [ENVIRONMENT_DEPLOYMENT_GUIDE.md](./ENVIRONMENT_DEPLOYMENT_GUIDE.md) - 환경 설정
2. 환경 변수 설정 (`.env.local` 파일 생성)
3. `npm install` 및 `npm run dev` 실행

### 3. 개발 진행
1. [API_DATABASE_GUIDE.md](./API_DATABASE_GUIDE.md) - API 및 DB 활용
2. [DEVELOPMENT_HISTORY.md](./DEVELOPMENT_HISTORY.md) - 이전 이슈 참고

---

## 🔧 주요 기능 한눈에 보기

### 🏠 홈페이지
- **3D Spline 인터랙션**: 마우스 추적 3D 로봇
- **리뷰 시스템**: 이미지 업로드 포함 실시간 리뷰
- **반응형 디자인**: 모든 디바이스 지원

### 💳 결제 시스템
- **토스페이먼츠 통합**: 안전한 결제 처리
- **결제 기록 관리**: Firebase 기반 데이터 저장
- **실시간 결제 승인**: API 기반 즉시 처리

### 🔥 Firebase 통합
- **Authentication**: 이메일/비밀번호 로그인
- **Firestore**: 리뷰, 결제 데이터 저장
- **Storage**: 이미지 파일 관리

### 🛡️ 관리자 시스템
- **리뷰 관리**: 리뷰 조회 및 이미지 삭제
- **결제 내역**: 전체 결제 기록 조회
- **사용자 관리**: 회원 정보 관리

---

## 📊 기술 스택 요약

```
Frontend:  Next.js 14 + TypeScript + Tailwind CSS
3D:        Spline (@splinetool/react-spline)
Database:  Firebase Firestore + Storage
Payment:   토스페이먼츠 SDK + MCP
Auth:      Firebase Authentication
Styling:   Tailwind CSS + Framer Motion
```

---

## 🔗 외부 링크

### 개발 도구
- [Next.js 문서](https://nextjs.org/docs)
- [Firebase 문서](https://firebase.google.com/docs)
- [토스페이먼츠 개발자 센터](https://developers.tosspayments.com/)
- [Spline 문서](https://docs.spline.design/)

### 배포 플랫폼
- [Vercel](https://vercel.com/)
- [Netlify](https://netlify.com/)
- [Railway](https://railway.app/)

---

## 📞 문의 및 지원

### 개발 관련 문의
프로젝트 개발 중 발생한 이슈나 질문이 있으시면:
1. [DEVELOPMENT_HISTORY.md](./DEVELOPMENT_HISTORY.md)에서 유사한 이슈 확인
2. [트러블슈팅 가이드](./ENVIRONMENT_DEPLOYMENT_GUIDE.md#🚨-트러블슈팅) 참고
3. 개발팀에 문의

### 기술 지원
- 환경 설정 문제: [ENVIRONMENT_DEPLOYMENT_GUIDE.md](./ENVIRONMENT_DEPLOYMENT_GUIDE.md)
- API 사용법: [API_DATABASE_GUIDE.md](./API_DATABASE_GUIDE.md)
- 컴포넌트 사용법: [COMPONENTS_GUIDE.md](./COMPONENTS_GUIDE.md)

---

## 📝 문서 업데이트

이 문서들은 프로젝트 발전에 따라 지속적으로 업데이트됩니다.

**마지막 업데이트**: 2025년 9월 29일
**문서 버전**: v1.0.0
**프로젝트 버전**: 0.1.0

---

## 🎯 다음 단계

1. **개발자**: 각 가이드 문서를 순서대로 읽고 프로젝트 구조를 파악하세요
2. **기획자**: PROJECT_OVERVIEW.md로 전체 기능을 확인하세요
3. **디자이너**: COMPONENTS_GUIDE.md로 UI 컴포넌트를 파악하세요
4. **운영자**: ENVIRONMENT_DEPLOYMENT_GUIDE.md로 배포 과정을 이해하세요

각 역할에 맞는 문서를 참고하여 효율적으로 프로젝트에 참여하실 수 있습니다.