'use client'

import { useState } from 'react';
import { X, Star, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import { createDocument } from '@/lib/firestore';
import { uploadReviewImage, createPreviewUrl, revokePreviewUrl, resizeImage } from '@/lib/storage';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface ImagePreview {
  file: File;
  previewUrl: string;
  id: string;
}

export default function ReviewModal({ isOpen, onClose, onSuccess }: ReviewModalProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    courseName: '',
    instructorName: '',
    studentName: '',
    rating: 0,
    content: ''
  });
  const [hoveredRating, setHoveredRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFiles, setImageFiles] = useState<ImagePreview[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);

  // 이미지 파일 선택 핸들러
  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // 최대 5개 이미지 제한
    if (imageFiles.length + files.length > 5) {
      alert('이미지는 최대 5개까지 업로드할 수 있습니다.');
      return;
    }

    const newImages: ImagePreview[] = [];

    for (const file of files) {
      try {
        // 이미지 크기 조정
        const resizedFile = await resizeImage(file, 1200, 800, 0.8);

        const preview: ImagePreview = {
          file: resizedFile,
          previewUrl: createPreviewUrl(resizedFile),
          id: Math.random().toString(36).substring(2, 15)
        };

        newImages.push(preview);
      } catch (error) {
        console.error('이미지 처리 실패:', error);
        alert(`${file.name} 처리에 실패했습니다.`);
      }
    }

    setImageFiles(prev => [...prev, ...newImages]);

    // input 값 초기화
    e.target.value = '';
  };

  // 이미지 삭제 핸들러
  const handleImageRemove = (imageId: string) => {
    setImageFiles(prev => {
      const imageToRemove = prev.find(img => img.id === imageId);
      if (imageToRemove) {
        revokePreviewUrl(imageToRemove.previewUrl);
      }
      return prev.filter(img => img.id !== imageId);
    });
  };

  // 모달 닫기 시 미리보기 URL 해제
  const handleClose = () => {
    imageFiles.forEach(img => revokePreviewUrl(img.previewUrl));
    setImageFiles([]);
    setFormData({
      courseName: '',
      instructorName: '',
      studentName: '',
      rating: 0,
      content: ''
    });
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.courseName || !formData.instructorName || !formData.studentName || !formData.content || formData.rating === 0) {
      alert('모든 필드를 입력해주세요.');
      return;
    }

    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);
    setUploadingImages(true);

    try {
      let imageUrls: string[] = [];
      let imagePaths: string[] = [];

      // 이미지가 있는 경우 업로드
      if (imageFiles.length > 0) {
        const uploadPromises = imageFiles.map(async (imageFile) => {
          const result = await uploadReviewImage(imageFile.file, user.uid);
          if (result.success && result.url && result.path) {
            return { url: result.url, path: result.path };
          } else {
            throw new Error(result.error || '이미지 업로드 실패');
          }
        });

        const uploadResults = await Promise.all(uploadPromises);
        imageUrls = uploadResults.map(result => result.url);
        imagePaths = uploadResults.map(result => result.path);
      }

      setUploadingImages(false);

      // 리뷰 문서 생성
      const reviewData = {
        ...formData,
        userId: user.uid,
        userEmail: user.email,
        images: imageUrls,
        imagePaths: imagePaths,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      await createDocument('reviews', reviewData);

      // 미리보기 URL 해제
      imageFiles.forEach(img => revokePreviewUrl(img.previewUrl));

      // 폼 초기화
      setFormData({
        courseName: '',
        instructorName: '',
        studentName: '',
        rating: 0,
        content: ''
      });
      setImageFiles([]);

      alert('리뷰가 성공적으로 등록되었습니다!');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('리뷰 등록 실패:', error);
      alert('리뷰 등록에 실패했습니다. 다시 시도해주세요.');
      setUploadingImages(false);
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
            onClick={handleClose}
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

          {/* 이미지 업로드 섹션 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              첨부 이미지 (선택사항)
            </label>
            <div className="space-y-4">
              {/* 파일 선택 버튼 */}
              <div className="flex items-center gap-4">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Upload className="w-5 h-5" />
                  <span>이미지 선택</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    disabled={isSubmitting || uploadingImages}
                  />
                </label>
                <div className="text-sm text-gray-500">
                  JPG, PNG, WebP, GIF (최대 5개, 각 10MB 이하)
                </div>
              </div>

              {/* 이미지 미리보기 */}
              {imageFiles.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {imageFiles.map((image) => (
                    <div key={image.id} className="relative group">
                      <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                        <img
                          src={image.previewUrl}
                          alt="미리보기"
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => handleImageRemove(image.id)}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-600 transition-all duration-200"
                          disabled={isSubmitting || uploadingImages}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="mt-1 text-xs text-gray-500 truncate">
                        {image.file.name}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* 업로드 진행 상태 */}
              {uploadingImages && (
                <div className="flex items-center gap-2 text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <span className="text-sm">이미지 업로드 중...</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-800 hover:bg-gray-300"
            >
              취소
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || uploadingImages}
              className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? '등록 중...' : uploadingImages ? '이미지 업로드 중...' : '리뷰 등록'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}