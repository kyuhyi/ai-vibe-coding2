import { NextRequest, NextResponse } from 'next/server';
import { getUserPayments, getPaymentById } from '../../../../lib/payment-db';

// 사용자의 결제 기록 조회 API
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userEmail = searchParams.get('email');
    const paymentId = searchParams.get('id');

    // 특정 결제 정보 조회
    if (paymentId) {
      const result = await getPaymentById(paymentId);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        payment: result.payment
      });
    }

    // 사용자별 결제 기록 조회
    if (userEmail) {
      const result = await getUserPayments(userEmail);

      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        payments: result.payments,
        count: result.payments?.length || 0
      });
    }

    return NextResponse.json(
      { error: '이메일 또는 결제 ID가 필요합니다.' },
      { status: 400 }
    );

  } catch (error) {
    console.error('결제 기록 조회 중 오류:', error);
    return NextResponse.json(
      {
        error: '서버 오류가 발생했습니다.',
        details: error instanceof Error ? error.message : '알 수 없는 오류'
      },
      { status: 500 }
    );
  }
}