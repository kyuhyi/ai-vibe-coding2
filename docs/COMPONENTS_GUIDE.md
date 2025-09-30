# 컴포넌트 및 기능 가이드

## 📦 컴포넌트 구조

### 🏠 홈페이지 컴포넌트 (`components/home/`)

#### Hero.tsx
**목적**: 메인 히어로 섹션 - 3D 인터랙션과 메인 메시지
**주요 기능**:
- Spline 3D 로봇 애니메이션 통합
- 마우스 인터랙션으로 3D 회전 효과
- 동적 임포트로 SSR 비활성화
- 에러 바운더리와 로딩 상태 관리

**핵심 코드**:
```typescript
const SplineScene = dynamic(() => import('@/components/ui/spline').then(mod => ({ default: mod.SplineScene })), {
  ssr: false,
  loading: () => <LoadingComponent />
});
```

#### Features.tsx
**목적**: 주요 특징 소개 섹션
**특징**:
- 그리드 레이아웃으로 특징 카드 표시
- 아이콘과 설명으로 구성
- 반응형 디자인

#### PopularCourses.tsx
**목적**: 인기 강의 목록 표시
**기능**:
- CourseCard 컴포넌트 재사용
- 강의 데이터 맵핑
- 더보기 링크 제공

#### CourseReviews.tsx
**목적**: 실제 수강생 리뷰 표시 및 관리
**주요 기능**:
- Firebase에서 리뷰 데이터 실시간 로드
- 이미지 갤러리 컴포넌트 통합
- 리뷰 작성 모달 트리거
- 평점 별점 표시

**핵심 코드**:
```typescript
const refreshReviews = async () => {
  const reviewsData = await getDocuments('reviews');
  const sortedReviews = reviewsData.sort((a, b) =>
    dateB.getTime() - dateA.getTime()
  );
};
```

#### ReviewModal.tsx
**목적**: 리뷰 작성 모달 - 이미지 업로드 포함
**고급 기능**:
- 다중 이미지 업로드 (최대 5개)
- 이미지 리사이징 및 압축
- 실시간 미리보기
- Firebase Storage 통합
- 폼 유효성 검사

**이미지 처리 코드**:
```typescript
const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);
  for (const file of files) {
    const resizedFile = await resizeImage(file, 1200, 800, 0.8);
    const preview = {
      file: resizedFile,
      previewUrl: createPreviewUrl(resizedFile),
      id: Math.random().toString(36).substring(2, 15)
    };
    newImages.push(preview);
  }
};
```

#### Testimonials.tsx & CTA.tsx
**목적**: 추천사 및 행동 유도 섹션
**기능**: 정적 콘텐츠 표시, 스타일링 및 애니메이션

---

### 🎨 UI 컴포넌트 (`components/ui/`)

#### Button.tsx
**목적**: 재사용 가능한 버튼 컴포넌트
**특징**:
- variant와 size props로 다양한 스타일
- TypeScript 타입 안전성
- Tailwind CSS 스타일링

#### spline.tsx
**목적**: 3D Spline 씬 렌더링
**고급 기능**:
- 에러 바운더리 내장
- 로딩 상태 관리
- 재시도 로직
- 타임아웃 처리

**에러 처리 코드**:
```typescript
const SplineScene = ({ scene, className }: SplineSceneProps) => {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = useCallback((error: any) => {
    console.error('Spline 로딩 에러:', error);
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1);
    } else {
      setError('3D 씬을 로드할 수 없습니다.');
    }
  }, [retryCount]);
};
```

#### spotlight.tsx & spotlight-interactive.tsx
**목적**: 인터랙티브 스포트라이트 효과
**기능**: 마우스 추적, 그라데이션 효과, 성능 최적화

#### Card.tsx & demo.tsx
**목적**: 재사용 가능한 카드 및 데모 컴포넌트

---

### 🧭 레이아웃 컴포넌트 (`components/layout/`)

#### Header.tsx
**목적**: 네비게이션 헤더
**기능**:
- 반응형 네비게이션
- 로그인/로그아웃 상태 관리
- 모바일 메뉴 토글

#### Footer.tsx
**목적**: 사이트 푸터
**기능**: 링크, 저작권, 소셜 미디어

---

### 📚 강의 관련 컴포넌트 (`components/courses/`)

#### CourseCard.tsx
**목적**: 강의 카드 표시
**기능**:
- 강의 정보 표시 (제목, 설명, 가격, 평점)
- 결제 버튼 통합
- 반응형 디자인

---

### 🔧 유틸리티 컴포넌트

#### ErrorSuppressionProvider.tsx
**목적**: 브라우저 확장 프로그램 에러 억제
**기능**:
- runtime.lastError 메시지 필터링
- console.error 오버라이드
- 개발 환경에서만 활성화

---

## 🔌 Context 및 상태 관리

### AuthContext.tsx
**목적**: 전역 인증 상태 관리
**기능**:
- Firebase Auth 통합
- 로그인/로그아웃 관리
- 사용자 정보 캐싱
- 인증 상태 리스너

**핵심 구조**:
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}
```

---

## 📊 타입 정의 (`types/index.ts`)

### 주요 인터페이스

#### Course
```typescript
interface Course {
  id: string;
  title: string;
  description: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  price: number;
  image: string;
  tags: string[];
  instructor: string;
  rating: number;
  students: number;
}
```

#### CourseReview
```typescript
interface CourseReview {
  id: string;
  courseTitle: string;
  reviewer: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
  images?: string[];     // 첨부 이미지 URLs
  imagePaths?: string[]; // Storage 경로들 (삭제용)
}
```

---

## 🎯 주요 기능 플로우

### 1. 리뷰 작성 플로우
1. **모달 열기**: CourseReviews 컴포넌트에서 "리뷰 작성하기" 클릭
2. **폼 작성**: ReviewModal에서 텍스트 및 이미지 입력
3. **이미지 처리**: 자동 리사이징 및 미리보기 생성
4. **Firebase 업로드**: Storage에 이미지 업로드 → Firestore에 리뷰 데이터 저장
5. **UI 업데이트**: 실시간으로 리뷰 목록 새로고침

### 2. 3D 인터랙션 플로우
1. **컴포넌트 로드**: Hero에서 dynamic import로 Spline 컴포넌트 로드
2. **마우스 이벤트**: mousemove 이벤트 리스너 등록
3. **3D 변환**: 마우스 위치에 따른 rotateX, rotateY 계산
4. **애니메이션**: CSS transform으로 부드러운 3D 회전 효과

### 3. 인증 플로우
1. **초기화**: AuthContext에서 Firebase Auth 상태 감지
2. **로그인**: 이메일/비밀번호로 signInWithEmailAndPassword 호출
3. **상태 업데이트**: Context를 통해 전역 사용자 상태 업데이트
4. **리디렉션**: 인증 성공 시 적절한 페이지로 이동

---

## 🚀 성능 최적화 기법

### 1. 코드 스플리팅
- `dynamic()` 사용으로 3D 라이브러리 지연 로딩
- 페이지별 자동 코드 분할

### 2. 이미지 최적화
- Next.js Image 컴포넌트 사용
- Firebase Storage 이미지 자동 압축
- Canvas API를 통한 클라이언트 사이드 리사이징

### 3. 상태 관리 최적화
- useCallback으로 불필요한 리렌더링 방지
- Context 분리로 상태 격리

### 4. 에러 처리
- React Error Boundary로 컴포넌트 격리
- 재시도 로직으로 네트워크 오류 대응
- 사용자 친화적 에러 메시지

---

## 🔧 개발 팁

### 컴포넌트 작성 가이드라인
1. **TypeScript 타입 정의**: 모든 props와 state에 타입 정의
2. **에러 바운더리**: 외부 라이브러리 사용 시 에러 처리
3. **성능 고려**: useCallback, useMemo 적절히 사용
4. **접근성**: ARIA 속성, 키보드 네비게이션 고려
5. **반응형**: Tailwind의 반응형 클래스 활용

### 상태 관리 패턴
- **지역 상태**: useState, useReducer
- **전역 상태**: React Context (인증, 테마 등)
- **서버 상태**: Firebase 실시간 리스너
- **폼 상태**: Controlled 컴포넌트 패턴