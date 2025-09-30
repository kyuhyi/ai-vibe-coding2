'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  User,
  Mail,
  Calendar,
  BookOpen,
  Award,
  Edit,
  Save,
  X,
  Clock,
  Target,
  Trophy
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export default function MyPage() {
  const { user, userProfile, loading, isLoggedIn } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayName: '',
    bio: ''
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (userProfile) {
      setEditForm({
        displayName: userProfile.displayName || '',
        bio: userProfile.bio || ''
      });
    }
  }, [userProfile]);

  const handleSaveProfile = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        displayName: editForm.displayName,
        bio: editForm.bio,
        updatedAt: new Date()
      });

      setIsEditing(false);
    } catch (error) {
      console.error('프로필 업데이트 에러:', error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 프로필 헤더 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
          <div className="flex flex-col lg:flex-row items-start gap-6">
            {/* 프로필 이미지 */}
            <div className="relative">
              {userProfile?.photoURL ? (
                <Image
                  src={userProfile.photoURL}
                  alt={userProfile.displayName || '사용자'}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white/20"
                />
              ) : (
                <div className="w-30 h-30 bg-white/20 rounded-full flex items-center justify-center border-4 border-white/20">
                  <User className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* 프로필 정보 */}
            <div className="flex-1">
              {isEditing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">이름</label>
                    <input
                      type="text"
                      value={editForm.displayName}
                      onChange={(e) => setEditForm(prev => ({ ...prev, displayName: e.target.value }))}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="이름을 입력하세요"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">소개</label>
                    <textarea
                      value={editForm.bio}
                      onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                      rows={3}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                      placeholder="자신에 대해 간단히 소개해주세요"
                    />
                  </div>
                  <div className="flex gap-3">
                    <Button
                      onClick={handleSaveProfile}
                      disabled={saving}
                      className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      {saving ? '저장 중...' : '저장'}
                    </Button>
                    <Button
                      onClick={() => setIsEditing(false)}
                      variant="ghost"
                      className="text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      취소
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h1 className="text-3xl font-bold text-white">
                      {userProfile?.displayName || '사용자'}
                    </h1>
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="ghost"
                      size="sm"
                      className="text-white/80 hover:text-white hover:bg-white/10 flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      편집
                    </Button>
                  </div>

                  <div className="flex items-center gap-4 text-gray-300 mb-4">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{user?.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        가입일: {userProfile?.createdAt instanceof Date ? userProfile.createdAt.toLocaleDateString('ko-KR') : '알 수 없음'}
                      </span>
                    </div>
                  </div>

                  {userProfile?.bio && (
                    <p className="text-white/80 leading-relaxed">
                      {userProfile.bio}
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 학습 현황 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">수강 중인 코스</h3>
                <p className="text-gray-400 text-sm">현재 진행 중</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {userProfile?.enrolledCourses?.length || 0}개
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">완료한 코스</h3>
                <p className="text-gray-400 text-sm">수료증 획득</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {userProfile?.completedCourses?.length || 0}개
            </p>
          </div>

          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                <Trophy className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">학습 시간</h3>
                <p className="text-gray-400 text-sm">총 누적 시간</p>
              </div>
            </div>
            <p className="text-2xl font-bold text-white">
              {userProfile?.totalLearningHours || 0}시간
            </p>
          </div>
        </div>

        {/* 최근 활동 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">최근 활동</h2>

          {(!userProfile?.enrolledCourses || userProfile.enrolledCourses.length === 0) ? (
            <div className="text-center py-12">
              <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">아직 수강 중인 코스가 없습니다</h3>
              <p className="text-gray-400 mb-6">새로운 코스를 시작해보세요!</p>
              <Button
                onClick={() => router.push('/courses')}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                코스 둘러보기
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* 여기에 실제 학습 활동 목록이 들어갈 예정 */}
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-white">Python 기초 강의 완료</h4>
                  <p className="text-gray-400 text-sm">2시간 전</p>
                </div>
                <div className="text-green-400 text-sm font-medium">완료</div>
              </div>
            </div>
          )}
        </div>

        {/* 추천 코스 */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
          <h2 className="text-2xl font-bold text-white mb-6">추천 코스</h2>
          <div className="text-center py-12">
            <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">맞춤 추천 코스</h3>
            <p className="text-gray-400 mb-6">
              학습 이력을 기반으로 당신에게 최적화된 코스를 추천해드립니다
            </p>
            <Button
              onClick={() => router.push('/courses')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              코스 탐색하기
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}