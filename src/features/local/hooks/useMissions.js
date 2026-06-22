import { useState, useEffect } from 'react';
import { getMissions } from '@/features/local/api/localApi';

/**
 * 날짜 배열을 문자열로 변환하는 함수
 * @param {Array} dateArray - [year, month, day, hour, minute, second]
 * @returns {string} "YYYY.MM.DD까지" 형식
 */
export function formatExpiresAt(dateArray) {
  if (!dateArray || dateArray.length < 3) return "";
  const [year, month, day] = dateArray;
  return `${year}.${String(month).padStart(2, '0')}.${String(day).padStart(2, '0')}까지`;
}

/**
 * 미션 데이터를 가져오는 커스텀 훅
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Object} { pointInfo, availableMissions, completedMissions, loading, error, refresh }
 */
export function useMissions(latitude, longitude) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMissions = async () => {
    // 위치 정보가 없으면 요청하지 않음
    if (latitude === null || longitude === null) {
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const result = await getMissions(latitude, longitude);
      setData(result);
    } catch (err) {
      setError(err.message);
      console.error('미션 조회 실패:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, [latitude, longitude]);

  const refresh = () => {
    fetchMissions();
  };

  return {
    pointInfo: data?.pointInfo || null,
    availableMissions: data?.availableMissions || [],
    completedMissions: data?.completedMissions || [],
    loading,
    error,
    refresh,
  };
}
