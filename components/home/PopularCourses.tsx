import Link from 'next/link';
import { courses } from '@/lib/data';
import CourseCard from '@/components/courses/CourseCard';
import Button from '@/components/ui/Button';

export default function PopularCourses() {
  // 인기 코스 (평점순으로 상위 3개)
  const popularCourses = courses
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="py-24 sm:py-32 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            인기 코스
          </h2>
          <p className="mt-4 text-lg leading-8 text-gray-600">
            많은 학습자들이 선택한 인기 있는 AI 코딩 교육 코스들을 만나보세요.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 sm:mt-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {popularCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link href="/courses">
            <Button variant="outline" size="lg">
              모든 코스 보기
              <svg className="ml-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}