'use client'

import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthChange, logout } from '@/lib/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthChange(async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // 사용자 프로필 정보 가져오기
        try {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            setUserProfile(userDocSnap.data());
          } else {
            // 새 사용자인 경우 기본 프로필 설정
            // 특정 이메일들을 관리자로 설정 (본인 이메일 추가하세요)
            const adminEmails = ['admin@example.com', 'dk24gh@naver.com']; // 관리자 테스트 계정
            const isAdmin = adminEmails.includes(firebaseUser.email);

            const defaultProfile = {
              role: isAdmin ? 'admin' : 'user', // 관리자 이메일이면 admin, 아니면 user
              displayName: firebaseUser.displayName || '',
              email: firebaseUser.email,
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

  const value = {
    user,
    userProfile,
    loading,
    signOut,
    isAdmin: userProfile?.role === 'admin',
    isLoggedIn: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};