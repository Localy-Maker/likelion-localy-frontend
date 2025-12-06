import { useState, useEffect } from 'react';
import { getHomeData } from '@/features/local/api/localApi';

/**
 * 홈 장소 데이터를 가져오는 커스텀 훅
 * @param {number} latitude - 위도
 * @param {number} longitude - 경도
 * @returns {Object} { data, loading, error }
 */
export function useHomeData(latitude, longitude) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!latitude || !longitude) {
            setLoading(false);
            return;
        }

        const fetchHomeData = async () => {
            try {
                setLoading(true);
                setError(null);
                const result = await getHomeData(latitude, longitude);
                setData(result);
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
