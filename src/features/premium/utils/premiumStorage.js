const PREMIUM_STORAGE_KEY = "localy_premium_status";

export function getPremiumStatus() {
  try {
    const raw = localStorage.getItem(PREMIUM_STORAGE_KEY);
    if (!raw) {
      return { isPremium: false };
    }

    const data = JSON.parse(raw);
    if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
      localStorage.removeItem(PREMIUM_STORAGE_KEY);
      return { isPremium: false };
    }

    return {
      isPremium: Boolean(data.isPremium),
      remainingDays: data.remainingDays ?? null,
      expiresAt: data.expiresAt ?? null,
    };
  } catch {
    return { isPremium: false };
  }
}

export function syncPremiumStatusCache({ isPremium, remainingDays, expiresAt }) {
  if (!isPremium) {
    localStorage.removeItem(PREMIUM_STORAGE_KEY);
    return;
  }

  localStorage.setItem(
    PREMIUM_STORAGE_KEY,
    JSON.stringify({
      isPremium: true,
      remainingDays,
      expiresAt,
      syncedAt: new Date().toISOString(),
    }),
  );
}

export function clearPremiumStatus() {
  localStorage.removeItem(PREMIUM_STORAGE_KEY);
  window.dispatchEvent(new Event("premium-status-changed"));
}
