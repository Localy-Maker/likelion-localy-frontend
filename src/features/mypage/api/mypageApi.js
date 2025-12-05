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
 * GET /api/users/me
 */
export const getMyPage = async () => {
  const response = await apiClient.get("/api/users/me");
  return response.data;
};

/**
 * 12. 회원정보 수정
 * PATCH /api/users/me
 */
export const updateMyInfo = async (userData) => {
  const response = await apiClient.patch("/api/users/me", userData);
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
 * DELETE /api/users/me
 */
export const deleteAccount = async () => {
  const response = await apiClient.delete("/api/users/me");
  
  // 탈퇴 성공 시 토큰 제거
  localStorage.removeItem("accessToken");
  
  return response.data;
};










