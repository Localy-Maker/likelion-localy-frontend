import apiClient from "@/shared/api/client";

/**
 * 1. 기본 로그인
 * POST /api/auth/login
 */
export const login = async (email, password) => {
  const response = await apiClient.post("/api/auth/login", {
    email,
    password,
  });
  
  // Response 구조: { data: { status, message, userId, email, name, profileImage, accessToken, refreshToken } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 저장
  if (responseData.accessToken) {
    localStorage.setItem("accessToken", responseData.accessToken);
  }
  if (responseData.refreshToken) {
    localStorage.setItem("refreshToken", responseData.refreshToken);
  }
  
  return responseData;
};

/**
 * 2-1. 구글 클라이언트 ID 조회
 * GET /api/auth/google/client-id
 */
export const getGoogleClientId = async () => {
  const response = await apiClient.get("/api/auth/google/client-id");
  // Response 구조: BaseResponse<ClientResponse> = { data: { clientId: "..." } }
  const responseData = response.data?.data || response.data;
  return responseData.clientId;
};

/**
 * 2-2. 구글 소셜 로그인
 * POST /api/auth/login/google
 */
export const googleLogin = async (idToken) => {
  const response = await apiClient.post("/api/auth/login/google", {
    idToken: idToken,
  });
  
  // Response 구조: BaseResponse<AuthResponse> = { data: { accessToken, refreshToken, userId, email, nickname } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 저장
  if (responseData.accessToken) {
    localStorage.setItem("accessToken", responseData.accessToken);
  }
  if (responseData.refreshToken) {
    localStorage.setItem("refreshToken", responseData.refreshToken);
  }
  
  return responseData;
};

/**
 * 3. 회원가입 - 이메일 입력/인증번호 발송
 * POST /api/auth/email/verification/send
 */
export const sendVerificationCode = async (email) => {
  const response = await apiClient.post("/api/auth/email/verification/send", {
    email,
  });
  
  // Response 구조: BaseResponse<EmailVerificationResponse> = { data: { verified: false, message: "..." } }
  const responseData = response.data?.data || response.data;
  
  // expiresIn은 백엔드에서 제공하지 않으므로 기본값 300초(5분) 사용
  return {
    ...responseData,
    expiresIn: 300, // 5분
  };
};

/**
 * 4. 회원가입 - 인증번호 확인
 * POST /api/auth/email/verification/confirm
 */
export const verifyCode = async (email, code) => {
  const response = await apiClient.post("/api/auth/email/verification/confirm", {
    email,
    code,
  });
  
  // Response 구조: BaseResponse<EmailVerificationResponse> = { data: { verified: true, message: "..." } }
  const responseData = response.data?.data || response.data;
  
  return responseData;
};

/**
 * 5. 회원가입
 * POST /api/auth/signup
 */
export const signup = async (signupData) => {
  const response = await apiClient.post("/api/auth/signup", {
    email: signupData.email,
    password: signupData.password,
    passwordConfirm: signupData.confirmPassword || signupData.passwordConfirm,
    nickname: signupData.nickname,
  });
  
  // Response 구조: BaseResponse<AuthResponse> = { data: { accessToken, refreshToken, userId, email, nickname } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 저장
  if (responseData.accessToken) {
    localStorage.setItem("accessToken", responseData.accessToken);
  }
  if (responseData.refreshToken) {
    localStorage.setItem("refreshToken", responseData.refreshToken);
  }
  
  return responseData;
};

/**
 * 6. 로그아웃
 * POST /api/auth/logout
 */
export const logout = async () => {
  const response = await apiClient.post("/api/auth/logout");
  
  // Response 구조: BaseResponse<LogoutResponse> = { data: { success: true, message: "..." } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  return responseData;
};

/**
 * 7. 비밀번호 재설정 (비밀번호 찾기)
 * POST /api/auth/password/reset
 */
export const resetPassword = async (email, code, newPassword, newPasswordConfirm) => {
  const response = await apiClient.post("/api/auth/password/reset", {
    email,
    code,
    newPassword,
    newPasswordConfirm,
  });
  
  // Response 구조: BaseResponse<PasswordResetResponse> = { data: { success: true, message: "..." } }
  const responseData = response.data?.data || response.data;
  return responseData;
};

