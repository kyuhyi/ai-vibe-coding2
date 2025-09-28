import Hero from '@/components/home/Hero';
import Features from '@/components/home/Features';
import PopularCourses from '@/components/home/PopularCourses';
import CourseReviews from '@/components/home/CourseReviews';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <PopularCourses />
      <CourseReviews />
      <Testimonials />
      <CTA />
    </>
  );
}