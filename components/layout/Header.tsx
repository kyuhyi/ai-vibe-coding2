'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import Button from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: '홈', href: '/' },
  { name: '코스', href: '/courses' },
  { name: '데모', href: '/demo' },
  { name: '소개', href: '/about' },
  { name: '문의', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-black/20 backdrop-blur-xl border-b border-white/10 shadow-2xl" 
          : "bg-transparent"
      )}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-8">
        {/* Logo */}
        <div className="flex lg:flex-1">
          <Link href="/" className="group -m-1.5 p-1.5">
            <div className="relative h-12 w-auto group-hover:scale-105 transition-all duration-300">
              <Image
                src="/bsd-white.png"
                alt="Logo"
                width={120}
                height={48}
                className="object-contain h-12 w-auto"
                priority
              />
            </div>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex lg:hidden">
          <button
            type="button"
            className="group -m-2.5 inline-flex items-center justify-center rounded-xl p-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <span className="sr-only">메뉴 열기</span>
            <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex lg:gap-x-1">
          {navigationItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'group relative px-4 py-2 text-sm font-medium rounded-xl transition-all duration-300',
                pathname === item.href 
                  ? 'text-white bg-white/15 shadow-lg backdrop-blur-sm border border-white/20' 
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              )}
            >
              <span className="relative z-10">{item.name}</span>
              {pathname === item.href && (
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-sm"></div>
              )}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end lg:gap-x-3">
          <Link href="/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-white/80 hover:text-white hover:bg-white/10 border-white/20 backdrop-blur-sm transition-all duration-300"
            >
              로그인
            </Button>
          </Link>
          <Link href="/signup">
            <Button 
              variant="primary" 
              size="sm"
              className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              시작하기
            </Button>
          </Link>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          <div 
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          ></div>
          <div className="fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-black/30 backdrop-blur-xl border-l border-white/10 px-6 py-6 sm:max-w-sm">
            <div className="flex items-center justify-between">
              <Link href="/" className="group -m-1.5 p-1.5">
                <div className="relative h-10 w-auto group-hover:scale-105 transition-all duration-300">
                  <Image
                    src="/bsd-white.png"
                    alt="Logo"
                    width={100}
                    height={40}
                    className="object-contain h-10 w-auto"
                    priority
                  />
                </div>
              </Link>
              <button
                type="button"
                className="group -m-2.5 rounded-xl p-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-all duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                <span className="sr-only">메뉴 닫기</span>
                <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="-my-6 divide-y divide-white/10">
                <div className="space-y-3 py-6">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group -mx-3 block rounded-xl px-4 py-3 text-base font-medium leading-7 transition-all duration-300',
                        pathname === item.href 
                          ? 'text-white bg-white/15 shadow-lg backdrop-blur-sm border border-white/20' 
                          : 'text-white/80 hover:text-white hover:bg-white/10'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span className="flex items-center gap-3">
                        {item.name}
                        {pathname === item.href && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
                <div className="py-6">
                  <div className="flex flex-col gap-4">
                    <Link href="/login">
                      <Button 
                        variant="ghost" 
                        size="md" 
                        className="w-full text-white/80 hover:text-white hover:bg-white/10 border-white/20 backdrop-blur-sm transition-all duration-300"
                      >
                        로그인
                      </Button>
                    </Link>
                    <Link href="/signup">
                      <Button 
                        variant="primary" 
                        size="md" 
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-lg hover:shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02]"
                      >
                        시작하기
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}