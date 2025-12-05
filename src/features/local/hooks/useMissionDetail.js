import { useState, useEffect } from 'react';
import { getMissionDetail } from '@/features/local/api/localApi';

/**
 * 미션 상세 정보를 가져오는 커스텀 훅
 * @param {number} missionId - 미션 ID
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Object} { data, loading, error }
 */
export function useMissionDetail(missionId, latitude, longitude) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!missionId) {
      setLoading(false);
      return;
    }

    const fetchMissionDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await getMissionDetail(missionId, latitude, longitude);
        setData(result);
      } catch (err) {
        setError(err.message);
        console.error('미션 상세 조회 실패:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionDetail();
  }, [missionId, latitude, longitude]);

  return { data, loading, error };
}
