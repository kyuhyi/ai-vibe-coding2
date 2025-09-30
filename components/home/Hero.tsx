'use client'

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Button from '@/components/ui/Button';
import { SpotlightInteractive } from '@/components/ui/spotlight-interactive';
import { SplineScene } from '@/components/ui/spline';

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

      <div className="flex h-screen lg:flex-row flex-col">
        {/* 메인 콘텐츠 - 모바일에서는 전체 화면 사용 */}
        <div className="flex-1 lg:flex-1 py-20 px-6 sm:py-24 sm:px-8 lg:p-16 relative z-20 flex flex-col justify-center">
          <div className="max-w-2xl mx-auto lg:mx-0 text-center lg:text-left">
            <div className="mb-6 lg:mb-8 animate-fade-in">
              <span className="inline-block px-4 py-2 lg:px-6 lg:py-3 bg-blue-600/20 text-blue-300 rounded-full text-xs sm:text-sm font-medium border border-blue-400/30 backdrop-blur-sm">
                AI 시대의 새로운 교육
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight lg:leading-loose mb-6 lg:mb-8 animate-slide-up">
              퍼널띵과 함께하는<br />
              <span className="text-blue-400">실무위주 바이브코딩</span>
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-gray-100 mb-8 lg:mb-10 leading-relaxed lg:leading-loose backdrop-blur-sm animate-fade-in">
              ChatGPT, Claude, GitHub Copilot 등<br className="sm:hidden" /><span className="hidden sm:inline"> </span>
              최신 AI 도구를 활용하여<br />
              더 빠르고 효율적으로 프로그래밍을 배우세요.<br />
              <span className="text-blue-300">실무 중심의 프로젝트</span>로 AI 시대의 개발자가 되어보세요.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 lg:gap-6 mb-8 lg:mb-12 animate-slide-up">
              <Link href="/courses">
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full sm:w-auto bg-white hover:bg-white/10 text-black hover:text-white px-8 py-4 text-lg font-black shadow-xl hover:shadow-2xl transition-all duration-500 backdrop-blur-xl border border-white/20 hover:border-white/30 transform hover:scale-105 hover:-translate-y-1 relative overflow-hidden group touch-manipulation"
                  style={{ minHeight: '56px' }}
                >
                  <span className="relative z-10 text-black group-hover:text-white font-black">코스 둘러보기</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 lg:gap-4 text-gray-100 animate-fade-in max-w-lg mx-auto lg:max-w-none">
              <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 backdrop-blur-sm bg-white/10 px-3 py-2 lg:px-4 lg:py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm lg:text-base">평생 업데이트</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 backdrop-blur-sm bg-white/10 px-3 py-2 lg:px-4 lg:py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm lg:text-base">1:1 멘토링</span>
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-2 lg:gap-3 backdrop-blur-sm bg-white/10 px-3 py-2 lg:px-4 lg:py-3 rounded-xl border border-white/20 hover:bg-white/20 transition-all duration-300">
                <div className="w-5 h-5 lg:w-6 lg:h-6 bg-green-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 lg:w-4 lg:h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium text-sm lg:text-base">실전 프로젝트</span>
              </div>
            </div>

            {/* 모바일용 추가 정보 */}
            <div className="mt-8 lg:hidden">
              <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                <div className="text-center">
                  <h3 className="text-lg font-bold text-white mb-2">AI와 함께 성장하세요</h3>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    최신 AI 도구들을 마스터하고<br />
                    실무에서 바로 활용할 수 있는<br />
                    <span className="text-blue-400 font-semibold">개발 스킬</span>을 익혀보세요
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Spline 섹션 - 모바일에서는 숨김 */}
        <div className="hidden lg:flex lg:flex-1 relative">
          <div
            ref={splineRef}
            className="w-full h-full transition-transform duration-300 ease-out"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <SplineScene
              scene="https://my.spline.design/untitled-1293de50088c5f7d0c8770f9c8ec9682/"
              className="w-full h-full"
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-black/60 pointer-events-none"></div>
        </div>
      </div>
    </section>
  );
}