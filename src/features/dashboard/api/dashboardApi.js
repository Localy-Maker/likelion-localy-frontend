import apiClient from "@/shared/api/client";

/**
 * Daily 피드백 데이터 조회
 * GET /api/Localy/dailyFeedback/daily
 * 
 * @param {string} date - 날짜 (YYYY-MM-DD 형식, 선택사항, 기본값: 오늘)
 * @returns {Promise} { date, scores: [{ window, avgScore, emotion }], mostFrequentSection, mostFrequentEmotion }
 */
export const getDailyFeedback = async (date = null) => {
  const params = date ? { date } : {};
  const response = await apiClient.get("/api/Localy/dailyFeedback/daily", { params });
  
  // Response 구조: { success, message, data: { date, scores, mostFrequentSection, mostFrequentEmotion } }
  return response.data?.data || response.data;
};

/**
 * Week 피드백 데이터 조회
 * GET /api/Localy/dailyFeedback/week
 * 
 * @param {string} date - 날짜 (YYYY-MM-DD 형식, 선택사항, 기본값: 오늘 기준 주)
 * @returns {Promise} { weekRange: { start, end }, emotions: [{ day, score }] }
 */
export const getWeekFeedback = async (date = null) => {
  const params = date ? { date } : {};
  const response = await apiClient.get("/api/Localy/dailyFeedback/week", { params });
  
  // Response 구조: { success, message, data: { weekRange, emotions } }
  return response.data?.data || response.data;
};

/**
 * Month 피드백 데이터 조회
 * GET /api/Localy/dailyFeedback/month/{yearMonth}
 * 
 * @param {string} yearMonth - 년월 (YYYYMM 형식, 예: "202511")
 * @returns {Promise} { yearMonth, days: [{ day, emotion }], monthlyStats: { 1: count, 2: count, ... } }
 */
export const getMonthFeedback = async (yearMonth) => {
  const response = await apiClient.get(`/api/Localy/dailyFeedback/month/${yearMonth}`);
  
  // Response 구조: { success, message, data: { yearMonth, days, monthlyStats } }
  return response.data?.data || response.data;
};

