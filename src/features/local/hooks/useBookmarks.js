import { useState, useEffect, useCallback } from 'react';
import apiClient from './useAxios';

// 목업 데이터 사용 여부 (개발 시 true로 설정)
const USE_MOCK_DATA = true;

// 목업 데이터
const MOCK_BOOKMARKS = [
  {
    bookmarkId: 501,
    placeId: 123,
    placeName: "파이키 카페",
    category: "카페",
    address: "서울특별시 강남구 테헤란로",
    thumbnailImage: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400",
    bookmarkedAt: "2025-11-25T14:30:00",
    bookmarkCount: 158,
    bookmarkedEmotion: "외로움"
  },
  {
    bookmarkId: 500,
    placeId: 456,
    placeName: "북촌 한옥마을",
    category: "문화",
    address: "서울특별시 종로구 계동길 37",
    thumbnailImage: "https://images.unsplash.com/photo-1545921664-0a4781f0ba4a?w=400",
    bookmarkedAt: "2025-11-24T10:15:00",
    bookmarkCount: 892,
    bookmarkedEmotion: "그리움"
  },
  {
    bookmarkId: 499,
    placeId: 789,
    placeName: "경복궁",
    category: "관광지",
    address: "서울특별시 종로구 사직로 161",
    thumbnailImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400",
    bookmarkedAt: "2025-11-23T16:45:00",
    bookmarkCount: 1245,
    bookmarkedEmotion: "행복"
  },
];

/**
 * 북마크 목록을 가져오는 커스텀 훅
 * 단일 책임: 북마크 API 호출 및 무한 스크롤 관리
 * @param {string} sortType - 정렬 기준 ("latest" | "popular")
 * @param {number} size - 한 번에 가져올 개수
 * @returns {Object} { bookmarks, loading, error, hasNext, fetchMore, refresh }
 */
export function useBookmarks(sortType = 'latest', size = 20) {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [error, setError] = useState(null);
  const [hasNext, setHasNext] = useState(false);
  const [lastBookmarkId, setLastBookmarkId] = useState(null);

  // 초기 데이터 로드
  const fetchBookmarks = useCallback(async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setBookmarks([]);
        setLastBookmarkId(null);
      } else {
        setFetchingMore(true);
      }
      
      setError(null);

      // 목업 데이터 사용
      if (USE_MOCK_DATA) {
        await new Promise(resolve => setTimeout(resolve, 100)); // 딜레이 최소화
        
        // 정렬 적용
        const sortedMockData = [...MOCK_BOOKMARKS].sort((a, b) => {
          if (sortType === 'popular') {
            return b.bookmarkCount - a.bookmarkCount;
          }
          return new Date(b.bookmarkedAt) - new Date(a.bookmarkedAt);
        });

        if (reset) {
          setBookmarks(sortedMockData);
          setLastBookmarkId(sortedMockData[sortedMockData.length - 1]?.bookmarkId);
          setHasNext(false); // 목업 데이터는 한 페이지만
        }
      } else {
        // 실제 API 호출
        const params = {
          sortType,
          size,
        };

        if (!reset && lastBookmarkId) {
          params.lastBookmarkId = lastBookmarkId;
        }

        const response = await apiClient.get('/bookmarks', { params });
        const result = response.data;

        if (result.success) {
          const newBookmarks = result.data.bookmarks;
          
          if (reset) {
            setBookmarks(newBookmarks);
          } else {
            setBookmarks(prev => [...prev, ...newBookmarks]);
          }
          
          setHasNext(result.data.hasNext);
          setLastBookmarkId(result.data.lastBookmarkId);
        } else {
          throw new Error(result.message || '북마크 조회에 실패했습니다.');
        }
      }
    } catch (err) {
      setError(err.message);
      console.error('북마크 조회 실패:', err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [sortType, size, lastBookmarkId]);

  // 초기 로드
  useEffect(() => {
    fetchBookmarks(true);
  }, [sortType]); // sortType 변경 시 새로 로드

  // 더 가져오기
  const fetchMore = useCallback(() => {
    if (!fetchingMore && !loading && hasNext) {
      fetchBookmarks(false);
    }
  }, [fetchingMore, loading, hasNext, fetchBookmarks]);

  // 새로고침
  const refresh = useCallback(() => {
    fetchBookmarks(true);
  }, [fetchBookmarks]);

  return {
    bookmarks,
    loading,
    fetchingMore,
    error,
    hasNext,
    fetchMore,
    refresh,
  };
}

