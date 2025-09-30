'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import Button from '@/components/ui/Button';
import { signupWithEmail, loginWithGoogle } from '@/lib/auth';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [error, setError] = useState('');

  const router = useRouter();

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.displayName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('비밀번호는 최소 6자 이상이어야 합니다.');
      setIsLoading(false);
      return;
    }

    try {
      const { user, error } = await signupWithEmail(formData.email, formData.password, formData.displayName);

      if (error) {
        setError(getKoreanErrorMessage(error));
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignup = async () => {
    setIsGoogleLoading(true);
    setError('');

    try {
      const { user, error } = await loginWithGoogle();

      if (error) {
        setError(getKoreanErrorMessage(error));
      } else {
        router.push('/');
      }
    } catch (err) {
      setError('Google 회원가입 중 오류가 발생했습니다.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const getKoreanErrorMessage = (error: string) => {
    if (error.includes('email-already-in-use')) {
      return '이미 사용 중인 이메일입니다.';
    } else if (error.includes('weak-password')) {
      return '비밀번호가 너무 약습니다.';
    } else if (error.includes('invalid-email')) {
      return '올바른 이메일 형식이 아닙니다.';
    } else if (error.includes('popup-closed-by-user')) {
      return 'Google 회원가입이 취소되었습니다.';
    } else if (error.includes('cancelled-popup-request')) {
      return 'Google 회원가입이 취소되었습니다.';
    }
    return '회원가입에 실패했습니다. 다시 시도해주세요.';
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        {/* 헤더 */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-2">회원가입</h2>
          <p className="text-gray-400">새 계정을 만들어 시작하세요</p>
        </div>

        {/* 회원가입 폼 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          {/* Google 회원가입 버튼 */}
          <div className="mb-6">
            <Button
              onClick={handleGoogleSignup}
              disabled={isGoogleLoading || isLoading}
              className="w-full bg-white hover:bg-gray-100 !text-black font-semibold py-3 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isGoogleLoading ? 'Google 회원가입 중...' : 'Google로 회원가입'}
            </Button>
          </div>

          {/* 구분선 */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/20"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-black/50 px-2 text-gray-400">또는</span>
            </div>
          </div>

          <form onSubmit={handleEmailSignup} className="space-y-6">
            {/* 이름 */}
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-white mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 입력하세요 (최소 6자)"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-white mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  className="w-full pl-10 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* 에러 메시지 */}
            {error && (
              <div className="text-red-400 text-sm text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                {error}
              </div>
            )}

            {/* 이메일 회원가입 버튼 */}
            <Button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 transition-all duration-300 disabled:opacity-50"
            >
              {isLoading ? '회원가입 중...' : '이메일로 회원가입'}
            </Button>
          </form>

          {/* 하단 링크 */}
          <div className="mt-6 text-center">
            <Link href="/login" className="text-blue-400 hover:text-blue-300 text-sm transition-colors">
              이미 계정이 있으신가요? 로그인
            </Link>
          </div>
        </div>

        {/* 홈으로 돌아가기 */}
        <div className="text-center">
          <Link href="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  );
}