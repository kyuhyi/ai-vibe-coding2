export default function FAQPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">자주 묻는 질문</h1>
        <div className="space-y-6">
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-2">AI 코딩 교육이 무엇인가요?</h3>
            <p className="text-gray-600">ChatGPT, Claude, GitHub Copilot 등 AI 도구를 활용하여 더 효율적으로 프로그래밍을 배우는 교육입니다.</p>
          </div>
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-2">초보자도 가능한가요?</h3>
            <p className="text-gray-600">네, 프로그래밍 경험이 없어도 AI 도구를 활용해 단계별로 학습할 수 있습니다.</p>
          </div>
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-2">어떤 언어를 배울 수 있나요?</h3>
            <p className="text-gray-600">JavaScript, Python, React, Node.js 등 다양한 프로그래밍 언어와 프레임워크를 학습할 수 있습니다.</p>
          </div>
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-2">수강료는 얼마인가요?</h3>
            <p className="text-gray-600">코스별로 다르며, 자세한 내용은 코스 페이지에서 확인하실 수 있습니다.</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">1:1 멘토링이 포함되나요?</h3>
            <p className="text-gray-600">네, 모든 코스에 전문가와의 1:1 멘토링이 포함되어 있습니다.</p>
          </div>
        </div>
      </div>
    </div>
  );
}