import { useState, useEffect } from 'react';
import apiClient from './useAxios';

// 목업 데이터 사용 여부
const USE_MOCK_DATA = true;

// 목업 데이터
const MOCK_DATA = {
  missionId: 10,
  missionTitle: "과학영재교육 페스티벌에서 과학 실험 참여",
  missionDescription: "슬픔을 해소하고 즐거움을 느낄 수 있는 과학 실험 참여를 통해 자연의 신비를 경험하고 흥미를 느껴보세요. 다양한 실험부스에서 직접 참여하면서 새로운 지식을 습득하고 즐거운 시간을 보낼 수 있습니다.",
  expiresAt: [2025, 12, 2, 2, 47, 45, 967841000],
  points: 10,
  placeInfo: {
    placeId: 259,
    placeName: "2025 과학영재교육 페스티벌",
    category: "축제",
    address: "서울특별시 강남구 테헤란로7길 22 (역삼동)",
    latitude: 37.5007739351,
    longitude: 127.0307542337,
    openingHours: null,
    shortDescription: "새로운 경험을 시작해보세요",
    images: [
      "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
      "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"
    ],
    kakaoMapUrl: "https://map.kakao.com/link/map/2025 과학영재교육 페스티벌,37.5007739351,127.0307542337"
  },
  canVerify: false,
  distance: 0.4
};

/**
 * 미션 상세 정보를 가져오는 커스텀 훅
 * 단일 책임: 미션 상세 API 호출
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

        // 목업 데이터 사용
        if (USE_MOCK_DATA) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setData(MOCK_DATA);
        } else {
          // 실제 API 호출
          const params = {};
          if (latitude) params.latitude = latitude;
          if (longitude) params.longitude = longitude;

          const response = await apiClient.get(`/missions/${missionId}`, { params });
          const result = response.data;

          if (result.success) {
            setData(result.data);
          } else {
            throw new Error(result.message || '미션 조회에 실패했습니다.');
          }
        }
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

