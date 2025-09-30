'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  Users,
  BookOpen,
  MessageSquare,
  Settings,
  BarChart,
  UserCheck,
  UserX,
  Plus,
  Search,
  Filter,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Trash2
} from 'lucide-react';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { collection, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { deleteImage, getPathFromUrl } from '@/lib/storage';

interface User {
  id: string;
  displayName: string;
  email: string;
  role: string;
  createdAt: any;
  enrolledCourses: string[];
  completedCourses: string[];
}

interface Review {
  id: string;
  courseName: string;
  instructorName: string;
  rating: number;
  content: string;
  studentName: string;
  createdAt: any;
  images?: string[];
  imagePaths?: string[];
}

// 관리자용 이미지 갤러리 컴포넌트
function AdminImageGallery({
  images,
  imagePaths,
  reviewId,
  onImageDelete
}: {
  images: string[];
  imagePaths?: string[];
  reviewId: string;
  onImageDelete: (reviewId: string, imageIndex: number) => void;
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleDeleteImage = async (imageIndex: number) => {
    if (confirm('이 이미지를 삭제하시겠습니까?')) {
      onImageDelete(reviewId, imageIndex);
    }
  };

  return (
    <>
      {/* 썸네일 그리드 */}
      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.slice(0, 4).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
          >
            <Image
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 25vw, (max-width: 1200px) 15vw, 10vw"
              onClick={() => {
                setCurrentIndex(index);
                setIsOpen(true);
              }}
            />
            {/* 삭제 버튼 */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteImage(index);
              }}
              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
            >
              <Trash2 className="w-3 h-3" />
            </button>
            {index === 3 && images.length > 4 && (
              <div
                className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                onClick={() => {
                  setCurrentIndex(index);
                  setIsOpen(true);
                }}
              >
                <span className="text-white font-semibold text-sm">
                  +{images.length - 4}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 이미지 뷰어 모달 */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative max-w-4xl max-h-full p-4">
            {/* 닫기 버튼 */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {/* 삭제 버튼 */}
            <button
              onClick={() => {
                handleDeleteImage(currentIndex);
                setIsOpen(false);
              }}
              className="absolute top-4 left-4 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors z-10"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            {/* 이미지 */}
            <div className="relative">
              <Image
                src={images[currentIndex]}
                alt={`리뷰 이미지 ${currentIndex + 1}`}
                width={800}
                height={600}
                className="object-contain max-h-[80vh]"
              />

              {/* 이전/다음 버튼 */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronLeft className="w-8 h-8" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300"
                  >
                    <ChevronRight className="w-8 h-8" />
                  </button>
                </>
              )}
            </div>

            {/* 이미지 인디케이터 */}
            {images.length > 1 && (
              <div className="flex justify-center mt-4 gap-2">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full ${
                      index === currentIndex ? 'bg-white' : 'bg-gray-500'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default function AdminDashboard() {
  const { user, userProfile, loading, isAdmin, isLoggedIn } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [users, setUsers] = useState<User[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && (!isLoggedIn || !isAdmin)) {
      router.push('/');
    }
  }, [loading, isLoggedIn, isAdmin, router]);

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin]);

  const loadDashboardData = async () => {
    try {
      setDashboardLoading(true);

      // 사용자 데이터 로드
      const usersQuery = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
      const usersSnapshot = await getDocs(usersQuery);
      const usersData = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as User[];
      setUsers(usersData);

      // 리뷰 데이터 로드
      const reviewsQuery = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
      const reviewsSnapshot = await getDocs(reviewsQuery);
      const reviewsData = reviewsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Review[];
      setReviews(reviewsData);

    } catch (error) {
      console.error('대시보드 데이터 로딩 에러:', error);
    } finally {
      setDashboardLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, { role: newRole });

      // 로컬 상태 업데이트
      setUsers(prev => prev.map(user =>
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (error) {
      console.error('사용자 역할 업데이트 에러:', error);
    }
  };

  const deleteReview = async (reviewId: string) => {
    try {
      // 먼저 리뷰의 이미지들을 Storage에서 삭제
      const review = reviews.find(r => r.id === reviewId);
      if (review?.imagePaths) {
        for (const imagePath of review.imagePaths) {
          try {
            await deleteImage(imagePath);
          } catch (error) {
            console.error('이미지 삭제 실패:', imagePath, error);
          }
        }
      }

      // Firestore에서 리뷰 문서 삭제
      await deleteDoc(doc(db, 'reviews', reviewId));
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      console.error('리뷰 삭제 에러:', error);
    }
  };

  // 개별 이미지 삭제 함수
  const deleteReviewImage = async (reviewId: string, imageIndex: number) => {
    try {
      const review = reviews.find(r => r.id === reviewId);
      if (!review || !review.images || !review.imagePaths) return;

      const imageToDelete = review.images[imageIndex];
      const pathToDelete = review.imagePaths[imageIndex];

      // Storage에서 이미지 삭제
      if (pathToDelete) {
        await deleteImage(pathToDelete);
      }

      // 배열에서 해당 이미지 제거
      const updatedImages = review.images.filter((_, index) => index !== imageIndex);
      const updatedPaths = review.imagePaths.filter((_, index) => index !== imageIndex);

      // Firestore 업데이트
      const reviewDocRef = doc(db, 'reviews', reviewId);
      await updateDoc(reviewDocRef, {
        images: updatedImages,
        imagePaths: updatedPaths
      });

      // 로컬 상태 업데이트
      setReviews(prev => prev.map(r =>
        r.id === reviewId
          ? { ...r, images: updatedImages, imagePaths: updatedPaths }
          : r
      ));

      alert('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('이미지 삭제 에러:', error);
      alert('이미지 삭제에 실패했습니다.');
    }
  };

  const filteredUsers = users.filter(user =>
    user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReviews = reviews.filter(review =>
    review.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    review.studentName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 bg-red-500/20 rounded-xl flex items-center justify-center">
            <Shield className="w-6 h-6 text-red-400" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">관리자 대시보드</h1>
            <p className="text-gray-400">시스템 관리 및 모니터링</p>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'overview', label: '개요', icon: BarChart },
            { id: 'users', label: '사용자 관리', icon: Users },
            { id: 'reviews', label: '리뷰 관리', icon: MessageSquare },
            { id: 'settings', label: '설정', icon: Settings }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 hover:text-white'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* 탭 콘텐츠 */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* 통계 카드 */}
            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">총 사용자</h3>
                    <p className="text-gray-400 text-sm">등록된 사용자 수</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{users.length}명</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                    <UserCheck className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">활성 사용자</h3>
                    <p className="text-gray-400 text-sm">최근 7일 접속</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'user').length}명</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center">
                    <MessageSquare className="w-6 h-6 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">총 리뷰</h3>
                    <p className="text-gray-400 text-sm">작성된 리뷰 수</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{reviews.length}개</p>
              </div>

              <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                    <Shield className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">관리자</h3>
                    <p className="text-gray-400 text-sm">관리자 계정 수</p>
                  </div>
                </div>
                <p className="text-2xl font-bold text-white">{users.filter(u => u.role === 'admin').length}명</p>
              </div>
            </div>

            {/* 최근 활동 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
              <h2 className="text-2xl font-bold text-white mb-6">최근 활동</h2>
              <div className="space-y-4">
                {reviews.slice(0, 5).map(review => (
                  <div key={review.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-white">{review.studentName}</h4>
                      <p className="text-gray-400 text-sm">{review.courseName}에 리뷰 작성</p>
                    </div>
                    <div className="text-gray-400 text-sm">
                      {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString('ko-KR')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            {/* 검색 및 필터 */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="사용자 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                <Plus className="w-4 h-4" />
                새 사용자
              </Button>
            </div>

            {/* 사용자 목록 */}
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <div className="p-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white">사용자 목록</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">사용자</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">이메일</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">역할</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">가입일</th>
                      <th className="text-left py-4 px-6 text-gray-400 font-medium">작업</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map(user => (
                      <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                              <Users className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <p className="font-medium text-white">{user.displayName || '이름 없음'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-gray-300">{user.email}</td>
                        <td className="py-4 px-6">
                          <select
                            value={user.role}
                            onChange={(e) => updateUserRole(user.id, e.target.value)}
                            className="bg-white/10 border border-white/20 rounded-lg px-3 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="user">사용자</option>
                            <option value="admin">관리자</option>
                          </select>
                        </td>
                        <td className="py-4 px-6 text-gray-300">
                          {new Date(user.createdAt?.toDate?.() || user.createdAt).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/10"
                            >
                              편집
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                            >
                              삭제
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="space-y-6">
            {/* 검색 */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="리뷰 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 리뷰 목록 */}
            <div className="space-y-4">
              {filteredReviews.map(review => (
                <div key={review.id} className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold text-white mb-1">{review.courseName}</h3>
                      <p className="text-sm text-gray-400">강사: {review.instructorName}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-1">
                        {Array.from({ length: 5 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating ? 'text-yellow-400' : 'text-gray-400'
                            }`}
                          >
                            ★
                          </div>
                        ))}
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReview(review.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        삭제
                      </Button>
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4">{review.content}</p>

                  {/* 첨부 이미지 표시 */}
                  {review.images && review.images.length > 0 && (
                    <AdminImageGallery
                      images={review.images}
                      imagePaths={review.imagePaths}
                      reviewId={review.id}
                      onImageDelete={deleteReviewImage}
                    />
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-white">{review.studentName}</span>
                    <span className="text-gray-400">
                      {new Date(review.createdAt?.toDate?.() || review.createdAt).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
            <h2 className="text-2xl font-bold text-white mb-6">시스템 설정</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">일반 설정</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">사용자 등록</h4>
                      <p className="text-gray-400 text-sm">새로운 사용자의 회원가입을 허용합니다</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <h4 className="font-medium text-white">이메일 알림</h4>
                      <p className="text-gray-400 text-sm">시스템 알림을 이메일로 발송합니다</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-white mb-3">데이터 관리</h3>
                <div className="flex gap-4">
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    데이터 내보내기
                  </Button>
                  <Button variant="ghost" className="text-white/80 hover:text-white hover:bg-white/10">
                    백업 설정
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}