import { useState, useEffect } from 'react';
import { mockLocation } from './mockData';

// 목업 데이터 사용 여부 (개발 시 true로 설정)
const USE_MOCK_DATA = true;

/**
 * 브라우저의 위치 정보를 가져오는 커스텀 훅
 * 단일 책임: 위치 정보 가져오기
 * @returns {Object} { latitude, longitude, loading, error }
 */
export function useGeolocation() {
    const [location, setLocation] = useState({
        latitude: null,
        longitude: null,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 목업 데이터 사용
        if (USE_MOCK_DATA) {
            // 딜레이 최소화
            setTimeout(() => {
                setLocation(mockLocation);
                setLoading(false);
            }, 50);
            return;
        }

        // Geolocation API 지원 확인
        if (!navigator.geolocation) {
            setError('브라우저가 위치 정보를 지원하지 않습니다.');
            setLoading(false);
            return;
        }

        const handleSuccess = (position) => {
            setLocation({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
            });
            setLoading(false);
        };

        const handleError = (err) => {
            let errorMessage = '위치 정보를 가져올 수 없습니다.';

            switch (err.code) {
                case err.PERMISSION_DENIED:
                    errorMessage = '위치 권한이 거부되었습니다.';
                    break;
                case err.POSITION_UNAVAILABLE:
                    errorMessage = '위치 정보를 사용할 수 없습니다.';
                    break;
                case err.TIMEOUT:
                    errorMessage = '위치 정보 요청 시간이 초과되었습니다.';
                    break;
                default:
                    errorMessage = '알 수 없는 오류가 발생했습니다.';
            }

            setError(errorMessage);
            setLoading(false);
        };

        // 위치 정보 가져오기
        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
        });
    }, []);

    return { ...location, loading, error };
}

