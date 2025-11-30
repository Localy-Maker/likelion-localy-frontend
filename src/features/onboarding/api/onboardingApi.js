import apiClient from "@/shared/api/client";

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
  const response = await apiClient.put("/api/users/interests", {
    goodMoodActivities,
    badMoodActivities,
  });
  return response.data;
};

