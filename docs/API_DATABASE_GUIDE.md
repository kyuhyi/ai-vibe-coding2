# API 및 데이터베이스 구조 가이드

## 🔗 API 엔드포인트

### 📦 결제 API (`/api/payment/`)

#### POST `/api/payment/confirm`
**목적**: 토스페이먼츠 결제 승인 처리
**요청 형식**:
```json
{
  "paymentKey": "토스페이먼츠에서 발급한 결제 키",
  "orderId": "주문 ID",
  "amount": 결제 금액 (숫자)
}
```

**응답 형식**:
```json
{
  "success": true,
  "paymentKey": "결제 키",
  "orderId": "주문 ID",
  "amount": 결제 금액,
  "method": "결제 수단",
  "approvedAt": "승인 시간",
  "message": "결제가 성공적으로 완료되었습니다."
}
```

**처리 플로우**:
1. 요청 파라미터 유효성 검사
2. 토스페이먼츠 API 호출로 결제 승인
3. Firebase에 결제 정보 저장
4. 클라이언트에 성공/실패 응답

**핵심 코드**:
```typescript
// 토스페이먼츠 API 호출
const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ paymentKey, orderId, amount }),
});

// Firebase에 결제 정보 저장
const saveResult = await savePaymentInfo({
  paymentKey: result.paymentKey,
  orderId: result.orderId,
  amount: result.totalAmount,
  method: result.method,
  status: result.status,
  approvedAt: result.approvedAt,
  customerName: result.customerName,
  customerEmail: result.customerEmail,
  productName: '코딩 교육 서비스',
  productType: 'education'
});
```

#### GET `/api/payment/history`
**목적**: 사용자 결제 기록 조회
**쿼리 파라미터**:
- `email`: 사용자 이메일 (사용자별 결제 기록 조회)
- `id`: 결제 ID (특정 결제 정보 조회)

**응답 형식** (사용자별 조회):
```json
{
  "success": true,
  "payments": [
    {
      "id": "문서 ID",
      "paymentKey": "결제 키",
      "orderId": "주문 ID",
      "amount": 결제 금액,
      "method": "결제 수단",
      "status": "DONE",
      "approvedAt": "승인 시간",
      "customerName": "고객명",
      "customerEmail": "고객 이메일",
      "productName": "상품명",
      "createdAt": "생성 시간"
    }
  ],
  "count": 결제 건수
}
```

**사용 예시**:
```javascript
// 특정 사용자의 결제 기록 조회
const response = await fetch('/api/payment/history?email=user@example.com');

// 특정 결제 정보 조회
const response = await fetch('/api/payment/history?id=payment_doc_id');
```

#### GET `/api/test-firebase`
**목적**: Firebase 연결 상태 테스트
**응답**: Firebase 연결 성공/실패 상태

---

## 🗄️ 데이터베이스 구조 (Firebase Firestore)

### 📊 컬렉션 구조

#### `reviews` 컬렉션
**목적**: 강의 리뷰 데이터 저장
**문서 구조**:
```javascript
{
  id: "자동 생성 문서 ID",
  courseName: "강의명",
  instructorName: "강사명",
  studentName: "작성자명",
  rating: 5, // 1-5점
  content: "리뷰 내용",
  userId: "작성자 Firebase UID",
  userEmail: "작성자 이메일",
  images: ["이미지URL1", "이미지URL2"], // Firebase Storage URLs
  imagePaths: ["storage/path1", "storage/path2"], // 삭제용 경로
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

#### `payments` 컬렉션
**목적**: 결제 정보 저장
**문서 구조**:
```javascript
{
  id: "자동 생성 문서 ID",

  // 토스페이먼츠 결과 정보
  paymentKey: "토스페이먼츠 결제 키",
  orderId: "주문 ID",
  amount: 결제금액,
  method: "결제 수단 (카드, 계좌이체 등)",
  status: "DONE", // 결제 상태
  approvedAt: "결제 승인 시간",

  // 결제 상세 정보
  paymentType: "NORMAL", // 결제 타입
  currency: "KRW", // 통화
  customerName: "고객명",
  customerEmail: "고객 이메일",

  // 상품/서비스 정보
  productName: "코딩 교육 서비스",
  productType: "education",

  // 시스템 정보
  createdAt: serverTimestamp(),
  source: "web",
  platform: "toss-payments"
}
```

#### `users` 컬렉션 (Firebase Auth 연동)
**목적**: 사용자 정보 저장 (필요시 확장)
**기본 구조**:
```javascript
{
  uid: "Firebase Auth UID",
  email: "사용자 이메일",
  displayName: "사용자 이름",
  createdAt: Timestamp,
  lastLoginAt: Timestamp,
  // 추가 프로필 정보...
}
```

---

## 🔧 데이터베이스 유틸리티 (`lib/`)

### `firestore.js` - Firestore 기본 CRUD 작업

#### 주요 함수들:

**문서 생성**:
```javascript
// 자동 ID로 문서 생성
const docId = await createDocument('reviews', {
  courseName: '강의명',
  rating: 5,
  content: '리뷰 내용'
});

// 지정 ID로 문서 생성
await setDocument('users', 'user123', {
  email: 'user@example.com',
  name: '사용자명'
});
```

**문서 조회**:
```javascript
// 단일 문서 조회
const review = await getDocument('reviews', 'review_id');

// 컬렉션 전체 조회
const reviews = await getDocuments('reviews');

// 조건부 조회
const recentReviews = await getDocuments('reviews', [
  queryHelpers.where('rating', '>=', 4),
  queryHelpers.orderBy('createdAt', 'desc'),
  queryHelpers.limit(10)
]);
```

**문서 업데이트/삭제**:
```javascript
// 문서 업데이트
await updateDocument('reviews', 'review_id', {
  content: '수정된 리뷰 내용'
});

// 문서 삭제
await deleteDocument('reviews', 'review_id');
```

**실시간 리스너**:
```javascript
// 단일 문서 실시간 감지
const unsubscribe = subscribeToDocument('reviews', 'review_id', (data) => {
  console.log('리뷰 업데이트:', data);
});

// 컬렉션 실시간 감지
const unsubscribe = subscribeToCollection('reviews', (reviews) => {
  console.log('리뷰 목록 업데이트:', reviews);
});
```

### `storage.js` - Firebase Storage 이미지 관리

#### 주요 함수들:

**이미지 업로드**:
```javascript
// 일반 이미지 업로드
const result = await uploadImage(file, 'path/to/image.jpg');
if (result.success) {
  console.log('업로드 URL:', result.url);
  console.log('저장 경로:', result.path);
}

// 리뷰 이미지 전용 업로드 (경로 자동 생성)
const result = await uploadReviewImage(file, userId, reviewId);
```

**이미지 삭제**:
```javascript
// Storage 경로로 삭제
await deleteImage('reviews/user123/review456/image.jpg');

// URL에서 경로 추출 후 삭제
const path = getPathFromUrl(imageUrl);
if (path) {
  await deleteImage(path);
}
```

**이미지 처리**:
```javascript
// 미리보기 URL 생성
const previewUrl = createPreviewUrl(file);

// 미리보기 URL 메모리 해제
revokePreviewUrl(previewUrl);

// 이미지 리사이징
const resizedFile = await resizeImage(file, 1200, 800, 0.8);
```

### `payment-db.js` - 결제 관련 데이터베이스 작업

#### 주요 함수들:

**결제 정보 저장**:
```javascript
const saveResult = await savePaymentInfo({
  paymentKey: 'payment_key',
  orderId: 'order_123',
  amount: 50000,
  method: 'card',
  customerName: '고객명',
  customerEmail: 'customer@example.com'
});
```

**결제 기록 조회**:
```javascript
// 사용자별 결제 기록
const payments = await getUserPayments('user@example.com');

// 특정 결제 정보
const payment = await getPaymentById('payment_doc_id');
```

---

## 🔒 보안 고려사항

### 환경 변수 관리
```javascript
// 서버 사이드 전용 (절대 클라이언트 노출 금지)
TOSS_PAYMENTS_SECRET_KEY=your_secret_key
FIREBASE_PRIVATE_KEY=your_private_key

// 클라이언트 사이드 (NEXT_PUBLIC_ 접두사)
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

### 데이터 검증
- 클라이언트와 서버 모두에서 입력 유효성 검사
- SQL Injection 방지 (Firestore는 NoSQL이지만 여전히 중요)
- XSS 방지를 위한 사용자 입력 이스케이프

### 접근 제어
- Firebase Security Rules로 컬렉션 접근 제어
- API 라우트에서 인증 상태 확인
- 민감한 데이터는 서버 사이드에서만 처리

---

## 📈 성능 최적화

### 쿼리 최적화
```javascript
// 인덱스 활용한 효율적 쿼리
const q = query(
  collection(db, 'reviews'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc'),
  limit(20)
);
```

### 캐싱 전략
- 자주 조회되는 데이터는 클라이언트 캐시 활용
- React Query나 SWR 같은 라이브러리 고려
- Firebase 오프라인 지원 활용

### 이미지 최적화
- 업로드 시 자동 리사이징 및 압축
- WebP 형식 지원
- CDN을 통한 이미지 서빙

---

## 🚀 확장 가능성

### 추가 가능한 컬렉션
- `courses`: 강의 정보
- `enrollments`: 수강 신청 정보
- `notifications`: 알림 데이터
- `analytics`: 사용자 행동 분석

### API 확장 방향
- GraphQL API 도입
- 실시간 알림 (WebSocket)
- 관리자 전용 API
- 분석 및 리포팅 API

### 데이터베이스 확장
- 샤딩 전략 (대용량 데이터 처리)
- 읽기 전용 복제본 활용
- 데이터 아카이빙 정책