import { create } from "zustand";
import { persist } from "zustand/middleware";

const emptyEquip = () => ({
  background: null,
  hat: null,
  accessory: null,
  etc: null,
});

export const useUserStore = create(
  persist(
    (set) => ({
      accessToken: null,
      refreshToken: null,
      userId: null,
      email: null,
      nickname: null,
      onboardingCompleted: false,

      isPremium: false,
      premiumExpiresAt: null,
      points: 0,

      // 캐릭터 본체(감정) + 장착 아이템.
      // 백엔드 캐릭터 API가 아직 없어서 localStorage 에 persist 한다.
      // TODO: 백엔드 캐릭터 API 연결 시 setAuth 시점에 서버 값을 hydrate.
      equippedCharacter: null,
      equippedItems: emptyEquip(),

      setAuth: ({ accessToken, refreshToken, userId, email }) =>
        set({ accessToken, refreshToken, userId, email }),
      setProfile: ({ nickname, onboardingCompleted }) =>
        set((s) => ({
          nickname: nickname ?? s.nickname,
          onboardingCompleted: onboardingCompleted ?? s.onboardingCompleted,
        })),
      setPremium: ({ isPremium, premiumExpiresAt }) =>
        set({ isPremium, premiumExpiresAt }),
      setPoints: (points) => set({ points }),
      setEquipped: ({ characterId, equip }) =>
        set({
          equippedCharacter: characterId,
          equippedItems: { ...emptyEquip(), ...(equip ?? {}) },
        }),
      clear: () =>
        set({
          accessToken: null,
          refreshToken: null,
          userId: null,
          email: null,
          nickname: null,
          onboardingCompleted: false,
          isPremium: false,
          premiumExpiresAt: null,
          points: 0,
          equippedCharacter: null,
          equippedItems: emptyEquip(),
        }),
    }),
    { name: "localy-user" },
  ),
);
