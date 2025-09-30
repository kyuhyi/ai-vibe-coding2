'use client'

import dynamic from 'next/dynamic'
import Features from '@/components/home/Features';
import PopularCourses from '@/components/home/PopularCourses';
import CourseReviews from '@/components/home/CourseReviews';
import Testimonials from '@/components/home/Testimonials';
import CTA from '@/components/home/CTA';

const Hero = dynamic(() => import('@/components/home/Hero'), {
  ssr: false,
  loading: () => <div className="w-full h-screen bg-black/[0.96]"></div>
})

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