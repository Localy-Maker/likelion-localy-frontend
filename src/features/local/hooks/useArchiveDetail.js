import { useQuery } from "@tanstack/react-query";
import { getArchiveDetail } from "@/features/local/api/archiveApi";

/**
 * 특정 날짜의 미션 아카이브 상세 조회 훅.
 * @param {string} date - YYYY-MM-DD
 */
export function useArchiveDetail(date) {
  return useQuery({
    queryKey: ["mission-archive-detail", date],
    queryFn: () => getArchiveDetail(date),
    enabled: typeof date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(date),
    staleTime: 1000 * 60 * 5,
  });
}
