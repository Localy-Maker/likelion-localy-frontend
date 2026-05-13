import apiClient from "@/shared/api/client";

/**
 * 프로필 조회
 * GET /api/mypage/profile
 */
export const getProfile = async () => {
  const response = await apiClient.get("/api/mypage/profile");
  return response.data;
};

/**
 * 관심사 조회 (구) — /api/auth/interests/info
 * 신규 백엔드는 /api/mypage/interests 를 함께 제공한다. 호출 측에서 둘 중 하나를 선택해 사용.
 */
export const getInterests = async () => {
  const response = await apiClient.get("/api/auth/interests/info");
  return response.data;
};

/**
 * 마이페이지 관심사 조회 (신규)
 * GET /api/mypage/interests
 */
export const getMyPageInterests = async () => {
  const response = await apiClient.get("/api/mypage/interests");
  return response.data;
};

/**
 * 마이페이지 조회
 * GET /api/mypage/profile
 */
export const getMyPage = async () => {
  const response = await apiClient.get("/api/mypage/profile");
  return response.data;
};

/**
 * 회원정보 수정 (비밀번호/닉네임)
 * PUT /api/mypage/profile?verificationCode=xxx
 * 백엔드 변경 사항: 별도의 PATCH /api/users/me/password 는 제거됐고
 * 비밀번호 변경도 이 엔드포인트로 통합됨.
 */
export const updateMyInfo = async (verificationCode, userData) => {
  const response = await apiClient.put("/api/mypage/profile", userData, {
    params: { verificationCode },
  });
  return response.data;
};

/**
 * 언어/국적 수정
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
 * 프리미엄 현황 조회
 * GET /api/mypage/premium
 */
export const getPremiumStatus = async () => {
  const response = await apiClient.get("/api/mypage/premium");
  return response.data;
};

/**
 * 프리미엄 구매 (포인트 차감)
 * POST /api/mypage/premium/purchase?planType=
 * @param {string} planType - 백엔드가 정의한 플랜 타입 키
 */
export const purchasePremium = async (planType) => {
  const response = await apiClient.post(
    "/api/mypage/premium/purchase",
    null,
    { params: { planType } },
  );
  return response.data;
};

/**
 * 회원 탈퇴
 * DELETE /api/mypage/account
 */
export const deleteAccount = async () => {
  const response = await apiClient.delete("/api/mypage/account");

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");

  return response.data;
};
