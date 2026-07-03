import { getShopState } from "./shopApi";
import { toClientCharacterId } from "../utils/characterCode";
import { useUserStore } from "@/shared/stores/userStore";

/**
 * 로그인 직후 서버의 상점 상태로 userStore 를 hydrate 한다. (서버가 소스 오브 트루스)
 *
 * - currentPoint            → points            (정합성상 서버 값이 기준)
 * - currentCharacter.code   → equippedCharacter (code 매핑 적용)
 * - currentCharacter.equipped(imageUrl 기반) → serverEquipped 에 원본 보관
 *
 * 착용 아이템을 로컬 equippedItems 로 바로 옮기지 않는 이유:
 *   백엔드 아이템 카탈로그는 카테고리 공통(hat_01…)이고 프론트 로컬 에셋은 감정별
 *   (hat-happiness-01…)이라 itemId → 로컬 렌더 id 로 1:1 매핑이 불가능하다. 서버가 주는
 *   imageUrl 을 직접 렌더하는 "서버 주도 렌더" 도입 시 serverEquipped 를 사용한다.
 *   ponytail: 그때까지 로컬 equippedItems 는 건드리지 않아 기존 로컬 렌더가 깨지지 않게 한다.
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
      serverEquipped: current?.equipped ?? null,
    }));
  } catch (err) {
    if (import.meta.env.DEV) {
      console.warn("상점 상태 hydrate 실패(무시):", err?.message);
    }
  }
}
