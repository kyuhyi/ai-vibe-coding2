# 개발 히스토리 및 해결된 이슈

## 📈 프로젝트 발전 과정

### 🎯 Phase 1: 초기 설정 및 기본 구조 (2025년 초)
- Next.js 14.0.3 기반 프로젝트 생성
- TypeScript 설정 및 Tailwind CSS 통합
- 기본 페이지 구조 및 컴포넌트 아키텍처 설계
- Git 저장소 초기화 및 기본 설정

### 🚀 Phase 2: 3D 인터랙션 및 UI 개발
- Spline 3D 통합 및 인터랙티브 요소 구현
- 홈페이지 Hero 섹션 및 주요 컴포넌트 개발
- 반응형 디자인 적용
- 애니메이션 및 사용자 경험 향상

### 💳 Phase 3: 결제 시스템 통합
- 토스페이먼츠 SDK 및 MCP 통합
- 결제 API 엔드포인트 구현
- 결제 승인 및 기록 관리 시스템
- 보안 설정 및 환경 변수 관리

### 🔥 Phase 4: Firebase 통합
- Firebase 프로젝트 설정 및 SDK 통합
- Firestore 데이터베이스 설계 및 구현
- Firebase Authentication 시스템
- Firebase Storage 이미지 관리

### 📝 Phase 5: 리뷰 시스템 개발
- 리뷰 작성 및 표시 기능
- 이미지 업로드 및 갤러리 시스템
- 실시간 데이터 동기화
- 관리자 인터페이스

---

## 🛠 해결된 주요 이슈들

### 🔧 Issue #1: 브라우저 확장 프로그램 에러 (최초 보고)

**문제 상황**:
```
http://localhost:3001 Unchecked runtime.lastError:
A listener indicated an asynchronous response by returning true,
but the message channel closed before a response was received
```

**원인 분석**:
- 브라우저 확장 프로그램과 개발 서버 간의 충돌
- Chrome/Edge 확장 프로그램의 runtime.lastError 메시지
- 개발 환경에서만 발생하는 콘솔 스팸

**해결 방법**:
1. **에러 억제 유틸리티 생성** (`lib/error-suppression.js`):
```javascript
export function suppressRuntimeErrors() {
  if (typeof window === 'undefined') return
  const originalConsoleError = console.error
  console.error = (...args) => {
    const errorMessage = args.join(' ')
    const shouldSuppressError = [
      'runtime.lastError',
      'message channel closed',
      'A listener indicated an asynchronous response'
    ].some(pattern => errorMessage.includes(pattern))
    if (shouldSuppressError) return
    originalConsoleError.apply(console, args)
  }
}
```

2. **Provider 컴포넌트 생성** (`components/providers/ErrorSuppressionProvider.tsx`):
```typescript
'use client'
import { useEffect } from 'react';
import { suppressRuntimeErrors } from '@/lib/error-suppression';

export default function ErrorSuppressionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    suppressRuntimeErrors();
  }, []);

  return <>{children}</>;
}
```

3. **전역 적용** (`app/layout.tsx`):
```typescript
import ErrorSuppressionProvider from '@/components/providers/ErrorSuppressionProvider';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <ErrorSuppressionProvider>
          {children}
        </ErrorSuppressionProvider>
      </body>
    </html>
  );
}
```

**결과**: 브라우저 확장 프로그램 에러 메시지 완전 제거, 개발 환경 콘솔 정리

---

### 🎨 Issue #2: Spline 3D 컴포넌트 무한 로딩

**문제 상황**:
- 3D Spline 컴포넌트가 로드되지 않고 무한 로딩
- 네트워크 오류 시 fallback UI 없음
- SSR 환경에서 Spline 라이브러리 충돌

**원인 분석**:
- Spline 라이브러리의 클라이언트 사이드 전용 특성
- 네트워크 연결 문제 시 에러 처리 부재
- 브라우저 호환성 이슈

**해결 방법**:
1. **동적 임포트로 SSR 비활성화** (`components/home/Hero.tsx`):
```typescript
const SplineScene = dynamic(() => import('@/components/ui/spline').then(mod => ({ default: mod.SplineScene })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        <p className="text-white/60">3D Scene Loading...</p>
      </div>
    </div>
  )
});
```

2. **에러 바운더리 및 재시도 로직** (`components/ui/spline.tsx`):
```typescript
const SplineScene = ({ scene, className }: SplineSceneProps) => {
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const MAX_RETRY_COUNT = 3;

  const handleError = useCallback((error: any) => {
    console.error('Spline 로딩 에러:', error);
    if (retryCount < MAX_RETRY_COUNT) {
      setRetryCount(prev => prev + 1);
    } else {
      setError('3D 씬을 로드할 수 없습니다.');
    }
  }, [retryCount]);

  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-900/20 to-gray-700/20">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 bg-gray-400 rounded-full opacity-30"></div>
          <p className="text-white/40">3D 콘텐츠를 불러올 수 없습니다</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary fallback={<FallbackComponent />}>
      <Spline
        scene={scene}
        className={className}
        onError={handleError}
      />
    </ErrorBoundary>
  );
};
```

3. **Next.js 설정 최적화** (`next.config.js`):
```javascript
// Spline 라이브러리 최적화
webpack: (config, { isServer }) => {
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
experimental: {
  optimizePackageImports: ['@splinetool/react-spline', '@splinetool/runtime']
}
```

**결과**: 안정적인 3D 로딩, 에러 상황 대응, 사용자 경험 향상

---

### 🔧 Issue #3: TypeScript 컴파일 에러 다수 발생

**문제 상황**:
- AuthContext에서 타입 정의 누락
- 컴포넌트 props 타입 에러
- Firebase 관련 타입 충돌

**해결 방법**:
1. **AuthContext 타입 정의 완성** (`contexts/AuthContext.tsx`):
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  createUserWithEmailAndPassword: (email: string, password: string) => Promise<UserCredential>;
  signOut: () => Promise<void>;
}

interface AuthProviderProps {
  children: React.ReactNode;
}
```

2. **타입 정의 파일 보완** (`types/index.ts`):
```typescript
export interface CourseReview {
  id: string;
  courseTitle: string;
  reviewer: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
  date: string;
  images?: string[];
  imagePaths?: string[];
}
```

**결과**: 모든 TypeScript 컴파일 에러 해결, 타입 안전성 확보

---

### 🔥 Issue #4: Firebase Storage 이미지 업로드 통합

**요구사항**:
"지금 파이어베이스 스토리지도 설정 해놨거든 리뷰 올릴때 사진도 데이터에 올릴 수 있게 연동 해줄래?"

**구현 과정**:

1. **Firebase Storage 유틸리티 개발** (`lib/storage.js`):
```javascript
export const uploadReviewImage = async (file, userId, reviewId = null) => {
  try {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    const path = reviewId
      ? `reviews/${userId}/${reviewId}/${fileName}`
      : `reviews/${userId}/${fileName}`;

    return await uploadImage(file, path);
  } catch (error) {
    console.error('리뷰 이미지 업로드 중 오류:', error);
    return { success: false, error: '리뷰 이미지 업로드 중 오류가 발생했습니다.' };
  }
};
```

2. **이미지 리사이징 및 압축**:
```javascript
export const resizeImage = async (file, maxWidth = 1200, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      let { width, height } = img;

      // 비율 계산 및 리사이징 로직
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };

    img.src = URL.createObjectURL(file);
  });
};
```

3. **ReviewModal 컴포넌트 확장**:
```typescript
const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const files = Array.from(e.target.files || []);

  if (imageFiles.length + files.length > 5) {
    alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
    return;
  }

  const newImages: ImagePreview[] = [];

  for (const file of files) {
    try {
      const resizedFile = await resizeImage(file, 1200, 800, 0.8);
      const preview: ImagePreview = {
        file: resizedFile,
        previewUrl: createPreviewUrl(resizedFile),
        id: Math.random().toString(36).substring(2, 15)
      };
      newImages.push(preview);
    } catch (error) {
      console.error('이미지 처리 실패:', error);
      alert(`${file.name} 처리에 실패했습니다.`);
    }
  }

  setImageFiles(prev => [...prev, ...newImages]);
};
```

4. **Next.js 이미지 설정 추가** (`next.config.js`):
```javascript
images: {
  remotePatterns: [
    {
      protocol: 'https',
      hostname: 'firebasestorage.googleapis.com',
      port: '',
      pathname: '/**',
    },
  ],
},
```

**결과**: 완전한 이미지 업로드 시스템, 자동 리사이징, 미리보기 기능

---

### 🛡️ Issue #5: 관리자 페이지 이미지 관리 확장

**요구사항**:
"리뷰 이미지는 저장이 되는것 같고 관리자 페이지에 리뷰 이미지를 불러오는것도 연동 해야될듯"

**구현 내용**:

1. **이미지 갤러리 컴포넌트 개발**:
```typescript
function AdminImageGallery({ images, imagePaths, reviewId, onImageDeleted }: AdminImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const handleDeleteImage = async (imageIndex: number) => {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) return;

    try {
      setDeletingIndex(imageIndex);
      const pathToDelete = imagePaths[imageIndex];
      const deleteResult = await deleteImage(pathToDelete);

      if (deleteResult.success) {
        const updatedImages = images.filter((_, index) => index !== imageIndex);
        const updatedPaths = imagePaths.filter((_, index) => index !== imageIndex);

        // Firestore 업데이트
        await updateDocument('reviews', reviewId, {
          images: updatedImages,
          imagePaths: updatedPaths
        });

        onImageDeleted();
        alert('이미지가 삭제되었습니다.');
      }
    } catch (error) {
      console.error('이미지 삭제 실패:', error);
      alert('이미지 삭제에 실패했습니다.');
    } finally {
      setDeletingIndex(null);
    }
  };

  return (
    <div className="mt-4">
      <div className="grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <div key={index} className="relative group">
            <img
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              className="w-full h-20 object-cover rounded cursor-pointer"
              onClick={() => setSelectedImage(index)}
            />
            <button
              onClick={() => handleDeleteImage(index)}
              disabled={deletingIndex === index}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {deletingIndex === index ? '...' : '×'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

2. **관리자 페이지 통합**:
```typescript
const deleteReviewImage = async (reviewId: string, imageIndex: number) => {
  const review = reviews.find(r => r.id === reviewId);
  if (!review || !review.imagePaths || !review.imagePaths[imageIndex]) {
    alert('삭제할 이미지를 찾을 수 없습니다.');
    return;
  }

  const pathToDelete = review.imagePaths[imageIndex];
  const deleteResult = await deleteImage(pathToDelete);

  if (deleteResult.success) {
    const updatedImages = review.images?.filter((_, index) => index !== imageIndex) || [];
    const updatedPaths = review.imagePaths.filter((_, index) => index !== imageIndex);

    await updateDocument('reviews', reviewId, {
      images: updatedImages,
      imagePaths: updatedPaths
    });

    loadReviews();
  }
};
```

**결과**: 관리자 이미지 관리 시스템 완성, 개별 이미지 삭제 기능

---

### 🔧 Issue #6: Spline 컴포넌트 import 경로 오류 (최종 이슈)

**문제 상황**:
```
components\home\Hero.tsx (10:34) @ next_dynamic__WEBPACK_IMPORTED_MODULE_3___default.loadableGenerated.modules
const SplineScene = dynamic(() => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })), {
```

**원인**: 파일명 오타 - `splite.tsx` → `spline.tsx`

**해결 방법**:
1. 파일명 수정: `components/ui/splite.tsx` → `components/ui/spline.tsx`
2. import 경로 수정: `@/components/ui/splite` → `@/components/ui/spline`

**결과**: 완전한 에러 해결, 정상적인 3D 컴포넌트 로딩

---

## 🎯 개발 과정에서 얻은 인사이트

### 1. 에러 처리의 중요성
- 브라우저 확장 프로그램과의 충돌 대응
- 외부 라이브러리 로딩 실패 시 fallback UI
- 사용자 친화적 에러 메시지 제공

### 2. 타입 안전성
- TypeScript 타입 정의의 중요성
- 개발 초기 타입 정의로 후반부 오류 방지
- 컴파일 타임 오류 검출

### 3. 성능 최적화
- 이미지 자동 리사이징으로 성능 향상
- 동적 임포트를 통한 코드 스플리팅
- 불필요한 렌더링 방지

### 4. 사용자 경험
- 로딩 상태 표시
- 에러 상황에서의 적절한 피드백
- 직관적인 인터페이스 설계

### 5. 보안 고려사항
- 환경 변수 분리 (클라이언트/서버)
- Firebase 보안 규칙 설정
- 파일 업로드 검증

---

## 🚀 향후 개선 방향

### 단기 목표
- [ ] 이미지 최적화 (WebP 변환)
- [ ] 오프라인 지원
- [ ] PWA 기능 추가
- [ ] 성능 모니터링 도구 연동

### 중기 목표
- [ ] 실시간 알림 시스템
- [ ] 고급 검색 및 필터링
- [ ] 소셜 로그인 확장
- [ ] 다국어 지원

### 장기 목표
- [ ] AI 기반 추천 시스템
- [ ] 라이브 스트리밍 강의
- [ ] 모바일 앱 개발
- [ ] 마이크로서비스 아키텍처 전환

---

## 📊 프로젝트 통계

### 개발 기간
- 전체 개발 기간: 약 2-3개월 (추정)
- 주요 이슈 해결: 6건
- 코드 커밋: 20+ 커밋

### 기술 스택 성장
- **Frontend**: Next.js 14 마스터
- **3D Graphics**: Spline 통합 경험
- **Backend**: Firebase 전체 스택 활용
- **Payment**: 토스페이먼츠 통합
- **DevOps**: Vercel 배포 최적화

### 학습 성과
- React 18의 최신 기능 활용
- TypeScript 고급 타입 시스템
- 성능 최적화 기법
- 에러 처리 및 디버깅 스킬
- 실무 수준의 프로젝트 구조 설계