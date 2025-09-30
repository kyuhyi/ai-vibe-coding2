'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, logout } from '@/lib/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db, auth } from '@/lib/firebase';
import { signInWithCustomToken } from 'firebase/auth';
import { loginWithKakao, initKakao } from '@/lib/kakao';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

interface UserProfile {
  role: 'admin' | 'user';
  displayName: string;
  email: string;
  photoURL: string;
  bio?: string;
  createdAt: Date;
  enrolledCourses: string[];
  completedCourses: string[];
  totalLearningHours?: number;
  notifications?: {
    email?: boolean;
    push?: boolean;
    sms?: boolean;
  };
  privacy?: {
    profileVisible?: boolean;
    showProgress?: boolean;
    showCertificates?: boolean;
  };
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  signInWithKakao: () => Promise<void>;
  isAdmin: boolean;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  signOut: async () => {},
  signInWithKakao: async () => {},
  isAdmin: false,
  isLoggedIn: false,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser: any) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // 사용자 프로필 정보 가져오기
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data() as UserProfile);
          } else {
            // 새 사용자인 경우 기본 프로필 설정
            // 특정 이메일들을 관리자로 설정 (본인 이메일 추가하세요)
            const adminEmails = ['admin@example.com', 'dk24gh@naver.com']; // 관리자 테스트 계정
            const isAdmin = adminEmails.includes(firebaseUser.email);

            const defaultProfile: UserProfile = {
              role: isAdmin ? 'admin' : 'user', // 관리자 이메일이면 admin, 아니면 user
              displayName: firebaseUser.displayName || '',
              email: firebaseUser.email || '',
              photoURL: firebaseUser.photoURL || '',
              createdAt: new Date(),
              enrolledCourses: [],
              completedCourses: []
            };
            setUserProfile(defaultProfile);

            // Firestore에 사용자 프로필 저장
            await setDoc(userDocRef, defaultProfile);
          }
        } catch (error) {
          console.error('프로필 로딩 에러:', error);
          setUserProfile(null);
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error('로그아웃 에러:', error);
    }
  };

  const signInWithKakao = async () => {
    try {
      setLoading(true);

      // 카카오 SDK 초기화 및 대기
      const isKakaoReady = await initKakao();
      if (!isKakaoReady) {
        throw new Error('카카오 SDK 초기화 실패');
      }

      // 카카오 로그인
      const kakaoResult = await loginWithKakao();
      console.log('카카오 로그인 결과:', kakaoResult);

      // 임시로 이메일/비밀번호 방식으로 Firebase 계정 생성/로그인
      // 실제로는 Firebase Custom Token을 서버에서 생성해야 함
      const { signInWithEmailAndPassword, createUserWithEmailAndPassword } = await import('firebase/auth');

      // 카카오 사용자 정보로 Firebase 계정 생성 시도
      const kakaoEmail = kakaoResult.user.email || `kakao_${kakaoResult.user.id}@temp.com`;
      const tempPassword = `kakao_${kakaoResult.user.id}_temp_password`;

      try {
        // 기존 계정으로 로그인 시도
        await signInWithEmailAndPassword(auth, kakaoEmail, tempPassword);
      } catch (signInError) {
        // 계정이 없으면 새로 생성
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, kakaoEmail, tempPassword);

          // 사용자 프로필 업데이트
          const { updateProfile } = await import('firebase/auth');
          await updateProfile(userCredential.user, {
            displayName: kakaoResult.user.nickname,
            photoURL: kakaoResult.user.profileImage
          });

        } catch (createError) {
          console.error('계정 생성 에러:', createError);
          throw new Error('카카오 로그인 중 오류가 발생했습니다.');
        }
      }

    } catch (error) {
      console.error('카카오 로그인 에러:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    signInWithKakao,
    isAdmin: userProfile?.role === 'admin',
    isLoggedIn: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};