import apiClient from "@/shared/api/client";

/**
 * 온보딩 진행 상태/정보 조회
 * GET /api/onboarding/info
 */
export const getOnboardingInfo = async () => {
  const response = await apiClient.get("/api/onboarding/info");
  return response.data;
};

/**
 * 8. 온보딩-언어/국적 선택
 * PUT /api/users/nationality
 */
export const updateNationality = async (language, nationality) => {
  const response = await apiClient.put("/api/users/nationality", {
    language,
    nationality,
  });
  return response.data;
};

/**
 * 9. 온보딩-관심사 선택
 * PUT /api/users/interests
 */
export const updateInterests = async (goodMoodActivities, badMoodActivities) => {
  // 두 배열을 하나로 합쳐서 interests 키로 전송
  const interests = [...goodMoodActivities, ...badMoodActivities];
  const response = await apiClient.put("/api/users/interests", {
    interests,
  });
  return response.data;
};

