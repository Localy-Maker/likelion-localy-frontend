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
 * @returns {Promise<{date, completedMissionCount, photos: {archiveId, imageUrl, isThumbnail}[]}>}
 */
export async function getArchiveDetail(date) {
  const response = await apiClient.get("/api/missions/archive/detail", {
    params: { date },
  });
  const result = response.data;
  if (result?.success) return result.data;
  throw new Error(result?.message || "날짜별 미션 상세 조회에 실패했습니다.");
}

/**
 * 미션 사진 업로드 (특정 미션과 무관하게 날짜에 사진을 묶음).
 * POST /api/missions/archive/upload
 * 백엔드는 imageUrl 만 받음 — 파일을 직접 받지 않으므로
 * 별도 스토리지에 업로드된 URL을 그대로 넘긴다.
 * @param {{imageUrl: string, targetDate: string, photoStoredDate: string}} payload
 */
export async function uploadArchivePhoto(payload) {
  const response = await apiClient.post("/api/missions/archive/upload", payload);
  const result = response.data;
  if (result?.success) return result.data ?? null;
  throw new Error(result?.message || "사진 업로드에 실패했습니다.");
}

/**
 * 미션 캘린더 아카이빙 저장 — 특정 미션 수행 결과를 캘린더에 묶을 때 사용.
 * POST /api/missions/{missionId}/archive?imageUrl=&targetDate=&photoStoredDate=
 */
export async function saveMissionArchive(missionId, { imageUrl, targetDate, photoStoredDate }) {
  const response = await apiClient.post(`/api/missions/${missionId}/archive`, null, {
    params: { imageUrl, targetDate, photoStoredDate },
  });
  const result = response.data;
  if (result?.success) return result.data;
  throw new Error(result?.message || "미션 아카이빙에 실패했습니다.");
}

/**
 * 썸네일 사진 지정.
 * PATCH /api/missions/archive/{archiveId}/thumbnail
 */
export async function setArchiveThumbnail(archiveId) {
  const response = await apiClient.patch(
    `/api/missions/archive/${archiveId}/thumbnail`
  );
  const result = response.data;
  if (result?.success) return result.data ?? null;
  throw new Error(result?.message || "썸네일 설정에 실패했습니다.");
}
