import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import { useLanguage } from "@/contexts/useLanguage";
import * as S from "../styles/EditMyInfoPage.styles";
import { sendVerificationCode, verifyCode } from "@/features/auth/api/authApi";
import { updateMyInfo } from "../api/mypageApi";
import SidebarModal from "@/features/onboarding/components/SidebarModal";

/**
 * 회원정보 수정 페이지 컴포넌트
 * 사용자 회원정보 수정을 위한 폼을 제공하며, 이메일 인증, 비밀번호 검증 등의 기능을 포함합니다.
 */
export default function EditMyInfoPage() {
  const navigate = useNavigate();
  const { t, changeLanguage } = useLanguage();

  // ========== 상태 관리 ==========
  // 사용자 입력 필드
  const [email, setEmail] = useState(""); // 이메일 입력값
  const [verificationCode, setVerificationCode] = useState(""); // 인증번호 입력값
  const [password, setPassword] = useState(""); // 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 입력값
  const [nickname, setNickname] = useState(""); // 닉네임 입력값
  const [displayLanguage, setDisplayLanguage] = useState(""); // 표시 언어
  const [displayLanguageValue, setDisplayLanguageValue] = useState(""); // 표시 언어 값
  const [nationality, setNationality] = useState(""); // 국적
  const [nationalityValue, setNationalityValue] = useState(""); // 국적 값

  // UI 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김 토글
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 표시/숨김 토글
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부

  // 인증번호 타이머 관련 상태
  const [timer, setTimer] = useState(0); // 타이머 초 단위 (5분 = 300초)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 여부
  const [isVerificationCodeVerified, setIsVerificationCodeVerified] = useState(false); // 인증번호 확인 완료 여부
  
  // 모달 상태
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isNationalityModalOpen, setIsNationalityModalOpen] = useState(false);
  
  // 필드 ref (모달 위치 계산용)
  const languageFieldRef = useRef(null);
  const nationalityFieldRef = useRef(null);
  
  // API 호출 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // 언어 옵션 목록
  const languageOptions = [
    { id: "ko", value: "ko", label: "한국어", icon: "🇰🇷" },
    { id: "en", value: "en", label: "English", icon: "🇺🇸" },
    { id: "ja", value: "ja", label: "日本語", icon: "🇯🇵" },
    { id: "zh", value: "zh", label: "中文", icon: "🇨🇳" },
    { id: "es", value: "es", label: "Español", icon: "🇪🇸" },
    { id: "fr", value: "fr", label: "Français", icon: "🇫🇷" },
    { id: "de", value: "de", label: "Deutsch", icon: "🇩🇪" },
    { id: "pt", value: "pt", label: "Português", icon: "🇵🇹" },
    { id: "ru", value: "ru", label: "Русский", icon: "🇷🇺" },
    { id: "ar", value: "ar", label: "العربية", icon: "🇸🇦" },
  ];
  
  // 국적 옵션 목록
  const nationalityOptions = [
    { id: "kr", value: "kr", label: "대한민국", icon: "🇰🇷" },
    { id: "us", value: "us", label: "United States", icon: "🇺🇸" },
    { id: "jp", value: "jp", label: "日本", icon: "🇯🇵" },
    { id: "cn", value: "cn", label: "中国", icon: "🇨🇳" },
    { id: "gb", value: "gb", label: "United Kingdom", icon: "🇬🇧" },
    { id: "ca", value: "ca", label: "Canada", icon: "🇨🇦" },
    { id: "au", value: "au", label: "Australia", icon: "🇦🇺" },
    { id: "de", value: "de", label: "Germany", icon: "🇩🇪" },
    { id: "fr", value: "fr", label: "France", icon: "🇫🇷" },
    { id: "it", value: "it", label: "Italy", icon: "🇮🇹" },
    { id: "es", value: "es", label: "Spain", icon: "🇪🇸" },
    { id: "br", value: "br", label: "Brazil", icon: "🇧🇷" },
    { id: "mx", value: "mx", label: "Mexico", icon: "🇲🇽" },
    { id: "in", value: "in", label: "India", icon: "🇮🇳" },
    { id: "ru", value: "ru", label: "Russia", icon: "🇷🇺" },
  ];

  // ========== 검증 함수 ==========
  /**
   * 이메일 형식 검증 함수
   * @param {string} email - 검증할 이메일 주소
   * @returns {boolean} - 이메일 형식이 올바른지 여부
   */
  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  /**
   * 비밀번호 형식 검증 함수
   * 조건: 영문 소문자 최소 8~ 최대 16자리, 특수문자포함 (!#$%&*@^)
   * @param {string} pwd - 검증할 비밀번호
   * @returns {boolean} - 비밀번호 형식이 올바른지 여부
   */
  const isValidPassword = (pwd) => {
    // 길이 검증: 8자 이상 16자 이하
    if (pwd.length < 8 || pwd.length > 16) return false;
    // 영문 소문자 포함 여부 검증
    if (!/[a-z]/.test(pwd)) return false;
    // 특수문자 포함 여부 검증 (!#$%&*@^)
    if (!/[!#$%&*@^]/.test(pwd)) return false;
    return true;
  };

  // ========== 검증 결과 ==========
  // 이메일 검증
  const isEmailValid = isValidEmail(email.trim());
  const showEmailError = email.trim() !== "" && !isEmailValid; // 에러 메시지 표시 여부

  // 비밀번호 검증
  const isPasswordValid = password.trim() === "" || isValidPassword(password);
  const showPasswordError = password.trim() !== "" && !isPasswordValid; // 에러 메시지 표시 여부

  // 비밀번호 확인 검증
  const isConfirmPasswordValid = confirmPassword.trim() === "" || password === confirmPassword;
  const showConfirmPasswordError = confirmPassword.trim() !== "" && password !== confirmPassword; // 에러 메시지 표시 여부

  // 인증번호 검증
  const isVerificationCodeValid = isVerificationCodeVerified;
  const showVerificationCodeError = 
    verificationCode.trim() !== "" && 
    !isVerificationCodeVerified &&
    !isTimerRunning; // 에러 메시지 표시 여부

  // ========== 완료 버튼 활성화 조건 ==========
  // 모든 필드가 올바르게 입력되었을 때만 버튼 활성화
  const isButtonEnabled =
    isEmailValid && // 이메일 형식 올바름
    isVerificationCodeValid && // 인증번호 확인 완료
    (password.trim() === "" || isPasswordValid) && // 비밀번호가 비어있거나 형식 올바름
    (confirmPassword.trim() === "" || isConfirmPasswordValid) && // 비밀번호 확인이 비어있거나 일치
    nickname.trim() !== "" && // 닉네임 입력됨
    displayLanguage.trim() !== "" && // 표시 언어 선택됨
    nationality.trim() !== "" && // 국적 선택됨
    !isLoading; // 로딩 중이 아닐 때

  // ========== 이벤트 핸들러 ==========
  /**
   * 회원정보 수정 폼 제출 핸들러
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 버튼이 비활성화되어 있으면 제출하지 않음
    if (!isButtonEnabled || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const userData = {
        email: email.trim(),
        nickname: nickname.trim(),
        displayLanguage: displayLanguageValue,
        nationality: nationalityValue,
      };
      
      // 비밀번호가 입력된 경우에만 포함
      if (password.trim() !== "") {
        userData.password = password;
      }
      
      await updateMyInfo(userData);
      
      // 마이페이지로 이동
      navigate("/mypage");
    } catch (err) {
      // 에러 응답 구조: { status, code, message }
      const errorMessage = err.response?.data?.message || err.message || "회원정보 수정에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 이메일 인증 요청 핸들러
   * 인증번호를 받아오고 expiresIn 값에 따라 타이머를 시작합니다.
   */
  const handleVerifyEmail = async () => {
    if (!isEmailValid || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await sendVerificationCode(email.trim());
      
      // 이메일 인증 상태 활성화
      setIsEmailVerified(true);
      // expiresIn 값에 따라 타이머 시작 (기본값 300초)
      const expiresIn = result.expiresIn || 300;
      setTimer(expiresIn);
      setIsTimerRunning(true);
      setIsVerificationCodeVerified(false);
      setVerificationCode("");
    } catch (err) {
      // 에러 응답 구조: { status, code, message }
      const errorMessage = err.response?.data?.message || "인증번호 발송에 실패했습니다.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  /**
   * 인증번호 확인 핸들러
   */
  const handleVerifyCode = useCallback(async () => {
    if (verificationCode.trim() === "" || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      const result = await verifyCode(email.trim(), verificationCode.trim());
      
      // 인증 성공
      if (result.verified) {
        setIsVerificationCodeVerified(true);
        setIsTimerRunning(false);
        setTimer(0);
      } else {
        setError("인증번호가 일치하지 않습니다.");
        setIsVerificationCodeVerified(false);
      }
    } catch (err) {
      // 에러 응답 구조: { status, code, message }
      const errorMessage = err.response?.data?.message || "인증번호가 일치하지 않습니다.";
      setError(errorMessage);
      setIsVerificationCodeVerified(false);
    } finally {
      setIsLoading(false);
    }
  }, [verificationCode, email, isLoading]);

  // ========== 인증번호 자동 확인 ==========
  /**
   * 인증번호 입력 시 자동으로 확인 요청
   */
  useEffect(() => {
    if (verificationCode.trim().length === 6 && isEmailVerified && !isVerificationCodeVerified && !isLoading) {
      const timer = setTimeout(() => {
        handleVerifyCode();
      }, 500); // 0.5초 후 자동 확인
      
      return () => clearTimeout(timer);
    }
  }, [verificationCode, handleVerifyCode, isEmailVerified, isVerificationCodeVerified, isLoading]);

  /**
   * 타이머 카운트다운 효과
   * 1초마다 타이머를 감소시키고, 0이 되면 자동으로 중지합니다.
   */
  useEffect(() => {
    let interval = null;
    
    // 타이머가 실행 중이고 남은 시간이 있을 때만 카운트다운
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          // 타이머가 1초 이하가 되면 중지
          if (prevTimer <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          // 1초씩 감소
          return prevTimer - 1;
        });
      }, 1000); // 1초마다 실행
    } else if (timer === 0) {
      // 타이머가 0이 되면 실행 상태를 false로 변경
      setIsTimerRunning(false);
    }
    
    // 컴포넌트 언마운트 시 또는 의존성 변경 시 interval 정리
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, timer]);

  /**
   * 타이머 포맷팅 함수
   * 초 단위를 MM:SS 형식으로 변환합니다.
   * @param {number} seconds - 초 단위 시간
   * @returns {string} - MM:SS 형식의 문자열
   */
  const formatTimer = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  // ========== 렌더링 ==========
  return (
    <S.Container>
      {/* 헤더: 뒤로가기 버튼, 제목 */}
      <S.Header>
        <S.BackButton type="button" onClick={() => navigate(-1)}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M15 18L9 12L15 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </S.BackButton>
        <S.Title>{t("editMyInfo")}</S.Title>
        <S.HeaderSpacer />
      </S.Header>

      {/* 안내 문구 */}
      <S.Subtitle>{t("enterMemberInfo")}</S.Subtitle>

      {/* 회원정보 수정 폼 */}
      <S.Form onSubmit={handleSubmit}>
        {/* 이메일 입력 및 인증받기 버튼 */}
        <S.InputRow>
          <S.InputWrapper>
            <S.Input
              type="email"
              placeholder={t("email")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $hasError={showEmailError}
            />
            {/* 이메일 형식 에러 메시지 */}
            {showEmailError && (
              <S.ErrorMessage>{t("invalidEmailFormat")}</S.ErrorMessage>
            )}
          </S.InputWrapper>
          {/* 인증받기/재전송 버튼 */}
          <S.VerifyButton
            type="button"
            onClick={handleVerifyEmail}
            disabled={!isEmailValid}
            $isEnabled={isEmailValid}
          >
            {isTimerRunning && timer > 0 ? t("resend") : t("verifyEmail")}
          </S.VerifyButton>
        </S.InputRow>

        {/* 인증번호 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type="text"
            placeholder={t("enterVerificationCode")}
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            disabled={!isEmailVerified || isLoading}
            $hasError={showVerificationCodeError}
            maxLength={6}
          />
          {/* 인증번호가 올바르면 초록색 체크 표시, 아니면 타이머 표시 */}
          {isVerificationCodeValid ? (
            <S.CheckIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"
                  fill="#34C759"
                />
              </svg>
            </S.CheckIcon>
          ) : (
            // 타이머가 실행 중일 때만 타이머 표시
            isTimerRunning && timer > 0 && (
              <S.TimerText>{formatTimer(timer)}</S.TimerText>
            )
          )}
          {/* 인증번호 불일치 에러 메시지 */}
          {showVerificationCodeError && (
            <S.ErrorMessage>{t("invalidVerificationCode")}</S.ErrorMessage>
          )}
        </S.InputWrapper>
        
        {/* 에러 메시지 */}
        {error && <S.ErrorMessage style={{ marginTop: "8px", textAlign: "center" }}>{error}</S.ErrorMessage>}

        {/* 비밀번호 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type={showPassword ? "text" : "password"}
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            $hasError={showPasswordError}
          />
          {/* 비밀번호 표시/숨김 토글 버튼 */}
          <S.PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showPassword ? (
                // 비밀번호가 표시 중일 때: 눈 아이콘
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              ) : (
                // 비밀번호가 숨김 중일 때: 눈에 슬래시 아이콘
                <>
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="currentColor"
                  />
                </>
              )}
            </svg>
          </S.PasswordToggle>
          {/* 비밀번호 에러 메시지 또는 힌트 표시 */}
          {showPasswordError ? (
            <S.ErrorMessage>{t("invalidPasswordFormat")}</S.ErrorMessage>
          ) : (
            <S.PasswordHint>
              영문 소문자 최소 8 ~ 최대 16자리, 특수문자포함 ( ! # $ % & * @ ^ )
            </S.PasswordHint>
          )}
        </S.InputWrapper>

        {/* 비밀번호 확인 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type={showConfirmPassword ? "text" : "password"}
            placeholder={t("confirmPassword")}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            $hasError={showConfirmPasswordError}
          />
          {/* 비밀번호 확인 표시/숨김 토글 버튼 */}
          <S.PasswordToggle
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showConfirmPassword ? (
                // 비밀번호가 표시 중일 때: 눈 아이콘
                <path
                  d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"
                  fill="currentColor"
                />
              ) : (
                // 비밀번호가 숨김 중일 때: 눈에 슬래시 아이콘
                <>
                  <path
                    d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"
                    fill="currentColor"
                  />
                </>
              )}
            </svg>
          </S.PasswordToggle>
          {/* 비밀번호 불일치 에러 메시지 */}
          {showConfirmPasswordError && (
            <S.ErrorMessage>{t("passwordMismatch")}</S.ErrorMessage>
          )}
        </S.InputWrapper>

        {/* 닉네임 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type="text"
            placeholder={t("nickname")}
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </S.InputWrapper>

        {/* 표시 언어 선택 필드 */}
        <S.LanguageFieldWrapper>
          <S.Field ref={languageFieldRef} onClick={() => setIsLanguageModalOpen(true)}>
            <S.FieldIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="29" height="19">
                <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z" fill="#3D3D3D"/>
              </svg>
            </S.FieldIcon>
            <S.FieldLabel>
              {displayLanguage || t("displayLanguage")}
            </S.FieldLabel>
          </S.Field>
        </S.LanguageFieldWrapper>

        {/* 국적 선택 필드 */}
        <S.NationalityFieldWrapper>
          <S.Field ref={nationalityFieldRef} onClick={() => setIsNationalityModalOpen(true)}>
            <S.FieldIcon>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" width="29" height="29">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="#3D3D3D"/>
              </svg>
            </S.FieldIcon>
            <S.FieldLabel>
              {nationality || t("nationality")}
            </S.FieldLabel>
          </S.Field>
        </S.NationalityFieldWrapper>
      </S.Form>

      {/* 개인정보 동의 문구 */}
      <S.AgreementText>{t("agreement")}</S.AgreementText>

      {/* 회원정보 수정 완료 버튼 */}
      <S.SubmitButton type="submit" disabled={!isButtonEnabled} $isEnabled={isButtonEnabled} onClick={handleSubmit}>
        {isLoading ? t("processing") : t("complete")}
      </S.SubmitButton>

      {/* 언어 선택 모달 */}
      <SidebarModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        options={languageOptions}
        selectedValue={displayLanguageValue}
        onSelect={(option) => {
          setDisplayLanguage(option.label);
          setDisplayLanguageValue(option.value);
          // 선택한 언어로 서비스 언어 즉시 변경
          changeLanguage(option.value);
        }}
        triggerRef={languageFieldRef}
      />
      
      {/* 국적 선택 모달 */}
      <SidebarModal
        isOpen={isNationalityModalOpen}
        onClose={() => setIsNationalityModalOpen(false)}
        options={nationalityOptions}
        selectedValue={nationalityValue}
        onSelect={(option) => {
          setNationality(option.label);
          setNationalityValue(option.value);
        }}
        triggerRef={nationalityFieldRef}
      />
    </S.Container>
  );
}

