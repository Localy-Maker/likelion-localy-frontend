import apiClient from "@/shared/api/client";

/**
 * 최근 북마크 목록 조회
 * JWT 토큰은 apiClient의 인터셉터에서 자동으로 헤더에 추가됨
 * @returns {Promise} 북마크 데이터
 */
export const getRecentBookmarks = async () => {
  const response = await apiClient.get("/api/home/recentBookmarks");
  return response.data;
};

/**
 * 주간 감정 트렌드 요약 조회
 * JWT 토큰은 apiClient의 인터셉터에서 자동으로 헤더에 추가됨
 * @returns {Promise} 감정 트렌드 데이터
 */
export const getWeekEmotionSummary = async () => {
  const response = await apiClient.get("/api/Localy/home/weekEmotionSummary/");
  return response.data;
};
