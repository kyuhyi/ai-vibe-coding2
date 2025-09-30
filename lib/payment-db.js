import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

// 결제 정보를 Firestore에 저장하는 함수
export const savePaymentInfo = async (paymentData) => {
  try {
    // payments 컬렉션에 결제 정보 저장
    const paymentDoc = {
      // 토스페이먼츠 결과 정보
      paymentKey: paymentData.paymentKey,
      orderId: paymentData.orderId,
      amount: paymentData.totalAmount || paymentData.amount,
      method: paymentData.method,
      status: paymentData.status || 'DONE',
      approvedAt: paymentData.approvedAt,

      // 결제 상세 정보
      paymentType: paymentData.type || 'NORMAL',
      currency: paymentData.currency || 'KRW',
      customerName: paymentData.customerName,
      customerEmail: paymentData.customerEmail,

      // 상품/서비스 정보
      productName: paymentData.productName || '코딩 교육 서비스',
      productType: paymentData.productType || 'education',

      // 시스템 정보
      createdAt: serverTimestamp(),
      source: 'web',
      platform: 'toss-payments'
    };

    // Firestore에 저장
    const docRef = await addDoc(collection(db, 'payments'), paymentDoc);

    console.log('결제 정보 저장 성공:', docRef.id);
    return { success: true, id: docRef.id };

  } catch (error) {
    console.error('결제 정보 저장 실패:', error);
    return { success: false, error: error.message };
  }
};

// 사용자의 결제 기록 조회
export const getUserPayments = async (userEmail) => {
  try {
    const { query, where, orderBy, getDocs } = await import('firebase/firestore');

    const paymentsRef = collection(db, 'payments');
    const q = query(
      paymentsRef,
      where('customerEmail', '==', userEmail),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);

    const payments = [];
    snapshot.forEach(doc => {
      payments.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return { success: true, payments };
  } catch (error) {
    console.error('결제 기록 조회 실패:', error);
    return { success: false, error: error.message };
  }
};

// 특정 결제 정보 조회
export const getPaymentById = async (paymentId) => {
  try {
    const { doc, getDoc } = await import('firebase/firestore');

    const paymentDoc = await getDoc(doc(db, 'payments', paymentId));

    if (!paymentDoc.exists()) {
      return { success: false, error: '결제 정보를 찾을 수 없습니다.' };
    }

    return {
      success: true,
      payment: { id: paymentDoc.id, ...paymentDoc.data() }
    };
  } catch (error) {
    console.error('결제 정보 조회 실패:', error);
    return { success: false, error: error.message };
  }
};