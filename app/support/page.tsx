export default function SupportPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">고객지원</h1>
        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">문의하기</h2>
            <p className="text-gray-600 mb-4">궁금한 점이 있으시면 언제든지 연락해주세요.</p>
            <div className="space-y-2">
              <p><strong>이메일:</strong> support@aivibe.dev</p>
              <p><strong>전화:</strong> 02-1234-5678</p>
              <p><strong>운영시간:</strong> 평일 09:00 - 18:00</p>
            </div>
          </div>
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">자주 묻는 질문</h2>
            <p className="text-gray-600">일반적인 질문과 답변을 확인해보세요.</p>
          </div>
        </div>
      </div>
    </div>
  );
}