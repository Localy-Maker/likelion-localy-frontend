import { useState } from 'react';
import apiClient from './useAxios';

/**
 * 북마크 토글 훅
 * 단일 책임: 북마크 추가/해제 API 호출
 * @returns {Object} { toggleBookmark, isLoading }
 */
export function useBookmarkToggle() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 북마크 토글 함수
   * @param {number} placeId - 장소 ID
   * @param {boolean} currentBookmarkState - 현재 북마크 상태
   * @returns {Promise<Object>} { isBookmarked, bookmarkCount }
   */
  const toggleBookmark = async (placeId, currentBookmarkState) => {
    try {
      setIsLoading(true);

      // POST 요청으로 북마크 추가/해제
      const response = await apiClient.post(`/places/${placeId}/bookmarks`);
      const result = response.data;

      if (result.success) {
        return result.data; // { isBookmarked, bookmarkCount }
      } else {
        throw new Error(result.message || '북마크 처리에 실패했습니다.');
      }
    } catch (err) {
      // 409 에러는 이미 북마크된 상태 (무시 가능)
      if (err.response?.status === 409) {
        console.warn('이미 북마크한 장소입니다.');
        return {
          isBookmarked: !currentBookmarkState,
          bookmarkCount: null,
        };
      }
      
      console.error('북마크 토글 실패:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleBookmark, isLoading };
}

