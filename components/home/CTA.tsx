import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function CTA() {
  return (
    <section className="bg-primary-600">
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
              <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
                무료 체험하기
              </Button>
            </Link>
            <Link href="/demo" className="text-sm font-semibold leading-6 text-white">
              라이브 데모 보기 <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Stats */}
          <div className="mx-auto mt-16 flex max-w-2xl flex-col gap-8 lg:mx-0 lg:mt-20 lg:max-w-none lg:flex-row lg:items-end">
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-white/5 p-8 sm:w-3/5 sm:max-w-md sm:flex-row-reverse sm:items-end lg:w-72 lg:max-w-none lg:flex-none lg:flex-col lg:items-start">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">2,500+</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">활성 수강생</p>
                <p className="mt-2 text-base leading-7 text-primary-100">
                  매달 새로운 AI 도구를 배우고 적용하는 개발자들
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-white/5 p-8 sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-sm lg:flex-auto lg:flex-col lg:items-start lg:gap-y-44">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">95%</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">만족도</p>
                <p className="mt-2 text-base leading-7 text-primary-100">
                  수강생들의 평균 만족도와 추천 의향
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse justify-between gap-x-16 gap-y-8 rounded-2xl bg-white/5 p-8 sm:w-11/12 sm:max-w-xl sm:flex-row-reverse sm:items-end lg:w-full lg:max-w-none lg:flex-auto lg:flex-col lg:items-start lg:gap-y-28">
              <p className="flex-none text-3xl font-bold tracking-tight text-white">3배</p>
              <div className="sm:w-80 sm:shrink lg:w-auto lg:flex-none">
                <p className="text-lg font-semibold tracking-tight text-white">생산성 향상</p>
                <p className="mt-2 text-base leading-7 text-primary-100">
                  AI 도구 활용 후 평균 개발 속도 개선
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}