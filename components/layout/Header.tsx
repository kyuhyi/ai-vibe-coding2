'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ChevronDown, User, Settings, LogOut, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: '홈', href: '/' },
  { name: '코스', href: '/courses' },
  { name: '소개', href: '/about' },
  { name: '문의', href: '/contact' },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const { user, userProfile, loading, signOut, isAdmin, isLoggedIn } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 모바일 메뉴 열릴 때 body 스크롤 막기
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    // 클린업
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-300",
        isScrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-black/50 backdrop-blur-sm"
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
                className="object-contain h-12"
                style={{ width: 'auto' }}
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
                'group relative px-4 py-2 text-base font-bold rounded-xl transition-all duration-300',
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
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 text-white/80 hover:text-white transition-all duration-300 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl px-4 py-2"
              >
                {userProfile?.photoURL ? (
                  <Image
                    src={userProfile.photoURL}
                    alt={userProfile.displayName || '사용자'}
                    width={24}
                    height={24}
                    className="rounded-full"
                  />
                ) : (
                  <User className="w-5 h-5" />
                )}
                <span className="text-sm font-medium">
                  {userProfile?.displayName || user?.email?.split('@')[0] || '사용자'}
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-black/90 backdrop-blur-xl border border-white/20 rounded-xl shadow-lg py-2">
                  <div className="px-4 py-2 border-b border-white/10">
                    <p className="text-sm font-medium text-white">{userProfile?.displayName || '사용자'}</p>
                    <p className="text-xs text-gray-400">{user?.email}</p>
                    {isAdmin && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                        <Shield className="w-3 h-3" />
                        관리자
                      </span>
                    )}
                  </div>

                  <div className="py-1">
                    <Link
                      href="/mypage"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <User className="w-4 h-4" />
                      마이페이지
                    </Link>

                    {isAdmin && (
                      <Link
                        href="/admin"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        <Shield className="w-4 h-4" />
                        관리자 대시보드
                      </Link>
                    )}

                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/10 transition-colors"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      <Settings className="w-4 h-4" />
                      설정
                    </Link>
                  </div>

                  <div className="border-t border-white/10 pt-1">
                    <button
                      onClick={() => {
                        signOut();
                        setIsUserMenuOpen(false);
                      }}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
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
                  className="bg-white hover:bg-white/90 !text-black hover:!text-black font-black shadow-lg hover:shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:scale-105"
                >
                  시작하기
                </Button>
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden">
          {/* Full screen overlay */}
          <div
            className="fixed inset-0 z-[9999] bg-black w-screen h-screen overflow-y-auto"
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: '#000000',
              width: '100vw',
              height: '100vh',
              zIndex: 9999
            }}
          >
            <div className="flex flex-col min-h-screen w-full bg-black">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-6 border-b border-white/10 bg-black">
                <Link href="/" className="group -m-1.5 p-1.5" onClick={() => setIsMenuOpen(false)}>
                  <div className="relative h-10 w-auto group-hover:scale-105 transition-all duration-300">
                    <Image
                      src="/bsd-white.png"
                      alt="Logo"
                      width={100}
                      height={40}
                      className="object-contain h-10"
                      style={{ width: 'auto' }}
                      priority
                    />
                  </div>
                </Link>
                <button
                  type="button"
                  className="group -m-2.5 rounded-xl p-2.5 text-white hover:text-white hover:bg-white/10 transition-all duration-200 z-[10000]"
                  onClick={() => setIsMenuOpen(false)}
                  style={{ zIndex: 10000 }}
                >
                  <span className="sr-only">메뉴 닫기</span>
                  <svg className="h-6 w-6 group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Navigation */}
              <div className="flex-1 px-6 py-6 bg-black">
                <div className="space-y-3 mb-8">
                  {navigationItems.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={cn(
                        'group block rounded-xl px-4 py-3 text-lg font-bold leading-7 transition-all duration-300 touch-manipulation',
                        pathname === item.href
                          ? 'text-white bg-white/15 shadow-lg backdrop-blur-sm border border-white/20'
                          : 'text-white hover:text-white hover:bg-white/10'
                      )}
                      onClick={() => setIsMenuOpen(false)}
                      style={{ minHeight: '48px', display: 'flex', alignItems: 'center' }}
                    >
                      <span className="flex items-center gap-3 text-white">
                        {item.name}
                        {pathname === item.href && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>

                {/* Auth Section */}
                <div className="bg-black">
                  {loading ? (
                    <div className="flex justify-center py-8">
                      <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    </div>
                  ) : isLoggedIn ? (
                    <div className="space-y-4">
                      <div className="bg-white/10 rounded-xl p-4 border border-white/20">
                        <div className="flex items-center gap-3">
                          {userProfile?.photoURL ? (
                            <Image
                              src={userProfile.photoURL}
                              alt={userProfile.displayName || '사용자'}
                              width={40}
                              height={40}
                              className="rounded-full"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white">
                              {userProfile?.displayName || '사용자'}
                            </p>
                            <p className="text-xs text-gray-400">{user?.email}</p>
                            {isAdmin && (
                              <span className="inline-flex items-center gap-1 px-2 py-1 mt-1 text-xs bg-red-500/20 text-red-400 rounded-full">
                                <Shield className="w-3 h-3" />
                                관리자
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Link href="/mypage" onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            size="md"
                            className="w-full justify-start text-white hover:text-white hover:bg-white/10 transition-all duration-300 touch-manipulation"
                            style={{ minHeight: '48px' }}
                          >
                            <User className="w-4 h-4 mr-2" />
                            마이페이지
                          </Button>
                        </Link>

                        {isAdmin && (
                          <Link href="/admin" onClick={() => setIsMenuOpen(false)}>
                            <Button
                              variant="ghost"
                              size="md"
                              className="w-full justify-start text-white hover:text-white hover:bg-white/10 transition-all duration-300 touch-manipulation"
                              style={{ minHeight: '48px' }}
                            >
                              <Shield className="w-4 h-4 mr-2" />
                              관리자 대시보드
                            </Button>
                          </Link>
                        )}

                        <Link href="/settings" onClick={() => setIsMenuOpen(false)}>
                          <Button
                            variant="ghost"
                            size="md"
                            className="w-full justify-start text-white hover:text-white hover:bg-white/10 transition-all duration-300 touch-manipulation"
                            style={{ minHeight: '48px' }}
                          >
                            <Settings className="w-4 h-4 mr-2" />
                            설정
                          </Button>
                        </Link>

                        <Button
                          variant="ghost"
                          size="md"
                          onClick={() => {
                            signOut();
                            setIsMenuOpen(false);
                          }}
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-300 touch-manipulation"
                          style={{ minHeight: '48px' }}
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          로그아웃
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-center mb-6">
                        <h3 className="text-lg font-bold text-white mb-2">로그인이 필요합니다</h3>
                        <p className="text-sm text-white/60">AI 코딩 교육을 시작해보세요!</p>
                      </div>

                      <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="ghost"
                          size="lg"
                          className="w-full text-white hover:text-white hover:bg-white/10 border border-white/20 backdrop-blur-sm transition-all duration-300 touch-manipulation"
                          style={{ minHeight: '56px' }}
                        >
                          <User className="w-5 h-5 mr-2" />
                          로그인
                        </Button>
                      </Link>

                      <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                        <Button
                          variant="primary"
                          size="lg"
                          className="w-full bg-white hover:bg-white/90 !text-black hover:!text-black font-black shadow-lg hover:shadow-xl border-0 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] touch-manipulation"
                          style={{ minHeight: '56px' }}
                        >
                          ✨ 지금 시작하기
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}