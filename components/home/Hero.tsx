'use client'

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import Button from '@/components/ui/Button';
import { SpotlightInteractive } from '@/components/ui/spotlight-interactive';

// Spline 컴포넌트를 클라이언트 사이드에서만 로드
const SplineScene = dynamic(() => import('@/components/ui/splite').then(mod => ({ default: mod.SplineScene })), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-900/20 to-purple-900/20 backdrop-blur-sm">
      <div className="text-center">
        <div className="w-32 h-32 mx-auto mb-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full opacity-50 animate-pulse"></div>
        <p className="text-white/60">3D Scene Loading...</p>
      </div>
    </div>
  )
});

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const splineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (splineRef.current && heroRef.current) {
        const heroRect = heroRef.current.getBoundingClientRect();
        const centerX = heroRect.width / 2;
        const centerY = heroRect.height / 2;
        
        const mouseX = e.clientX - heroRect.left;
        const mouseY = e.clientY - heroRect.top;
        
        const rotateX = ((mouseY - centerY) / centerY) * -8;
        const rotateY = ((mouseX - centerX) / centerX) * 12;
        
        splineRef.current.style.transform = `
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
          scale(1.05)
        `;
      }
    };

    const heroElement = heroRef.current;
    if (heroElement) {
      heroElement.addEventListener('mousemove', handleMouseMove);
      return () => heroElement.removeEventListener('mousemove', handleMouseMove);
    }
  }, []);

  return (
    <section ref={heroRef} className="w-full min-h-screen relative overflow-hidden bg-black/[0.96]">
      <SpotlightInteractive
        className="z-10"
        size={400}
      />
      
      <div className="flex h-screen">
        <div className="flex-1 p-8 lg:p-16 relative z-20 flex flex-col justify-center">
          <div className="max-w-2xl">
            <div className="mb-8 animate-fade-in">
              <span className="inline-block px-6 py-3 bg-blue-600/20 text-blue-300 rounded-full text-sm font-medium border border-blue-400/30 backdrop-blur-sm">
                AI 시대의 새로운 교육
              </span>
            </div>

            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-8 animate-slide-up">
              퍼널띵과 함께하는<br />
              실무위주 바이브코딩
            </h1>

            <p className="text-lg md:text-xl text-gray-100 mb-10 leading-relaxed backdrop-blur-sm animate-fade-in">
              ChatGPT, Claude, GitHub Copilot 등 최신 AI 도구를 활용하여 더 빠르고 효율적으로 프로그래밍을 배우세요.
              실무 중심의 프로젝트로 AI 시대의 개발자가 되어보세요.
            </p>

            <div className="flex flex-col sm:flex-row items-start gap-6 mb-12 animate-slide-up">
              <Link href="/courses">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-white/10 text-black hover:text-white px-6 py-3 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-white/20 hover:border-white/30 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group"
                >
                  <span className="relative z-10 text-black group-hover:text-white font-black">코스 둘러보기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
              </Link>
            </div>

            <div className="flex flex-wrap items-start gap-4 text-gray-100 animate-fade-in">
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 px-4 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">평생 업데이트</span>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 px-4 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">1:1 멘토링</span>
              </div>
              <div className="flex items-center gap-3 backdrop-blur-sm bg-white/10 px-4 py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-6 h-6 bg-green-400 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">실전 프로젝트</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          <div
            ref={splineRef}
            className="w-full h-full transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <SplineScene
              scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
              className="w-full h-full"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/60 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}