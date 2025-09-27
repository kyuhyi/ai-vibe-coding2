import { courses } from '@/lib/data';
import CourseCard from '@/components/courses/CourseCard';

export const metadata = {
  title: 'AI 코딩 코스 | AI Vibe',
  description: 'ChatGPT, Claude, GitHub Copilot을 활용한 실무 중심 코딩 교육 코스를 확인해보세요.',
};

export default function CoursesPage() {
  return (
    <div className="bg-white py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            AI 코딩 교육 코스
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            실무에서 바로 사용할 수 있는 AI 도구들을 배우고, 개발 생산성을 극대화하는 방법을 익혀보세요.
          </p>
        </div>

        {/* Filters */}
        <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="flex flex-wrap items-center gap-6 border-b border-gray-200 pb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">레벨:</span>
              <div className="flex gap-2">
                {['All', 'Beginner', 'Intermediate', 'Advanced'].map((level) => (
                  <button
                    key={level}
                    className={`px-3 py-1 text-sm rounded-full transition-colors ${
                      level === 'All'
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {level === 'All' ? '전체' : level}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-900">정렬:</span>
              <select className="text-sm border border-gray-300 rounded-md px-3 py-1 bg-white">
                <option>인기순</option>
                <option>최신순</option>
                <option>가격순</option>
                <option>평점순</option>
              </select>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        <div className="mx-auto mt-10 grid max-w-2xl grid-cols-1 gap-8 sm:mt-16 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            더 많은 코스 보기
            <svg className="ml-2 -mr-1 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}