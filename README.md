# AI Vibe - AI 코딩 교육 플랫폼

AI와 함께하는 새로운 코딩 교육 플랫폼입니다. ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 효율적으로 프로그래밍을 배울 수 있습니다.

## 🚀 주요 기능

- **AI 도구 활용 교육**: ChatGPT, Claude, GitHub Copilot 등을 실무에 적용하는 방법 학습
- **실전 프로젝트 중심**: 이론보다는 실제 프로젝트를 통한 실무 능력 향상
- **개인 맞춤 멘토링**: 1:1 멘토링을 통한 개별화된 학습 지원
- **평생 업데이트**: 새로운 AI 도구 출시 시 무료 콘텐츠 업데이트

## 🛠 기술 스택

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Deployment**: Vercel (권장)

## 📦 설치 및 실행

1. 의존성 설치:
```bash
npm install
```

2. 개발 서버 실행:
```bash
npm run dev
```

3. 브라우저에서 [http://localhost:3000](http://localhost:3000) 접속

## 📁 프로젝트 구조

```
.
├── app/                    # Next.js App Router
│   ├── layout.tsx         # 전역 레이아웃
│   ├── page.tsx           # 홈페이지
│   ├── courses/           # 코스 관련 페이지
│   └── globals.css        # 전역 스타일
├── components/            # 재사용 가능한 컴포넌트
│   ├── ui/               # 기본 UI 컴포넌트
│   ├── layout/           # 레이아웃 컴포넌트
│   ├── home/             # 홈페이지 컴포넌트
│   └── courses/          # 코스 관련 컴포넌트
├── lib/                  # 유틸리티 함수
├── types/                # TypeScript 타입 정의
└── public/               # 정적 파일
```

## 🎨 디자인 시스템

### 색상 팔레트
- **Primary**: Blue (#3b82f6)
- **Secondary**: Cyan (#0ea5e9)
- **Accent**: Purple (#d946ef)

### 컴포넌트
- `Button`: 다양한 variant (primary, secondary, outline, ghost)
- `Card`: 재사용 가능한 카드 컴포넌트
- `Header`: 반응형 네비게이션
- `Footer`: 사이트 푸터

## 📱 반응형 디자인

- Mobile-first 접근 방식
- Tailwind CSS 브레이크포인트 활용
- 모든 주요 디바이스에서 최적화된 경험 제공

## 🚀 배포

### Vercel (권장)
1. GitHub에 코드 푸시
2. Vercel에서 프로젝트 import
3. 자동 배포 완료

### 기타 플랫폼
- Netlify
- Firebase Hosting
- AWS Amplify

## 📈 성능 최적화

- Next.js Image 컴포넌트로 이미지 최적화
- 코드 스플리팅으로 번들 크기 최적화
- Lighthouse 점수 90+ 목표

## 🤝 기여하기

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 라이선스

MIT License

## 📞 문의

- 이메일: contact@aivibe.dev
- 디스코드: [AI Vibe Community](https://discord.gg/aivibe)

---

Made with ❤️ for developers learning AI tools