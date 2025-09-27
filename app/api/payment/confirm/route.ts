import { NextRequest, NextResponse } from 'next/server';

// 토스페이먼츠 시크릿 키 (테스트용)
const secretKey = 'test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R';

export async function POST(request: NextRequest) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { error: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 결제 승인 API 호출
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

    // 결제 승인 성공 시 데이터베이스에 저장하는 로직을 여기에 추가
    // 예: 주문 정보 저장, 사용자에게 상품 제공 등
    console.log('결제 승인 성공:', {
      paymentKey: result.paymentKey,
      orderId: result.orderId,
      amount: result.totalAmount,
      method: result.method,
      approvedAt: result.approvedAt,
    });

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