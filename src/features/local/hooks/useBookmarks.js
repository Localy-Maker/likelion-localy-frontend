import { useState, useEffect, useCallback } from 'react';
import { getBookmarks } from '@/features/local/api/localApi';

/**
 * 북마크 목록을 가져오는 커스텀 훅
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

      const params = { sortType, size };
      if (!reset && lastBookmarkId) {
        params.lastBookmarkId = lastBookmarkId;
      }

      const data = await getBookmarks(params);
      const newBookmarks = data.bookmarks;

      if (reset) {
        setBookmarks(newBookmarks);
      } else {
        setBookmarks(prev => [...prev, ...newBookmarks]);
      }

      setHasNext(data.hasNext);
      setLastBookmarkId(data.lastBookmarkId);
    } catch (err) {
      setError(err.message);
      console.error('북마크 조회 실패:', err);
    } finally {
      setLoading(false);
      setFetchingMore(false);
    }
  }, [sortType, size, lastBookmarkId]);

  useEffect(() => {
    fetchBookmarks(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortType]);

  const fetchMore = useCallback(() => {
    if (!fetchingMore && !loading && hasNext) {
      fetchBookmarks(false);
    }
  }, [fetchingMore, loading, hasNext, fetchBookmarks]);

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
