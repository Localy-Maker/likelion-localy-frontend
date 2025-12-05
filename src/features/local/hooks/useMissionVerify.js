import { useState } from 'react';
import { verifyMission as verifyMissionApi } from '@/features/local/api/localApi';

/**
 * 미션 인증 훅
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
      const result = await verifyMissionApi(missionId, latitude, longitude);
      return result;
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
