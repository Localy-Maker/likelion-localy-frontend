import apiClient from "@/shared/api/client";
import { syncPremiumStatusCache } from "../utils/premiumStorage";

function dispatchPremiumStatusChanged() {
  window.dispatchEvent(new Event("premium-status-changed"));
}

function normalizeStatus(data) {
  if (!data) {
    return { isPremium: false };
  }

  return {
    isPremium: Boolean(data.isPremium),
    remainingDays: data.currentSubscription?.remainingDays ?? null,
    expiresAt: data.currentSubscription?.expiresAt ?? null,
  };
}

/**
 * GET /api/premium/plans
 */
export async function getPremiumPlans() {
  const response = await apiClient.get("/api/premium/plans");
  return response.data?.data;
}

/**
 * GET /api/premium/status
 */
export async function fetchPremiumStatus() {
  const response = await apiClient.get("/api/premium/status");
  const status = normalizeStatus(response.data?.data);
  syncPremiumStatusCache(status);
  return status;
}

/**
 * POST /api/premium/subscribe
 */
export async function subscribePremiumPlan(planCode) {
  const response = await apiClient.post("/api/premium/subscribe", { planCode });
  const result = response.data?.data;

  syncPremiumStatusCache({
    isPremium: true,
    remainingDays: result?.remainingDays ?? null,
    expiresAt: result?.expiresAt ?? null,
  });
  dispatchPremiumStatusChanged();

  return result;
}

export function mapBePlansToUi(bePlans = []) {
  return bePlans.map((plan) => ({
    id: plan.code,
    planCode: plan.code,
    days: plan.durationDays,
    points: plan.price,
    title: `${plan.name} ${plan.price}P`,
    subtitle:
      plan.durationDays <= 7
        ? "짧게 체험해보세요"
        : "한 달 동안 더 많은 혜택을",
  }));
}
