// Firebase Admin 비활성화 (클라이언트 사이드 Firebase만 사용)
// 실제 프로덕션 환경에서는 Firebase Admin SDK 서비스 계정 키 필요

console.log('Firebase Admin SDK가 비활성화되었습니다. 클라이언트 사이드 Firebase를 사용합니다.');

// 임시로 null 내보내기 (Admin SDK 기능이 필요한 경우 별도 설정 필요)
export const adminDb = null;
export const adminApp = null;