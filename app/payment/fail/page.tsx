'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function PaymentFailPage() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get('code');
  const errorMessage = searchParams.get('message');

  const getErrorMessage = (code: string | null) => {
    switch (code) {
      case 'PAY_PROCESS_CANCELED':
        return '사용자가 결제를 취소했습니다.';
      case 'PAY_PROCESS_ABORTED':
        return '결제 진행 중 오류가 발생했습니다.';
      case 'REJECT_CARD_COMPANY':
        return '카드사에서 결제를 거절했습니다.';
      case 'INVALID_CARD_COMPANY':
        return '유효하지 않은 카드입니다.';
      case 'NOT_ENOUGH_BALANCE':
        return '잔액이 부족합니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_COUNT':
        return '일일 결제 한도를 초과했습니다.';
      case 'EXCEED_MAX_DAILY_PAYMENT_AMOUNT':
        return '일일 결제 금액을 초과했습니다.';
      case 'INVALID_PAYMENT_METHOD':
        return '유효하지 않은 결제 수단입니다.';
      default:
        return errorMessage || '알 수 없는 오류가 발생했습니다.';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8 text-center">
          {/* 실패 아이콘 */}
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-gray-900 mb-4">결제 실패</h1>
          <p className="text-gray-600 mb-6">
            {getErrorMessage(errorCode)}
          </p>

          {/* 오류 정보 (개발용) */}
          {(errorCode || errorMessage) && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-left">
              <h2 className="font-semibold text-red-800 mb-2">오류 정보</h2>
              <div className="space-y-1 text-sm text-red-700">
                {errorCode && (
                  <div>
                    <span className="font-medium">오류 코드:</span> {errorCode}
                  </div>
                )}
                {errorMessage && (
                  <div>
                    <span className="font-medium">오류 메시지:</span> {errorMessage}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 해결 방법 안내 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h2 className="font-semibold text-blue-800 mb-2">해결 방법</h2>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 카드 정보를 다시 확인해주세요</li>
              <li>• 다른 카드나 결제 수단을 시도해보세요</li>
              <li>• 잠시 후 다시 시도해주세요</li>
              <li>• 문제가 계속되면 고객센터에 문의하세요</li>
            </ul>
          </div>

          {/* 액션 버튼들 */}
          <div className="space-y-3">
            <Link
              href="/payment"
              className="block w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              다시 결제하기
            </Link>
            <Link
              href="/courses"
              className="block w-full bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors"
            >
              강의 목록으로
            </Link>
            <Link
              href="/"
              className="block w-full text-gray-500 py-2 hover:text-gray-700 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}