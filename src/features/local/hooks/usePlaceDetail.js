import { useState, useEffect } from 'react';
import apiClient from './useAxios';

// 목업 데이터 사용 여부 (개발 시 true로 설정)
const USE_MOCK_DATA = true;

// 목업 데이터
const MOCK_DATA = {
  placeId: 123,
  placeName: "파이키 카페",
  category: "카페",
  address: "서울시 강남구 테헤란로 123",
  latitude: 37.5665,
  longitude: 126.9780,
  phoneNumber: "0507-0000-0000",
  openingHours: "매일 10:00 - 19:00",
  images: [
    "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800",
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800"
  ],
  shortDescription: "아늑하고 감성적인 분위기의 카페",
  longDescription: "조용하고 편안한 분위기에서 커피와 디저트를 즐길 수 있는 공간입니다. 인테리어가 예쁘고 음료와 베이커리의 퀄리티가 훌륭합니다.",
  isBookmarked: false,
  bookmarkCount: 157
};

/**
 * 장소 상세 정보를 가져오는 커스텀 훅
 * 단일 책임: API 데이터 fetching 및 상태 관리
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

        // 목업 데이터 사용
        if (USE_MOCK_DATA) {
          // 실제 API 호출처럼 딜레이 추가
          await new Promise(resolve => setTimeout(resolve, 500));
          
          setData(MOCK_DATA);
        } else {
          // 실제 API 호출
          const response = await apiClient.get(`/places/${placeId}`);
          const result = response.data;

          if (result.success) {
            setData(result.data);
          } else {
            throw new Error(result.message || '장소 정보 조회에 실패했습니다.');
          }
        }
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

