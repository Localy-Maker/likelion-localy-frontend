import { useQuery } from "@tanstack/react-query";
import { getMonthlyArchive } from "@/features/local/api/archiveApi";

/**
 * 월간 미션 아카이브 조회 훅 (TanStack Query 기반).
 * @param {number} year
 * @param {number} month - 1..12
 */
export function useMonthlyArchive(year, month) {
  return useQuery({
    queryKey: ["mission-archive-monthly", year, month],
    queryFn: () => getMonthlyArchive(year, month),
    enabled: Number.isInteger(year) && Number.isInteger(month),
    staleTime: 1000 * 60 * 5,
  });
}
