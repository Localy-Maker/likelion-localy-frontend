import apiClient from "@/shared/api/client";

/**
 * 15. 챗봇 대화 내역 가져오기 - 오늘
 * GET /api/chatbot/today
 */
export const getTodayChatHistory = async () => {
  const response = await apiClient.get("/api/chatbot/today");
  return response.data;
};










