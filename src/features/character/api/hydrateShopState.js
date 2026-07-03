import { getShopState } from "./shopApi";
import { toClientCharacterId } from "../utils/characterCode";
import { useUserStore } from "@/shared/stores/userStore";

/**
 * 로그인 직후 서버의 상점 상태로 userStore 를 hydrate 한다. (서버가 소스 오브 트루스)
 *
 * - currentPoint            → points            (정합성상 서버 값이 기준)
 * - currentCharacter.code   → equippedCharacter (code 매핑 적용, 로컬 폴백용)
 * - currentCharacter        → serverCharacter   (imageUrl 기반 "서버 주도 렌더" 원본)
 * - currentCharacter.equipped → serverEquipped   (하위호환 보관)
 *
 * serverCharacter 는 홈/마이페이지가 CharacterPreview 를 서버 모드(imageUrl)로 그릴 때 사용한다.
 * 서버 카탈로그(hat_01…)와 로컬 감정별 에셋(hat-happiness-01…)은 1:1 매핑이 불가능하므로
 * 로컬 equippedItems 는 건드리지 않는다.
 *   ponytail: 로컬 렌더 폴백을 유지하기 위해 로컬 equippedItems 는 그대로 둔다.
 *
 * best-effort: 백엔드 다운(502)·비로그인 등으로 실패해도 예외를 삼켜 로그인/앱 흐름을 막지 않는다.
 */
export async function hydrateShopStateFromServer() {
  try {
    const state = await getShopState();
    if (!state) return;
    const current = state.currentCharacter;
    useUserStore.setState((s) => ({
      points: state.currentPoint ?? s.points,
      equippedCharacter: current?.code
        ? toClientCharacterId(current.code)
        : s.equippedCharacter,
      serverCharacter: current
        ? { imageUrl: current.imageUrl, equipped: current.equipped ?? null }
        : s.serverCharacter,
      serverEquipped: current?.equipped ?? null,
    }));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("상점 상태 hydrate 실패(무시):", err?.message);
    }
  }
}
