'use client'

import { useState } from 'react';
import { X, Star } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createDocument } from '@/lib/firestore';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReviewModal({ isOpen, onClose }: ReviewModalProps) {
  const [formData, setFormData] = useState({
    courseName: '',
    instructorName: '',
    studentName: '',
    rating: 0,
    content: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseName || !formData.instructorName || !formData.studentName || !formData.content || formData.rating === 0) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      await createDocument('reviews', {
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      });

      // 폼 초기화
      setFormData({
        courseName: '',
        instructorName: '',
        studentName: '',
        rating: 0,
        content: ''
      });

      alert('리뷰가 성공적으로 등록되었습니다!');
      onClose();
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const starValue = i + 1;
      const isActive = starValue <= (hoveredRating || formData.rating);

      return (
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(starValue)}
          onMouseEnter={() => setHoveredRating(starValue)}
          onMouseLeave={() => setHoveredRating(0)}
          className="focus:outline-none transition-colors"
        >
          <Star
            className={`w-8 h-8 ${
              isActive ? 'text-yellow-400 fill-current' : 'text-gray-300'
            } hover:text-yellow-400`}
          />
        </button>
      );
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">리뷰 작성</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
                강의명 *
              </label>
              <input
                id="courseName"
                type="text"
                value={formData.courseName}
                onChange={(e) => setFormData(prev => ({ ...prev, courseName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="수강한 강의명을 입력하세요"
                required
              />
            </div>

            <div>
              <label htmlFor="instructorName" className="block text-sm font-medium text-gray-700 mb-2">
                강사명 *
              </label>
              <input
                id="instructorName"
                type="text"
                value={formData.instructorName}
                onChange={(e) => setFormData(prev => ({ ...prev, instructorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="강사명을 입력하세요"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="studentName" className="block text-sm font-medium text-gray-700 mb-2">
              작성자명 *
            </label>
            <input
              id="studentName"
              type="text"
              value={formData.studentName}
              onChange={(e) => setFormData(prev => ({ ...prev, studentName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="이름을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              평점 *
            </label>
            <div className="flex items-center gap-1">
              {renderStars()}
              <span className="ml-3 text-sm text-gray-600">
                {formData.rating > 0 ? `${formData.rating}점` : '평점을 선택하세요'}
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              리뷰 내용 *
            </label>
            <textarea
              id="content"
              rows={6}
              value={formData.content}
              onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="강의에 대한 솔직한 후기를 작성해주세요. 강의 내용, 강사의 설명, 실습 환경 등에 대해 자세히 써주시면 다른 수강생들에게 큰 도움이 됩니다."
              required
            />
            <div className="text-right text-sm text-gray-500 mt-1">
              {formData.content.length}/500자
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : '리뷰 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}