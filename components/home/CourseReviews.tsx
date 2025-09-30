'use client'

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus, ChevronLeft, ChevronRight, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import ReviewModal from './ReviewModal';
import { getDocuments } from '@/lib/firestore';
import { CourseReview } from '@/types';
import Image from 'next/image';

// 이미지 갤러리 컴포넌트
function ImageGallery({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  if (!images || images.length === 0) return null;

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <>
      {/* 썸네일 그리드 */}
      <div className="mt-4 grid grid-cols-3 gap-2">
        {images.slice(0, 3).map((image, index) => (
          <div
            key={index}
            className="relative aspect-square rounded-lg overflow-hidden cursor-pointer group"
            onClick={() => {
              setCurrentIndex(index);
              setIsOpen(true);
            }}
          >
            <Image
              src={image}
              alt={`리뷰 이미지 ${index + 1}`}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 33vw, (max-width: 1200px) 20vw, 15vw"
            />
            {index === 2 && images.length > 3 && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <span className="text-white font-semibold">
                  +{images.length - 3}
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

export default function CourseReviews() {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // 리뷰 목록 새로고침 함수
  const refreshReviews = async () => {
    try {
      const reviewsData = await getDocuments('reviews');
      // 최신순으로 정렬
      const sortedReviews = reviewsData.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt);
        const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt);
        return dateB.getTime() - dateA.getTime();
      });

      // CourseReview 타입에 맞게 변환
      const formattedReviews = sortedReviews.map((review: any) => ({
        id: review.id,
        courseTitle: review.courseName || '강의명 없음',
        reviewer: review.studentName || '익명',
        role: '수강생',
        content: review.content,
        rating: review.rating,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(review.studentName || '익명')}&background=6366f1&color=fff`,
        date: review.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        images: review.images || [],
        imagePaths: review.imagePaths || []
      }));

      setReviews(formattedReviews);
    } catch (error) {
      console.error('리뷰 로딩 실패:', error);
    }
  };

  useEffect(() => {
    refreshReviews().finally(() => setLoading(false));
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-4"></div>
              <div className="h-4 bg-gray-300 rounded w-96 mx-auto mb-12"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              강의 리뷰
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              실제 수강생들의 생생한 후기를 확인해보세요
            </p>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-5 h-5" />
              리뷰 작성하기
            </Button>
          </div>

          {reviews.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                아직 작성된 리뷰가 없습니다
              </h3>
              <p className="text-gray-300 mb-6">
                첫 번째 리뷰를 작성해주세요!
              </p>
              <Button
                onClick={() => setIsModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                리뷰 작성하기
              </Button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 shadow-sm hover:shadow-md hover:bg-white/15 transition-all duration-300 h-full flex flex-col"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">
                        {review.courseTitle}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {review.reviewer} • {review.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review.rating)}
                    </div>
                  </div>

                  <p className="text-gray-200 mb-4 line-clamp-3 flex-1">
                    {review.content}
                  </p>

                  {/* 첨부 이미지 표시 */}
                  {review.images && review.images.length > 0 && (
                    <ImageGallery images={review.images} />
                  )}

                  <div className="flex items-center justify-between text-sm mt-auto">
                    <div className="flex items-center gap-2">
                      <img
                        src={review.avatar}
                        alt={review.reviewer}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="font-medium text-white">
                        {review.reviewer}
                      </span>
                    </div>
                    <span className="text-gray-400">
                      {new Date(review.date).toLocaleDateString('ko-KR')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refreshReviews}
      />
    </>
  );
}