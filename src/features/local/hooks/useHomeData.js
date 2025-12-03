import { useState, useEffect } from 'react';
import apiClient from './useAxios';
import { mockHomeData } from './mockData';

// 목업 데이터 사용 여부 (개발 시 true로 설정)
const USE_MOCK_DATA = true;

/**
 * 홈 장소 데이터를 가져오는 커스텀 훅
 * 단일 책임: API 데이터 fetching 및 상태 관리
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Object} { data, loading, error }
 */
export function useHomeData(latitude, longitude) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 위도, 경도가 없으면 호출하지 않음
        if (!latitude || !longitude) {
            setLoading(false);
            return;
        }

        const fetchHomeData = async () => {
            try {
                setLoading(true);
                setError(null);

                // 목업 데이터 사용
                if (USE_MOCK_DATA) {
                    // 딜레이 최소화
                    await new Promise(resolve => setTimeout(resolve, 100));

                    if (mockHomeData.success) {
                        setData(mockHomeData.data);
                    } else {
                        throw new Error('목업 데이터 조회에 실패했습니다.');
                    }
                } else {
                    // 실제 API 호출
                    const response = await apiClient.get('/places/home', {
                        params: {
                            latitude,
                            longitude,
                        },
                    });

                    const result = response.data;

                    if (result.success) {
                        setData(result.data);
                    } else {
                        throw new Error(result.message || '데이터 조회에 실패했습니다.');
                    }
                }
            } catch (err) {
                setError(err.message);
                console.error('홈 데이터 조회 실패:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchHomeData();
    }, [latitude, longitude]);

    return { data, loading, error };
}

