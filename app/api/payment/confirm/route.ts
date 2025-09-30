import { NextRequest, NextResponse } from 'next/server';
import { savePaymentInfo } from '../../../../lib/payment-db';

// 토스페이먼츠 시크릿 키 (환경 변수에서 가져오기)
const secretKey = process.env.TOSS_PAYMENTS_SECRET_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log('결제 승인 API 시작');
    console.log('시크릿 키 확인:', secretKey ? '설정됨' : '설정안됨');

    const { paymentKey, orderId, amount } = await request.json();
    console.log('받은 파라미터:', { paymentKey, orderId, amount });

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      console.log('필수 파라미터 누락');
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 시크릿 키 확인
    if (!secretKey) {
      console.log('토스페이먼츠 시크릿 키 누락');
      return NextResponse.json(
        { error: '토스페이먼츠 시크릿 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
    console.log('토스페이먼츠 API 호출 시작');
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(secretKey + ':').toString('base64')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const result = await response.json();
    console.log('토스페이먼츠 API 응답:', { status: response.status, result });

    if (!response.ok) {
      console.error('토스페이먼츠 API 오류:', result);
      return NextResponse.json(
        {
          error: '결제 승인에 실패했습니다.',
          details: result.message || '알 수 없는 오류'
        },
        { status: response.status }
      );
    }

    // 결제 승인 성공 시 데이터베이스에 저장
    console.log('결제 승인 성공:', {
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
      approvedAt: result.approvedAt,
    });

    // Firebase에 결제 정보 저장
    const saveResult = await savePaymentInfo({
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
      status: result.status,
      approvedAt: result.approvedAt,
      type: result.type,
      currency: result.currency,
      customerName: result.customerName,
      customerEmail: result.customerEmail,
      productName: '코딩 교육 서비스',
      productType: 'education'
    });

    if (!saveResult.success) {
      console.error('결제 정보 저장 실패:', saveResult.error);
      // 저장 실패해도 결제는 성공이므로 클라이언트에는 성공 응답
    } else {
      console.log('결제 정보 DB 저장 완료:', saveResult.id);
    }

    // 성공 응답 반환
    return NextResponse.json({
      success: true,
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
      approvedAt: result.approvedAt,
      message: '결제가 성공적으로 완료되었습니다.',
    });

  } catch (error) {
    console.error('결제 승인 처리 중 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}