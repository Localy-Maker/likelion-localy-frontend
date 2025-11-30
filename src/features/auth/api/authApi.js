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
  return response.data.clientId;
};

/**
 * JWT 토큰 디코딩 헬퍼 함수
 */
const decodeJWT = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (err) {
    console.error('JWT 디코딩 실패:', err);
    return null;
  }
};

/**
 * 2-2. 구글 소셜 로그인
 * POST /api/auth/google
 */
export const googleLogin = async (idToken) => {
  // ID 토큰에서 이메일 추출
  const decodedToken = decodeJWT(idToken);
  if (!decodedToken || !decodedToken.email) {
    throw new Error("ID 토큰에서 이메일을 추출할 수 없습니다.");
  }

  const response = await apiClient.post("/api/auth/google", {
    idToken: idToken,
    email: decodedToken.email,
  });
  
  // Response 구조: { data: { status, message, userId, email, name, profileImage, accessToken, refreshToken, isNewUser, needsOnboarding } }
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
 * POST /api/auth/signup/email
 */
export const sendVerificationCode = async (email) => {
  const response = await apiClient.post("/api/auth/signup/email", {
    email,
  });
  
  // Response 구조: { data: { status, message, email, expiresIn } }
  const responseData = response.data?.data || response.data;
  return responseData;
};

/**
 * 4. 회원가입 - 인증번호 확인
 * POST /api/auth/signup/verify
 */
export const verifyCode = async (email, code) => {
  const response = await apiClient.post("/api/auth/signup/verify", {
    email,
    code,
  });
  
  // Response 구조: { data: { status, message, verified, verificationToken } }
  const responseData = response.data?.data || response.data;
  
  // verificationToken을 localStorage에 임시 저장 (회원가입 시 사용)
  if (responseData.verificationToken) {
    localStorage.setItem("verificationToken", responseData.verificationToken);
  }
  
  return responseData;
};

/**
 * 5. 회원가입
 * POST /api/auth/signup
 */
export const signup = async (signupData) => {
  // verificationToken을 localStorage에서 가져오기
  const verificationToken = localStorage.getItem("verificationToken");
  if (!verificationToken) {
    throw new Error("인증 토큰이 없습니다. 이메일 인증을 먼저 완료해주세요.");
  }

  const response = await apiClient.post("/api/auth/signup", {
    ...signupData,
    verificationToken,
  });
  
  // Response 구조: { data: { status, message, userId, email, nickname, accessToken, refreshToken, needsOnboarding } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 저장
  if (responseData.accessToken) {
    localStorage.setItem("accessToken", responseData.accessToken);
  }
  if (responseData.refreshToken) {
    localStorage.setItem("refreshToken", responseData.refreshToken);
  }
  
  // verificationToken 사용 후 제거
  localStorage.removeItem("verificationToken");
  
  return responseData;
};

/**
 * 6. 로그아웃
 * POST /api/auth/logout
 */
export const logout = async () => {
  // refreshToken을 localStorage에서 가져오기
  const refreshToken = localStorage.getItem("refreshToken");
  if (!refreshToken) {
    // refreshToken이 없으면 토큰만 제거하고 종료
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    return { message: "이미 로그아웃되었습니다." };
  }

  const response = await apiClient.post("/api/auth/logout", {
    refreshToken,
  });
  
  // Response 구조: { data: { status, message } }
  const responseData = response.data?.data || response.data;
  
  // 토큰 제거
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  
  return responseData;
};

/**
 * 7. 비밀번호 찾기
 * POST /api/auth/password/reset
 */
export const resetPassword = async (email) => {
  const response = await apiClient.post("/api/auth/password/reset", {
    email,
  });
  return response.data;
};

