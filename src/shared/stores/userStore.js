import { create } from "zustand";
import { persist } from "zustand/middleware";

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
        }),
    }),
    { name: "localy-user" },
  ),
);
