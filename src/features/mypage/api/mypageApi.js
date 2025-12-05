import apiClient from "@/shared/api/client";

/**
 * 10. 관심사 조회
 * GET /api/auth/interests/info
 */
export const getInterests = async () => {
  const response = await apiClient.get("/api/auth/interests/info");
  return response.data;
};

/**
 * 11. 마이페이지 조회
 * GET /api/mypage/profile
 */
export const getMyPage = async () => {
  const response = await apiClient.get("/api/mypage/profile");
  return response.data;
};

/**
 * 12. 회원정보 수정 (비밀번호/닉네임)
 * PUT /api/mypage/profile?verificationCode=xxx
 */
export const updateMyInfo = async (verificationCode, userData) => {
  const response = await apiClient.put("/api/mypage/profile", userData, {
    params: { verificationCode },
  });
  return response.data;
};

/**
 * 12-1. 언어/국적 수정
 * PUT /api/mypage/settings/nationality
 */
export const updateNationality = async (language, nationality) => {
  const response = await apiClient.put("/api/mypage/settings/nationality", {
    language,
    nationality,
  });
  return response.data;
};

/**
 * 13. 비밀번호 변경
 * PATCH /api/users/me/password
 */
export const changePassword = async (currentPassword, newPassword) => {
  const response = await apiClient.patch("/api/users/me/password", {
    currentPassword,
    newPassword,
  });
  return response.data;
};

/**
 * 14. 회원 탈퇴
 * DELETE /api/mypage/account
 */
export const deleteAccount = async () => {
  const response = await apiClient.delete("/api/mypage/account");
  
  // 탈퇴 성공 시 토큰 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  return response.data;
};










