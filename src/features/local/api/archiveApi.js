import apiClient from "@/shared/api/client";

/**
 * 월간 미션 아카이브 조회 — 캘린더 히트맵 데이터 소스.
 * GET /api/missions/archive/monthly?year=YYYY&month=M
 * @param {number} year
 * @param {number} month - 1..12
 * @returns {Promise<{userId, year, month, archives: {date, thumbnailImageUrl, hasPhoto}[]}>}
 */
export async function getMonthlyArchive(year, month) {
  const response = await apiClient.get("/api/missions/archive/monthly", {
    params: { year, month },
  });
  const result = response.data;
  if (result?.success) return result.data;
  throw new Error(result?.message || "월간 미션 조회에 실패했습니다.");
}

/**
 * 특정 날짜의 미션 아카이브 상세 조회.
 * GET /api/missions/archive/detail?date=YYYY-MM-DD
 * @param {string} date - YYYY-MM-DD
 * @returns {Promise<{date, completedMissionCount, photos: string[]}>}
 */
export async function getArchiveDetail(date) {
  const response = await apiClient.get("/api/missions/archive/detail", {
    params: { date },
  });
  const result = response.data;
  if (result?.success) return result.data;
  throw new Error(result?.message || "날짜별 미션 상세 조회에 실패했습니다.");
}
