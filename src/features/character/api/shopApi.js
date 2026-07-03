import apiClient from "@/shared/api/client";

/**
 * 캐릭터/포인트 상점 API.
 * 백엔드(Localy_BE) 컨트롤러: ShopController(/api/shop/*), CharacterController(/api/characters/*).
 * 모든 엔드포인트는 JWT(AuthenticationPrincipal) 기반이라 userId 파라미터가 없다.
 * 응답은 BaseResponse<T> = { success, code, message, data } 로 감싸져 있어 data 만 언래핑한다.
 */
const unwrap = (res) => res.data?.data ?? res.data;

/**
 * 상점 상태 조회 (화면 진입 시 전체 상태)
 * GET /api/shop/state
 * @returns {Promise<{currentPoint:number, currentCharacter:{code,name,imageUrl,equipped:{background,hat,accessory,etc}}}>}
 */
export const getShopState = async () => unwrap(await apiClient.get("/api/shop/state"));

/**
 * 카테고리별 아이템 목록
 * GET /api/shop/items?category=BACKGROUND|HAT|ACCESSORY|ETC
 * @param {"BACKGROUND"|"HAT"|"ACCESSORY"|"ETC"} category
 * @returns {Promise<{items: Array<{itemId,category,name,price,imageUrl,isOwned,isEquipped}>}>}
 */
export const getItemsByCategory = async (category) =>
  unwrap(await apiClient.get("/api/shop/items", { params: { category } }));

/**
 * 보유 아이템 목록
 * GET /api/shop/items/owned
 */
export const getOwnedItems = async () =>
  unwrap(await apiClient.get("/api/shop/items/owned"));

/**
 * 아이템 구매 (포인트 20P 차감 + 인벤토리 추가 + 현재 캐릭터 자동 착용)
 * POST /api/shop/items/{itemId}/purchase
 * 실패 코드: 포인트 부족 SHOP003, 이미 보유 SHOP002
 * @param {number} itemId 서버 아이템 ID
 * @returns {Promise<{currentPoint:number, purchasedItemId:number, autoEquipped:boolean}>}
 */
export const purchaseItem = async (itemId) =>
  unwrap(await apiClient.post(`/api/shop/items/${itemId}/purchase`));

/**
 * 아이템 착용/해제 (현재 캐릭터 기준)
 * PATCH /api/shop/equip
 * @param {"BACKGROUND"|"HAT"|"ACCESSORY"|"ETC"} category
 * @param {number|null} itemId null 이면 해당 카테고리 해제
 * @returns {Promise<{equipped:{background,hat,accessory,etc}}>}
 */
export const equipItem = async (category, itemId) =>
  unwrap(await apiClient.patch("/api/shop/equip", { category, itemId }));

/**
 * 캐릭터 목록 (6종 + 현재 선택 여부)
 * GET /api/characters
 * @returns {Promise<{characters: Array<{code,name,imageUrl,isCurrent}>}>}
 */
export const getCharacters = async () => unwrap(await apiClient.get("/api/characters"));

/**
 * 현재 캐릭터 변경 (착용 상태는 유지)
 * PATCH /api/characters/current
 * 실패 코드: 없는 코드 SHOP004
 * @param {string} characterCode 백엔드 캐릭터 코드 (happy|sadness|anger|depressed|anxiety|neutral)
 */
export const changeCurrentCharacter = async (characterCode) =>
  unwrap(await apiClient.patch("/api/characters/current", { characterCode }));
