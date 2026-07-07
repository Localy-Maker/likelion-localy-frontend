import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeCharacter,
  equipItem,
  getCharacters,
  getOwnedItems,
  getShopItems,
  getShopState,
  purchaseItem,
} from "@/features/character/api/shopApi";

export const shopKeys = {
  state: ["shop-state"],
  characters: ["characters"],
  items: (category) => ["shop-items", category],
  owned: ["shop-items", "owned"],
};

/** 상점 상태(포인트 + 현재 캐릭터 + 착용) 조회 */
export function useShopState(options = {}) {
  return useQuery({
    queryKey: shopKeys.state,
    queryFn: getShopState,
    ...options,
  });
}

/** 캐릭터 목록 조회 */
export function useCharacters(options = {}) {
  return useQuery({
    queryKey: shopKeys.characters,
    queryFn: getCharacters,
    ...options,
  });
}

/** 카테고리별 아이템 목록 조회 */
export function useShopItems(category, options = {}) {
  return useQuery({
    queryKey: shopKeys.items(category),
    queryFn: () => getShopItems(category),
    enabled: !!category,
    ...options,
  });
}

/** 보유 아이템 목록 조회 */
export function useOwnedItems(options = {}) {
  return useQuery({
    queryKey: shopKeys.owned,
    queryFn: getOwnedItems,
    ...options,
  });
}

/** 상점 관련 캐시 전체 무효화 (구매/착용/캐릭터 변경 후 재조회) */
function invalidateShop(queryClient) {
  queryClient.invalidateQueries({ queryKey: shopKeys.state });
  queryClient.invalidateQueries({ queryKey: ["shop-items"] });
  queryClient.invalidateQueries({ queryKey: shopKeys.characters });
}

/** 아이템 구매 (포인트 차감 + 자동 착용) */
export function usePurchaseItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (itemId) => purchaseItem(itemId),
    onSuccess: () => invalidateShop(queryClient),
  });
}

/** 아이템 착용/해제 */
export function useEquipItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ category, itemId }) => equipItem(category, itemId),
    onSuccess: () => invalidateShop(queryClient),
  });
}

/** 현재 캐릭터 변경 */
export function useChangeCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (characterCode) => changeCharacter(characterCode),
    onSuccess: () => invalidateShop(queryClient),
  });
}
