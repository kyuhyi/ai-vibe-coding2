import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTA() {
  return (
    <section className="bg-black">
      <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            AI와 함께 코딩을 시작해보세요
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-primary-100">
            전 세계 개발자들이 AI 도구로 생산성을 3배 이상 높이고 있습니다.
            <br />
            지금 바로 여러분도 시작해보세요.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/courses">
              <Button variant="secondary" size="lg" className="bg-white !text-black hover:bg-gray-50 hover:!text-black">
                무료 체험하기
              </Button>
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6 text-white">
              라이브 데모 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 grid max-w-4xl grid-cols-1 gap-8 lg:mx-0 lg:mt-20 lg:grid-cols-3">
            <div className="flex flex-col justify-between gap-y-6 rounded-2xl bg-white/5 p-8 lg:h-64">
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">활성 수강생</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  매달 새로운 AI 도구를 배우고 적용하는 개발자들
                </p>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">2,500+</p>
            </div>
            <div className="flex flex-col justify-between gap-y-6 rounded-2xl bg-white/5 p-8 lg:h-64">
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">만족도</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  수강생들의 평균 만족도와 추천 의향
                </p>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">95%</p>
            </div>
            <div className="flex flex-col justify-between gap-y-6 rounded-2xl bg-white/5 p-8 lg:h-64">
              <div>
                <p className="text-lg font-semibold tracking-tight text-white">생산성 향상</p>
                <p className="mt-2 text-sm leading-6 text-white/80">
                  AI 도구 활용 후 평균 개발 속도 개선
                </p>
              </div>
              <p className="text-4xl font-bold tracking-tight text-white">3배</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}