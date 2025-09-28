'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Settings,
  User,
  Bell,
  Lock,
  Trash2,
  Save,
  Shield,
  Mail,
  Smartphone
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function SettingsPage() {
  const { user, userProfile, loading, isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('profile');
  const [saving, setSaving] = useState(false);

  const [profileSettings, setProfileSettings] = useState({
    displayName: '',
    email: '',
    bio: '',
    notifications: {
      email: true,
      push: false,
      sms: false
    },
    privacy: {
      profileVisible: true,
      showProgress: true,
      showCertificates: true
    }
  });

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push('/login');
    }
  }, [loading, isLoggedIn, router]);

  useEffect(() => {
    if (userProfile && user) {
      setProfileSettings({
        displayName: userProfile.displayName || '',
        email: user.email || '',
        bio: userProfile.bio || '',
        notifications: {
          email: userProfile.notifications?.email ?? true,
          push: userProfile.notifications?.push ?? false,
          sms: userProfile.notifications?.sms ?? false
        },
        privacy: {
          profileVisible: userProfile.privacy?.profileVisible ?? true,
          showProgress: userProfile.privacy?.showProgress ?? true,
          showCertificates: userProfile.privacy?.showCertificates ?? true
        }
      });
    }
  }, [userProfile, user]);

  const handleSave = async () => {
    setSaving(true);
    // 여기에 실제 저장 로직을 구현할 수 있습니다
    setTimeout(() => {
      setSaving(false);
    }, 1000);
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
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
            <Settings className="w-6 h-6 text-blue-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">설정</h1>
            <p className="text-gray-400">계정 및 환경 설정</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* 사이드바 */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-4 border border-white/10 sticky top-24">
              <nav className="space-y-2">
                {[
                  { id: 'profile', label: '프로필', icon: User },
                  { id: 'notifications', label: '알림', icon: Bell },
                  { id: 'privacy', label: '개인정보', icon: Lock },
                  { id: 'security', label: '보안', icon: Shield },
                  { id: 'danger', label: '계정 삭제', icon: Trash2 }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* 메인 콘텐츠 */}
          <div className="lg:col-span-3">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">

              {/* 프로필 탭 */}
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-6">프로필 설정</h2>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-white mb-2">이름</label>
                        <input
                          type="text"
                          value={profileSettings.displayName}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, displayName: e.target.value }))}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="이름을 입력하세요"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">이메일</label>
                        <input
                          type="email"
                          value={profileSettings.email}
                          disabled
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-gray-400 cursor-not-allowed"
                        />
                        <p className="text-xs text-gray-400 mt-1">이메일은 변경할 수 없습니다</p>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-white mb-2">소개</label>
                        <textarea
                          value={profileSettings.bio}
                          onChange={(e) => setProfileSettings(prev => ({ ...prev, bio: e.target.value }))}
                          rows={4}
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                          placeholder="자신에 대해 간단히 소개해주세요"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 알림 탭 */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">알림 설정</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Mail className="w-5 h-5 text-blue-400" />
                        <div>
                          <h3 className="font-medium text-white">이메일 알림</h3>
                          <p className="text-gray-400 text-sm">새로운 코스 및 업데이트 알림</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.notifications.email}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, email: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-green-400" />
                        <div>
                          <h3 className="font-medium text-white">푸시 알림</h3>
                          <p className="text-gray-400 text-sm">브라우저 푸시 알림</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.notifications.push}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, push: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div className="flex items-center gap-3">
                        <Smartphone className="w-5 h-5 text-purple-400" />
                        <div>
                          <h3 className="font-medium text-white">SMS 알림</h3>
                          <p className="text-gray-400 text-sm">중요한 업데이트 SMS</p>
                        </div>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.notifications.sms}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          notifications: { ...prev.notifications, sms: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 개인정보 탭 */}
              {activeTab === 'privacy' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">개인정보 설정</h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h3 className="font-medium text-white">프로필 공개</h3>
                        <p className="text-gray-400 text-sm">다른 사용자가 내 프로필을 볼 수 있습니다</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.privacy.profileVisible}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, profileVisible: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h3 className="font-medium text-white">학습 진도 공개</h3>
                        <p className="text-gray-400 text-sm">내 학습 진도를 다른 사용자에게 표시</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.privacy.showProgress}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showProgress: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                      <div>
                        <h3 className="font-medium text-white">수료증 공개</h3>
                        <p className="text-gray-400 text-sm">획득한 수료증을 프로필에 표시</p>
                      </div>
                      <input
                        type="checkbox"
                        checked={profileSettings.privacy.showCertificates}
                        onChange={(e) => setProfileSettings(prev => ({
                          ...prev,
                          privacy: { ...prev.privacy, showCertificates: e.target.checked }
                        }))}
                        className="toggle"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* 보안 탭 */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">보안 설정</h2>

                  <div className="space-y-6">
                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-medium text-white mb-4">비밀번호 변경</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="현재 비밀번호"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="password"
                          placeholder="새 비밀번호"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <input
                          type="password"
                          placeholder="새 비밀번호 확인"
                          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                          비밀번호 변경
                        </Button>
                      </div>
                    </div>

                    <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                      <h3 className="font-medium text-white mb-2">2단계 인증</h3>
                      <p className="text-gray-400 text-sm mb-4">계정 보안을 강화하기 위해 2단계 인증을 설정하세요</p>
                      <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                        2단계 인증 설정
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* 계정 삭제 탭 */}
              {activeTab === 'danger' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-white mb-6">위험 구역</h2>

                  <div className="p-6 bg-red-500/10 rounded-xl border border-red-500/20">
                    <div className="flex items-center gap-3 mb-4">
                      <Trash2 className="w-6 h-6 text-red-400" />
                      <h3 className="font-medium text-white">계정 삭제</h3>
                    </div>
                    <p className="text-gray-300 mb-4">
                      계정을 삭제하면 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.
                      삭제되는 데이터:
                    </p>
                    <ul className="text-gray-300 text-sm mb-6 space-y-1 ml-4">
                      <li>• 프로필 정보</li>
                      <li>• 학습 진도 및 기록</li>
                      <li>• 작성한 리뷰 및 댓글</li>
                      <li>• 획득한 수료증</li>
                    </ul>
                    <Button className="bg-red-600 hover:bg-red-700 text-white">
                      계정 삭제하기
                    </Button>
                  </div>
                </div>
              )}

              {/* 저장 버튼 */}
              {(activeTab === 'profile' || activeTab === 'notifications' || activeTab === 'privacy') && (
                <div className="flex justify-end pt-6 border-t border-white/10 mt-8">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    {saving ? '저장 중...' : '변경사항 저장'}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}