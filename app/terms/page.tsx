export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white py-24">
      <div className="max-w-4xl mx-auto px-6">
        <h1 className="text-3xl font-bold mb-8">이용약관</h1>
        <div className="space-y-8">
          <section>
            <h2 className="text-xl font-semibold mb-4">제1조 (목적)</h2>
            <p className="text-gray-600">이 약관은 AI Vibe(이하 &ldquo;회사&rdquo;라 함)가 제공하는 서비스의 이용에 관한 사항을 규정합니다.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">제2조 (정의)</h2>
            <p className="text-gray-600">&ldquo;서비스&rdquo;란 회사가 제공하는 AI 기반 코딩 교육 서비스를 의미합니다.</p>
          </section>
          <section>
            <h2 className="text-xl font-semibold mb-4">제3조 (서비스 이용)</h2>
            <p className="text-gray-600">이용자는 본 약관에 동의한 후 서비스를 이용할 수 있습니다.</p>
          </section>
          <p className="text-sm text-gray-500 mt-8">마지막 업데이트: 2024년 1월 1일</p>
        </div>
      </div>
    </div>
  );
}