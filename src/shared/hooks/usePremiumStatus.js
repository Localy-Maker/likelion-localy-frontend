import { useCallback, useEffect, useState } from "react";
import { fetchPremiumStatus } from "@/features/premium/api/premiumApi";
import { getPremiumStatus } from "@/features/premium/utils/premiumStorage";

const DEFAULT_STATUS = { isPremium: false, isLoading: true };

export default function usePremiumStatus() {
  const [premiumStatus, setPremiumStatusState] = useState(DEFAULT_STATUS);

  const syncStatus = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setPremiumStatusState({ isPremium: false, isLoading: false });
      return;
    }

    try {
      const status = await fetchPremiumStatus();
      setPremiumStatusState({ ...status, isLoading: false });
    } catch {
      setPremiumStatusState({ ...getPremiumStatus(), isLoading: false });
    }
  }, []);

  useEffect(() => {
    syncStatus();

    window.addEventListener("premium-status-changed", syncStatus);
    window.addEventListener("storage", syncStatus);

    return () => {
      window.removeEventListener("premium-status-changed", syncStatus);
      window.removeEventListener("storage", syncStatus);
    };
  }, [syncStatus]);

  return premiumStatus;
}
