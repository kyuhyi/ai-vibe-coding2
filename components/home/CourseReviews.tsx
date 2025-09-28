'use client'

import { useState, useEffect } from 'react';
import { Star, MessageSquare, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';
import ReviewModal from './ReviewModal';
import { courseReviews } from '@/lib/data';
import { CourseReview } from '@/types';

export default function CourseReviews() {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 샘플 데이터 로드
    setReviews(courseReviews);
    setLoading(false);
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
      />
    </>
  );
}