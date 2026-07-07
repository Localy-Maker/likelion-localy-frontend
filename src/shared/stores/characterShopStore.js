import { create } from "zustand";
import {
  diffEquipped,
  normalizeEquipped,
  SLOTS,
} from "@/features/character/utils/equipped";

// 상점 탭(필터) 카테고리. "owned"(보유) 탭은 별도 처리.
export const ITEM_CATEGORIES = SLOTS;

const emptyEquipped = () => ({
  background: null,
  hat: null,
  accessory: null,
  etc: null,
});

/**
 * 캐릭터 상점 드래프트 스토어.
 *
 * 백엔드 모델: 장착은 유저 전역 1세트(카테고리별 4슬롯), 캐릭터를 바꿔도 장착은 유지.
 *
 * - saved*: 서버에 반영된 현재 상태.
 * - draft*: 미리보기/편집 중인 상태. "저장하기" 시 saved 와의 차이만 서버로 커밋한다.
 *
 * draftEquipped 의 각 슬롯은 { itemId, imageUrl } | null (미리보기에 imageUrl 필요).
 */
export const useCharacterShopStore = create((set, get) => ({
  savedCharacterCode: null,
  savedCharacterImageUrl: null,
  savedEquipped: emptyEquipped(),

  draftCharacterCode: null,
  draftCharacterImageUrl: null,
  draftEquipped: emptyEquipped(),

  /**
   * 서버 상태로 동기화. draft 와 saved 를 동일하게 맞춘다.
   * @param {{ characterCode, characterImageUrl, equipped }} args
   */
  hydrateFromServer: ({ characterCode, characterImageUrl, equipped }) => {
    const normalized = normalizeEquipped(equipped);
    set({
      savedCharacterCode: characterCode ?? null,
      savedCharacterImageUrl: characterImageUrl ?? null,
      savedEquipped: normalized,
      draftCharacterCode: characterCode ?? null,
      draftCharacterImageUrl: characterImageUrl ?? null,
      draftEquipped: normalizeEquipped(equipped),
    });
  },

  /** 드래프트에서 캐릭터 본체만 교체. 장착은 유지된다(백엔드 동작과 동일). */
  selectCharacter: (code, imageUrl) =>
    set({ draftCharacterCode: code, draftCharacterImageUrl: imageUrl ?? null }),

  /** 해당 카테고리 슬롯에 아이템 장착(미리보기). */
  tryOnItem: (category, item) =>
    set((s) => ({
      draftEquipped: {
        ...s.draftEquipped,
        [category]: item
          ? { itemId: item.itemId, imageUrl: item.imageUrl ?? null }
          : null,
      },
    })),

  /** 해당 카테고리 슬롯 해제(미리보기). */
  takeOff: (category) =>
    set((s) => ({
      draftEquipped: { ...s.draftEquipped, [category]: null },
    })),

  /** 드래프트를 마지막 저장 상태로 되돌린다. */
  resetDraft: () =>
    set((s) => ({
      draftCharacterCode: s.savedCharacterCode,
      draftCharacterImageUrl: s.savedCharacterImageUrl,
      draftEquipped: { ...s.savedEquipped },
    })),

  /** 저장 성공 후 saved 를 draft 로 확정. */
  commitDraft: () =>
    set((s) => ({
      savedCharacterCode: s.draftCharacterCode,
      savedCharacterImageUrl: s.draftCharacterImageUrl,
      savedEquipped: { ...s.draftEquipped },
    })),

  /**
   * 구매 결과 반영. 구매 아이템은 서버에서 즉시 자동 착용되므로
   * 해당 슬롯을 saved/draft 양쪽 모두에 즉시 반영한다(다른 슬롯의 미저장 드래프트는 보존).
   */
  applyPurchase: (category, item) =>
    set((s) => {
      const slot = { itemId: item.itemId, imageUrl: item.imageUrl ?? null };
      return {
        savedEquipped: { ...s.savedEquipped, [category]: slot },
        draftEquipped: { ...s.draftEquipped, [category]: slot },
      };
    }),

  /** 캐릭터 변경 여부 */
  isCharacterDirty: () => {
    const s = get();
    return s.draftCharacterCode !== s.savedCharacterCode;
  },

  /** 저장 시 서버로 보낼 슬롯 변경 목록 */
  getEquipChanges: () => {
    const s = get();
    return diffEquipped(s.draftEquipped, s.savedEquipped);
  },

  /** 변경 사항(캐릭터 또는 장착) 존재 여부 */
  isDirty: () => {
    const s = get();
    if (s.draftCharacterCode !== s.savedCharacterCode) return true;
    return diffEquipped(s.draftEquipped, s.savedEquipped).length > 0;
  },
}));
