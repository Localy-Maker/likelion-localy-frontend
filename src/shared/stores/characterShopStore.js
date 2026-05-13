import { create } from "zustand";

const CATEGORIES = ["top", "background", "hat", "accessory", "etc"];

const emptyEquip = () =>
  CATEGORIES.reduce((acc, c) => ((acc[c] = null), acc), {});

export const useCharacterShopStore = create((set, get) => ({
  categories: CATEGORIES,
  activeCategory: "top",

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
    return CATEGORIES.some((c) => s.draftEquip[c] !== s.savedEquip[c]);
  },
}));
