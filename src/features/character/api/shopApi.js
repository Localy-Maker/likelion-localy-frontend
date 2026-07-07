import apiClient from "@/shared/api/client";

/**
 * dev 목 스위치. `VITE_USE_MOCK=true` 일 때 서버 대신 로컬 목(shopApi.mock.js)을 쓴다.
 * 상수 비교라 프로덕션 빌드(플래그 미설정)에서는 아래 분기와 동적 import 가 dead-code 로 제거된다.
 */
const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
let mockModulePromise;
function loadMock() {
  if (!mockModulePromise) mockModulePromise = import("./shopApi.mock");
  return mockModulePromise;
}

/**
 * 캐릭터/상점(포인트 상점) API 클라이언트.
 *
 * 백엔드 모델 요약:
 * - 캐릭터는 code(happy, sad 등) 기준. 장착 상태는 유저 전역으로 1세트만 존재하며
 *   캐릭터를 바꿔도 장착은 그대로 유지된다.
 * - 아이템은 숫자 itemId 기준, 카테고리는 BACKGROUND | HAT | ACCESSORY | ETC.
 * - 장착은 카테고리별 1슬롯(총 4슬롯). 캐릭터 본체 imageUrl 위에 각 슬롯 imageUrl 을 레이어로 합성한다.
 */

/** 프론트 탭(소문자) → 백엔드 카테고리(대문자) 매핑 */
export const CATEGORY_TO_API = {
  background: "BACKGROUND",
  hat: "HAT",
  accessory: "ACCESSORY",
  etc: "ETC",
};

/** 백엔드 카테고리(대문자) → 프론트 슬롯 키(소문자) 매핑 */
export const API_TO_CATEGORY = {
  BACKGROUND: "background",
  HAT: "hat",
  ACCESSORY: "accessory",
  ETC: "etc",
};

/**
 * 캐릭터 목록 조회. 6종 캐릭터 + 현재 선택 여부.
 * @returns {Promise<{ characters: Array<{code, name, imageUrl, isCurrent}> }>}
 */
export async function getCharacters() {
  if (USE_MOCK) return (await loadMock()).getCharacters();
  const response = await apiClient.get("/api/characters");
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "캐릭터 목록 조회에 실패했습니다.");
}

/**
 * 현재 캐릭터 변경. 장착 상태는 유지된다.
 * @param {string} characterCode - 변경할 캐릭터 코드
 * @returns {Promise<{ code, name, imageUrl, equipped }>}
 */
export async function changeCharacter(characterCode) {
  if (USE_MOCK) return (await loadMock()).changeCharacter(characterCode);
  const response = await apiClient.patch("/api/characters/current", {
    characterCode,
  });
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "캐릭터 변경에 실패했습니다.");
}

/**
 * 상점 상태 조회. 보유 포인트 + 현재 캐릭터 + 착용 아이템.
 * @returns {Promise<{ currentPoint, currentCharacter: { code, name, imageUrl, equipped } }>}
 */
export async function getShopState() {
  if (USE_MOCK) return (await loadMock()).getShopState();
  const response = await apiClient.get("/api/shop/state");
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "상점 상태 조회에 실패했습니다.");
}

/**
 * 카테고리별 아이템 목록 조회.
 * @param {"background"|"hat"|"accessory"|"etc"} category - 프론트 카테고리 키
 * @returns {Promise<{ items: Array<{ itemId, category, name, price, imageUrl, isOwned, isEquipped }> }>}
 */
export async function getShopItems(category) {
  if (USE_MOCK) return (await loadMock()).getShopItems(category);
  const apiCategory = CATEGORY_TO_API[category] ?? category;
  const response = await apiClient.get("/api/shop/items", {
    params: { category: apiCategory },
  });
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "아이템 목록 조회에 실패했습니다.");
}

/**
 * 보유 아이템 목록 조회. 카테고리 순 → 최근 구매순.
 * @returns {Promise<{ items: Array<{ itemId, category, name, price, imageUrl, isOwned, isEquipped }> }>}
 */
export async function getOwnedItems() {
  if (USE_MOCK) return (await loadMock()).getOwnedItems();
  const response = await apiClient.get("/api/shop/items/owned");
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "보유 아이템 조회에 실패했습니다.");
}

/**
 * 아이템 구매. 포인트 차감 + 인벤토리 추가 + 현재 캐릭터에 자동 착용.
 * @param {number} itemId
 * @returns {Promise<{ currentPoint, purchasedItemId, autoEquipped }>}
 */
export async function purchaseItem(itemId) {
  if (USE_MOCK) return (await loadMock()).purchaseItem(itemId);
  const response = await apiClient.post(`/api/shop/items/${itemId}/purchase`);
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "아이템 구매에 실패했습니다.");
}

/**
 * 아이템 착용/해제. itemId=null 이면 해당 카테고리 해제.
 * @param {"background"|"hat"|"accessory"|"etc"} category - 프론트 카테고리 키
 * @param {number|null} itemId
 * @returns {Promise<{ equipped }>}
 */
/**
 * 방식 B 미리보기: 현재 캐릭터에 아이템을 입힌 합성 이미지 조회.
 * 백엔드 도입 시 즉석 합성 엔드포인트(예: POST /api/shop/preview)로 교체.
 * @param {number|null} itemId
 * @returns {Promise<{ imageUrl: string }>}
 */
export async function getWornPreview(itemId, characterCode) {
  if (USE_MOCK) return (await loadMock()).getWornPreview(itemId, characterCode);
  // 실제 백엔드 합성 엔드포인트 미연결. imageUrl=null 을 돌려주면 미리보기가
  // 클라이언트 레이어 합성(방식 A)으로 폴백하므로 프로덕션에서 안전하다.
  // 백엔드 합성 API 확정 시 여기서 호출로 교체(예: GET /api/shop/preview).
  return { imageUrl: null };
}

export async function equipItem(category, itemId) {
  if (USE_MOCK) return (await loadMock()).equipItem(category, itemId);
  const apiCategory = CATEGORY_TO_API[category] ?? category;
  const response = await apiClient.patch("/api/shop/equip", {
    category: apiCategory,
    itemId: itemId ?? null,
  });
  const result = response.data;
  if (result.success) return result.data;
  throw new Error(result.message || "아이템 착용에 실패했습니다.");
}
