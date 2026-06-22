import apiClient from "@/shared/api/client";

/**
 * 오늘 채팅 메시지 조회
 * GET /api/chat/chatMessages/today
 */
export const getTodayChatMessages = async () => {
  const response = await apiClient.get("/api/chat/chatMessages/today");
  return response.data;
};

/**
 * 과거 채팅 날짜 목록 조회
 * GET /api/chat/chatMessages/dateList
 * @returns {Promise<{success: boolean, data: string[]}>} YYYY-MM-DD 문자열 배열
 */
export const getChatDateList = async () => {
  const response = await apiClient.get("/api/chat/chatMessages/dateList");
  return response.data;
};

/**
 * 특정 날짜의 과거 채팅 메시지 조회
 * GET /api/chat/chatMessages/past/{date}
 * @param {string} date - YYYY-MM-DD
 */
export const getPastChatMessagesByDate = async (date) => {
  const response = await apiClient.get(
    `/api/chat/chatMessages/past/${encodeURIComponent(date)}`,
  );
  return response.data;
};

/**
 * 모든 과거 채팅을 한 번에 가져오는 호환 래퍼.
 * dateList로 날짜를 먼저 받고, 각 날짜별 메시지를 병렬로 가져와 평탄화한다.
 * 백엔드가 path-var 시그니처로 바뀌면서 추가됐다.
 */
export const getPastChatMessages = async () => {
  const dateRes = await getChatDateList();
  if (!dateRes?.success || !Array.isArray(dateRes.data)) {
    return { success: false, data: [] };
  }
  const perDate = await Promise.all(
    dateRes.data.map((date) =>
      getPastChatMessagesByDate(date).catch((err) => {
        console.error(`Failed to fetch chat for ${date}:`, err);
        return { success: false, data: [] };
      }),
    ),
  );
  const messages = perDate
    .filter((r) => r?.success && Array.isArray(r.data))
    .flatMap((r) => r.data);
  return { success: true, data: messages };
};
