import { useState, useEffect } from 'react';
import { getPlaceDetail } from '@/features/local/api/localApi';

/**
 * 장소 상세 정보를 가져오는 커스텀 훅
 * @param {number|string} placeId - 장소 ID
 * @returns {Object} { data, loading, error }
 */
export function usePlaceDetail(placeId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!placeId) {
      setLoading(false);
      return;
    }

    const fetchPlaceDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getPlaceDetail(placeId);
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('장소 상세 정보 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaceDetail();
  }, [placeId]);

  return { data, loading, error };
}
