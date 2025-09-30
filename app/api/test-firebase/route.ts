import { NextRequest, NextResponse } from 'next/server';
import { savePaymentInfo } from '../../../lib/payment-db';

export async function POST(request: NextRequest) {
  try {
    // 테스트 결제 정보
    const testPaymentData = {
      paymentKey: 'test_' + Date.now(),
      orderId: 'order_' + Date.now(),
      amount: 10000,
      method: 'CARD',
      status: 'DONE',
      approvedAt: new Date().toISOString(),
      customerName: '테스트 사용자',
      customerEmail: 'test@example.com',
      productName: '테스트 상품'
    };

    console.log('테스트 결제 정보 저장 시작:', testPaymentData);

    const result = await savePaymentInfo(testPaymentData);

    console.log('테스트 결제 정보 저장 결과:', result);

    return NextResponse.json({
      message: 'Firebase 테스트 완료',
      testData: testPaymentData,
      saveResult: result
    });

  } catch (error) {
    console.error('Firebase 테스트 중 오류:', error);
    return NextResponse.json(
      {
        error: 'Firebase 테스트 실패',
        details: error instanceof Error ? error.message : '알 수 없는 오류',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}