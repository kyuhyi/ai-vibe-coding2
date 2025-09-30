import { storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';

/**
 * 이미지 파일을 Firebase Storage에 업로드
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} path - 저장 경로 (예: 'reviews/userId/filename')
 * @returns {Promise<{success: boolean, url?: string, error?: string}>}
 */
export const uploadImage = async (file, path) => {
  try {
    // 파일 유효성 검사
    if (!file) {
      return { success: false, error: '파일이 선택되지 않았습니다.' };
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return { success: false, error: '파일 크기가 10MB를 초과합니다.' };
    }

    // 이미지 파일 형식 검사
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return { success: false, error: '지원하지 않는 파일 형식입니다. (JPG, PNG, WebP, GIF만 가능)' };
    }

    // Storage reference 생성
    const storageRef = ref(storage, path);

    // 파일 업로드
    const snapshot = await uploadBytes(storageRef, file);

    // 다운로드 URL 가져오기
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      success: true,
      url: downloadURL,
      path: path
    };

  } catch (error) {
    console.error('이미지 업로드 중 오류:', error);
    return {
      success: false,
      error: '이미지 업로드 중 오류가 발생했습니다.'
    };
  }
};

/**
 * 리뷰 이미지 업로드 (특별히 리뷰용으로 경로 자동 생성)
 * @param {File} file - 업로드할 이미지 파일
 * @param {string} userId - 사용자 ID
 * @param {string} reviewId - 리뷰 ID (선택사항)
 * @returns {Promise<{success: boolean, url?: string, path?: string, error?: string}>}
 */
export const uploadReviewImage = async (file, userId, reviewId = null) => {
  try {
    // 파일 확장자 추출
    const fileExtension = file.name.split('.').pop().toLowerCase();

    // 고유한 파일명 생성
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomString}.${fileExtension}`;

    // 저장 경로 생성
    const path = reviewId
      ? `reviews/${userId}/${reviewId}/${fileName}`
      : `reviews/${userId}/${fileName}`;

    return await uploadImage(file, path);

  } catch (error) {
    console.error('리뷰 이미지 업로드 중 오류:', error);
    return {
      success: false,
      error: '리뷰 이미지 업로드 중 오류가 발생했습니다.'
    };
  }
};

/**
 * Storage에서 파일 삭제
 * @param {string} path - 삭제할 파일의 Storage 경로
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export const deleteImage = async (path) => {
  try {
    const storageRef = ref(storage, path);
    await deleteObject(storageRef);

    return { success: true };

  } catch (error) {
    console.error('이미지 삭제 중 오류:', error);
    return {
      success: false,
      error: '이미지 삭제 중 오류가 발생했습니다.'
    };
  }
};

/**
 * URL에서 Storage 경로 추출
 * @param {string} url - Firebase Storage 다운로드 URL
 * @returns {string|null} - Storage 경로 또는 null
 */
export const getPathFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    const pathMatch = urlObj.pathname.match(/\/o\/(.+)\?/);
    if (pathMatch && pathMatch[1]) {
      return decodeURIComponent(pathMatch[1]);
    }
    return null;
  } catch (error) {
    console.error('URL에서 경로 추출 중 오류:', error);
    return null;
  }
};

/**
 * 이미지 파일 미리보기 URL 생성
 * @param {File} file - 이미지 파일
 * @returns {string} - 미리보기 URL
 */
export const createPreviewUrl = (file) => {
  return URL.createObjectURL(file);
};

/**
 * 미리보기 URL 메모리 해제
 * @param {string} url - 해제할 미리보기 URL
 */
export const revokePreviewUrl = (url) => {
  URL.revokeObjectURL(url);
};

/**
 * 이미지 크기 조정 (Canvas 사용)
 * @param {File} file - 원본 이미지 파일
 * @param {number} maxWidth - 최대 너비
 * @param {number} maxHeight - 최대 높이
 * @param {number} quality - 압축 품질 (0.1 ~ 1.0)
 * @returns {Promise<File>} - 리사이즈된 이미지 파일
 */
export const resizeImage = async (file, maxWidth = 1200, maxHeight = 800, quality = 0.8) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // 비율 계산
      let { width, height } = img;

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      // 캔버스 크기 설정
      canvas.width = width;
      canvas.height = height;

      // 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // Blob으로 변환
      canvas.toBlob(
        (blob) => {
          const resizedFile = new File([blob], file.name, {
            type: file.type,
            lastModified: Date.now()
          });
          resolve(resizedFile);
        },
        file.type,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('이미지 로드 실패'));
    };

    img.src = URL.createObjectURL(file);
  });
};