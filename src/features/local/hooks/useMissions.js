import { useState, useEffect } from 'react';
import apiClient from './useAxios';

// 목업 데이터 사용 여부 (개발 시 true로 설정)
const USE_MOCK_DATA = true;

// 목업 데이터
const MOCK_DATA = {
    pointInfo: {
        totalPoints: 1500,
        availablePoints: 1500,
        assignedMissions: 5
    },
    availableMissions: [
        {
            missionId: 123,
            missionTitle: "새로운 영감을 위한 탐험",
            expiresAt: [2025, 12, 2, 10, 0, 0],
            points: 100,
            isCompleted: false,
            isNew: true,
            emotion: "슬픔"
        },
        {
            missionId: 124,
            missionTitle: "파이키에서 라떼 마시기",
            expiresAt: [2025, 12, 26, 23, 59, 59],
            points: 10,
            isCompleted: false,
            isNew: true,
            emotion: "외로움"
        },
        {
            missionId: 125,
            missionTitle: "동네 카페 탐방하기",
            expiresAt: [2025, 12, 30, 23, 59, 59],
            points: 15,
            isCompleted: false,
            isNew: false,
            emotion: "행복"
        }
    ],
    completedMissions: [
        {
            missionId: 101,
            missionTitle: "동네 맛집 리뷰 작성하기",
            expiresAt: [2025, 11, 25, 23, 59, 59],
            points: 20,
            isCompleted: true,
            isNew: false,
            emotion: "우울"
        }
    ]
};

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
 * 단일 책임: 미션 API 호출 및 상태 관리
 * @returns {Object} { pointInfo, availableMissions, completedMissions, loading, error, refresh }
 */
export function useMissions() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMissions = async () => {
        try {
            setLoading(true);
            setError(null);

            // 목업 데이터 사용
            if (USE_MOCK_DATA) {
                // 딜레이 최소화
                await new Promise(resolve => setTimeout(resolve, 100));

                setData(MOCK_DATA);
            } else {
                // 실제 API 호출
                const response = await apiClient.get('/missions');
                const result = response.data;

                if (result.success) {
                    setData(result.data);
                } else {
                    throw new Error(result.message || '미션 조회에 실패했습니다.');
                }
            }
        } catch (err) {
            setError(err.message);
            console.error('미션 조회 실패:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMissions();
    }, []);

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

