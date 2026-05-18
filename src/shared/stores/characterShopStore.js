import { create } from "zustand";

// Drive 에셋과 정렬: hats / accessories / backgrounds / etc 4 카테고리.
// 본체(감정 캐릭터)는 별도 `characterId` 로 관리한다.
export const ITEM_CATEGORIES = ["background", "hat", "accessory", "etc"];

const emptyEquip = () =>
  ITEM_CATEGORIES.reduce((acc, c) => ((acc[c] = null), acc), {});

export const useCharacterShopStore = create((set, get) => ({
  categories: ITEM_CATEGORIES,
  activeCategory: "hat",

  savedCharacterId: null,
  savedEquip: emptyEquip(),

  draftCharacterId: null,
  draftEquip: emptyEquip(),

  setActiveCategory: (category) => set({ activeCategory: category }),

  hydrateFromServer: ({ characterId, equip }) =>
    set({
      savedCharacterId: characterId ?? null,
      savedEquip: { ...emptyEquip(), ...(equip ?? {}) },
      draftCharacterId: characterId ?? null,
      draftEquip: { ...emptyEquip(), ...(equip ?? {}) },
    }),

  selectCharacter: (id) => set({ draftCharacterId: id }),
  tryOnItem: (category, itemId) =>
    set((s) => ({ draftEquip: { ...s.draftEquip, [category]: itemId } })),
  takeOff: (category) =>
    set((s) => ({ draftEquip: { ...s.draftEquip, [category]: null } })),

  resetDraft: () =>
    set((s) => ({
      draftCharacterId: s.savedCharacterId,
      draftEquip: { ...s.savedEquip },
    })),

  commitDraft: () =>
    set((s) => ({
      savedCharacterId: s.draftCharacterId,
      savedEquip: { ...s.draftEquip },
    })),

  isDirty: () => {
    const s = get();
    if (s.draftCharacterId !== s.savedCharacterId) return true;
    return ITEM_CATEGORIES.some((c) => s.draftEquip[c] !== s.savedEquip[c]);
  },
}));
