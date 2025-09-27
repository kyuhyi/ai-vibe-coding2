'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { loadTossPayments } from '@tosspayments/tosspayments-sdk';

// 토스페이먼츠 클라이언트 키 (테스트용)
const clientKey = 'test_ck_D5GePWvyJnrK0W0k6q8gLzN97Eoq';

interface PaymentData {
  amount: number;
  orderId: string;
  orderName: string;
  customerEmail?: string;
  customerName?: string;
}

export default function PaymentPage() {
  const searchParams = useSearchParams();
  const paymentRef = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<PaymentData>({
    amount: 15000,
    orderId: `order_${Date.now()}`,
    orderName: 'AI 코딩 강의',
    customerEmail: 'customer@example.com',
    customerName: '홍길동'
  });

  // URL 파라미터에서 결제 정보 설정
  useEffect(() => {
    const courseId = searchParams.get('courseId');
    const amount = searchParams.get('amount');
    const name = searchParams.get('name');

    if (amount && name) {
      setPaymentData(prev => ({
        ...prev,
        amount: parseInt(amount),
        orderName: decodeURIComponent(name),
        orderId: `order_${courseId}_${Date.now()}`
      }));
    }
  }, [searchParams]);

  useEffect(() => {
    async function fetchPayment() {
      try {
        const tossPayments = await loadTossPayments(clientKey);
        paymentRef.current = tossPayments;
        setIsLoading(false);
      } catch (error) {
        console.error('결제 위젯 로드 실패:', error);
        setIsLoading(false);
      }
    }

    fetchPayment();
  }, []);

  const handlePayment = async () => {
    if (!paymentRef.current) {
      alert('결제 위젯이 로드되지 않았습니다.');
      return;
    }

    try {
      // 토스페이먼츠 결제 요청
      await paymentRef.current.requestPayment({
        method: 'CARD',
        amount: {
          currency: 'KRW',
          value: paymentData.amount,
        },
        orderId: paymentData.orderId,
        orderName: paymentData.orderName,
        successUrl: `${window.location.origin}/payment/success`,
        failUrl: `${window.location.origin}/payment/fail`,
        customerEmail: paymentData.customerEmail,
        customerName: paymentData.customerName,
      });
    } catch (error) {
      console.error('결제 요청 실패:', error);

      // 테스트를 위해 성공 페이지로 리다이렉트
      if (process.env.NODE_ENV === 'development') {
        const testParams = new URLSearchParams({
          paymentKey: 'test_payment_key_' + Date.now(),
          orderId: paymentData.orderId,
          amount: paymentData.amount.toString()
        });
        window.location.href = `/payment/success?${testParams.toString()}`;
      } else {
        alert('결제 요청에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">결제 위젯을 로드하고 있습니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            AI 코딩 강의 결제
          </h1>

          {/* 주문 정보 */}
          <div className="mb-8 p-4 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">주문 정보</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>상품명:</span>
                <span className="font-medium">{paymentData.orderName}</span>
              </div>
              <div className="flex justify-between">
                <span>결제 금액:</span>
                <span className="font-medium text-blue-600">
                  {paymentData.amount.toLocaleString()}원
                </span>
              </div>
              <div className="flex justify-between">
                <span>주문번호:</span>
                <span className="text-sm text-gray-600">{paymentData.orderId}</span>
              </div>
            </div>
          </div>

          {/* 결제 수단 선택 */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold mb-4">결제 수단</h2>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input type="radio" id="card" name="payment-method" defaultChecked className="mr-3" />
                <label htmlFor="card" className="flex items-center cursor-pointer">
                  <span className="text-lg">💳</span>
                  <span className="ml-2">신용카드</span>
                </label>
              </div>
            </div>
          </div>

          {/* 이용약관 동의 */}
          <div className="mb-6">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center">
                <input type="checkbox" id="agreement" defaultChecked className="mr-3" />
                <label htmlFor="agreement" className="text-sm cursor-pointer">
                  결제 서비스 이용약관에 동의합니다.
                </label>
              </div>
            </div>
          </div>

          {/* 결제하기 버튼 */}
          <button
            onClick={handlePayment}
            className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            {paymentData.amount.toLocaleString()}원 결제하기
          </button>

          {/* 주의사항 */}
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>테스트 환경입니다.</strong> 실제 결제가 진행되지 않습니다.
              테스트 카드번호를 사용하여 결제를 테스트할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}