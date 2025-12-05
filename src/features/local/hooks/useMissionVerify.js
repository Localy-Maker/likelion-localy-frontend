import { useState } from 'react';
import apiClient from './useAxios';

/**
 * 미션 인증 훅
 * 단일 책임: 미션 인증 API 호출
 * @returns {Object} { verifyMission, isLoading }
 */
export function useMissionVerify() {
  const [isLoading, setIsLoading] = useState(false);

  /**
   * 미션 인증 함수
   * @param {number} missionId - 미션 ID
   * @param {number} latitude - 위도
   * @param {number} longitude - 경도
   * @returns {Promise<Object>} { success, missionTitle, earnedPoints, totalPoints, message }
   */
  const verifyMission = async (missionId, latitude, longitude) => {
    try {
      setIsLoading(true);

      // POST 요청으로 미션 인증
      const response = await apiClient.post(`/missions/${missionId}/verify`, {
        latitude,
        longitude,
        verificationMethod: "location"
      });

      const result = response.data;

      if (result.success) {
        return {
          success: true,
          ...result.data
        };
      } else {
        throw new Error(result.message || '미션 인증에 실패했습니다.');
      }
    } catch (err) {
      // 실패 응답 처리
      if (err.response?.data) {
        return {
          success: false,
          message: err.response.data.message || '미션 인증에 실패했습니다.'
        };
      }
      
      console.error('미션 인증 실패:', err);
      return {
        success: false,
        message: err.message || '미션 인증에 실패했습니다.'
      };
    } finally {
      setIsLoading(false);
    }
  };

  return { verifyMission, isLoading };
}

