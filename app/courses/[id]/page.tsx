import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { courses } from '@/lib/data';
import Button from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { formatPrice, formatNumber } from '@/lib/utils';

interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateStaticParams() {
  return courses.map((course) => ({
    id: course.id,
  }));
}

export async function generateMetadata({ params }: CoursePageProps) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    return {
      title: '코스를 찾을 수 없습니다 | AI Vibe',
    };
  }

  return {
    title: `${course.title} | AI Vibe`,
    description: course.description,
  };
}

export default function CoursePage({ params }: CoursePageProps) {
  const course = courses.find((c) => c.id === params.id);

  if (!course) {
    notFound();
  }

  const levelColors = {
    Beginner: 'bg-green-100 text-green-800',
    Intermediate: 'bg-yellow-100 text-yellow-800',
    Advanced: 'bg-red-100 text-red-800',
  };

  const curriculum = [
    { week: 1, title: 'AI 도구 소개 및 개발 환경 설정', duration: '2시간' },
    { week: 2, title: 'ChatGPT를 활용한 코드 작성과 디버깅', duration: '3시간' },
    { week: 3, title: 'GitHub Copilot으로 생산성 향상하기', duration: '2.5시간' },
    { week: 4, title: '실전 프로젝트 1: 웹 애플리케이션 구축', duration: '4시간' },
    { week: 5, title: 'Claude와 함께하는 코드 리뷰와 최적화', duration: '3시간' },
    { week: 6, title: 'AI 도구들의 협업 워크플로우', duration: '2시간' },
    { week: 7, title: '실전 프로젝트 2: API 개발과 테스트', duration: '4시간' },
    { week: 8, title: '최종 프로젝트 발표 및 피드백', duration: '3시간' },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-blue-600 px-6 py-24 sm:py-32 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-xl">
          <div className="flex items-center gap-3 mb-6">
            <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${levelColors[course.level]}`}>
              {course.level}
            </span>
            <span className="text-white/80">{course.duration}</span>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {course.title}
          </h1>

          <p className="mt-6 text-lg leading-8 text-white/90">
            {course.description}
          </p>

          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center text-white/90">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {course.instructor}
            </div>

            <div className="flex items-center text-white/90">
              <div className="flex text-yellow-400 mr-2">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'fill-current' : 'fill-white/30'}`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              {course.rating} ({formatNumber(course.students)}명)
            </div>
          </div>

          <div className="mt-10 flex items-center gap-x-6">
            <Button variant="secondary" size="lg" className="bg-white text-primary-600 hover:bg-gray-50">
              <span className="text-2xl font-bold mr-2">{formatPrice(course.price)}</span>
              지금 등록하기
            </Button>
            <Button variant="outline" size="lg" className="text-white border-white hover:bg-white/10">
              무료 체험
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-16 max-w-2xl lg:mx-0 lg:mt-0 lg:max-w-none lg:flex-none xl:col-span-2">
          <div className="relative h-80 lg:h-96">
            <Image
              src={course.image}
              alt={course.title}
              fill
              className="absolute inset-0 h-full w-full object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Course Description */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">코스 소개</h2>
              <div className="prose prose-lg text-gray-600">
                <p>
                  이 코스는 현대 AI 도구들을 실무에서 어떻게 활용하는지 배우는 실전 중심의 교육입니다.
                  ChatGPT, Claude, GitHub Copilot 등의 도구들을 사용하여 개발 생산성을 극대화하는 방법을 학습합니다.
                </p>
                <p>
                  단순한 이론 학습이 아닌, 실제 프로젝트를 통해 AI 도구들을 활용하는 실무 능력을 기를 수 있습니다.
                  코스 완료 후에는 AI와 함께 더 빠르고 효율적으로 개발할 수 있는 능력을 갖추게 됩니다.
                </p>
              </div>
            </div>

            {/* Learning Objectives */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">학습 목표</h2>
              <ul className="space-y-3">
                {[
                  'AI 도구들을 활용한 효율적인 코드 작성 방법 습득',
                  'ChatGPT와 Claude를 이용한 코드 디버깅 및 최적화',
                  'GitHub Copilot을 활용한 생산성 향상 기법',
                  '실전 프로젝트를 통한 AI 도구 협업 워크플로우 구축',
                  'AI 시대에 맞는 개발자 마인드셋과 스킬 개발',
                ].map((objective, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="w-6 h-6 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Curriculum */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">커리큘럼</h2>
              <div className="space-y-4">
                {curriculum.map((item, index) => (
                  <Card key={index}>
                    <CardContent className="py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-semibold mr-4">
                            {item.week}
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">{item.duration}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Prerequisites */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">수강 요건</h2>
              <div className="bg-blue-50 p-6 rounded-lg">
                <ul className="space-y-2">
                  <li className="flex items-center text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    기본적인 프로그래밍 지식 (변수, 함수, 조건문)
                  </li>
                  <li className="flex items-center text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    컴퓨터와 인터넷 환경
                  </li>
                  <li className="flex items-center text-blue-800">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    AI 도구 사용에 대한 호기심과 열정
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <Card>
                <CardContent>
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">
                      {formatPrice(course.price)}
                    </div>
                    <p className="text-gray-600">평생 이용 가능</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-600">수강생</span>
                      <span className="font-semibold">{formatNumber(course.students)}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">수강 기간</span>
                      <span className="font-semibold">{course.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">난이도</span>
                      <span className="font-semibold">{course.level}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">언어</span>
                      <span className="font-semibold">한국어</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <Button variant="primary" size="lg" className="w-full">
                      지금 등록하기
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      무료 체험
                    </Button>
                  </div>

                  <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">30일 환불 보장</p>
                  </div>
                </CardContent>
              </Card>

              {/* Tags */}
              <div className="mt-6">
                <h3 className="font-semibold text-gray-900 mb-3">태그</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-block bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full hover:bg-gray-200 cursor-pointer"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}