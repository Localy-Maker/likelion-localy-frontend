import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router";
import Logo from "@/shared/components/Logo";
import * as S from "../styles/SignupPage.styles";
import { sendVerificationCode, verifyCode, signup } from "../api/authApi";

/**
 * 회원가입 페이지 컴포넌트
 * 사용자 회원가입을 위한 폼을 제공하며, 이메일 인증, 비밀번호 검증 등의 기능을 포함합니다.
 */
export default function SignupPage() {
  const navigate = useNavigate();

  // ========== 상태 관리 ==========
  // 사용자 입력 필드
  const [email, setEmail] = useState(""); // 이메일 입력값
  const [verificationCode, setVerificationCode] = useState(""); // 인증번호 입력값
  const [password, setPassword] = useState(""); // 비밀번호 입력값
  const [confirmPassword, setConfirmPassword] = useState(""); // 비밀번호 확인 입력값
  const [nickname, setNickname] = useState(""); // 닉네임 입력값

  // UI 상태
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김 토글
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 비밀번호 확인 표시/숨김 토글
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 완료 여부

  // 인증번호 타이머 관련 상태
  const [timer, setTimer] = useState(0); // 타이머 초 단위 (5분 = 300초)
  const [isTimerRunning, setIsTimerRunning] = useState(false); // 타이머 실행 여부
  const [isVerificationCodeVerified, setIsVerificationCodeVerified] = useState(false); // 인증번호 확인 완료 여부
  
  // API 호출 상태
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
  const isPasswordValid = isValidPassword(password);
  const showPasswordError = password.trim() !== "" && !isPasswordValid; // 에러 메시지 표시 여부

  // 비밀번호 확인 검증
  const isConfirmPasswordValid = confirmPassword.trim() !== "" && password === confirmPassword;
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
    isPasswordValid && // 비밀번호 형식 올바름
    isConfirmPasswordValid && // 비밀번호 확인 일치
    nickname.trim() !== "" && // 닉네임 입력됨
    !isLoading; // 로딩 중이 아닐 때

  // ========== 이벤트 핸들러 ==========
  /**
   * 회원가입 폼 제출 핸들러
   * @param {Event} e - 폼 제출 이벤트
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    // 버튼이 비활성화되어 있으면 제출하지 않음
    if (!isButtonEnabled || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await signup({
        email: email.trim(),
        password,
        confirmPassword,
        nickname: nickname.trim(),
      });
      
      // 회원가입 성공 시 메인 페이지로 이동
      navigate("/main");
    } catch (err) {
      // 에러 응답 구조: BaseResponse 또는 CustomException
      const errorMessage = err.response?.data?.message || err.message || "회원가입에 실패했습니다.";
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
      // 에러 응답 구조 확인 및 로깅
      console.error("이메일 인증 요청 실패:", err);
      console.error("에러 응답:", err.response?.data);
      console.error("에러 상태 코드:", err.response?.status);
      
      // 에러 메시지 추출
      let errorMessage = "인증번호 발송에 실패했습니다.";
      
      if (err.response) {
        // 서버 응답이 있는 경우
        const status = err.response.status;
        const data = err.response.data;
        
        if (status === 500) {
          errorMessage = data?.message || "서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
        } else if (status === 400) {
          errorMessage = data?.message || "잘못된 요청입니다. 이메일을 확인해주세요.";
        } else if (status === 409) {
          errorMessage = data?.message || "이미 사용 중인 이메일입니다.";
        } else {
          errorMessage = data?.message || `요청 처리 중 오류가 발생했습니다. (${status})`;
        }
      } else if (err.request) {
        // 요청은 보냈지만 응답을 받지 못한 경우
        errorMessage = "서버에 연결할 수 없습니다. 네트워크를 확인해주세요.";
      } else {
        // 요청 설정 중 오류가 발생한 경우
        errorMessage = err.message || "요청 처리 중 오류가 발생했습니다.";
      }
      
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
        <S.Title>회원가입</S.Title>
        <S.HeaderSpacer />
      </S.Header>

      {/* 안내 문구 */}
      <S.Subtitle>회원정보를 입력해주세요</S.Subtitle>

      {/* 회원가입 폼 */}
      <S.Form onSubmit={handleSubmit}>
        {/* 이메일 입력 및 인증받기 버튼 */}
        <S.InputRow>
          <S.InputWrapper>
            <S.Input
              type="email"
              placeholder="이메일(아이디)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              $hasError={showEmailError}
            />
            {/* 이메일 형식 에러 메시지 */}
            {showEmailError && (
              <S.ErrorMessage>올바른 이메일 형식이 아닙니다.</S.ErrorMessage>
            )}
          </S.InputWrapper>
          {/* 인증받기/재전송 버튼 */}
          <S.VerifyButton
            type="button"
            onClick={handleVerifyEmail}
            disabled={!isEmailValid}
            $isEnabled={isEmailValid}
          >
            {isTimerRunning && timer > 0 ? "재전송" : "인증받기"}
          </S.VerifyButton>
        </S.InputRow>

        {/* 인증번호 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type="text"
            placeholder="인증번호 입력"
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
            <S.ErrorMessage>인증번호가 일치하지 않습니다.</S.ErrorMessage>
          )}
        </S.InputWrapper>
        
        {/* 에러 메시지 */}
        {error && <S.ErrorMessage style={{ marginTop: "8px", textAlign: "center" }}>{error}</S.ErrorMessage>}

        {/* 비밀번호 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
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
            <S.ErrorMessage>비밀번호 형식이 올바르지 않습니다.</S.ErrorMessage>
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
            placeholder="비밀번호 재입력"
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
            <S.ErrorMessage>비밀번호가 일치하지 않습니다.</S.ErrorMessage>
          )}
        </S.InputWrapper>

        {/* 닉네임 입력 필드 */}
        <S.InputWrapper>
          <S.Input
            type="text"
            placeholder="닉네임"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </S.InputWrapper>
      </S.Form>

      {/* 개인정보 동의 문구 */}
      <S.AgreementText>개인정보 및 위치 제공에 동의합니다.</S.AgreementText>

      {/* 회원가입 완료 버튼 */}
      <S.SubmitButton type="submit" disabled={!isButtonEnabled} $isEnabled={isButtonEnabled} onClick={handleSubmit}>
        {isLoading ? "처리 중..." : "완료"}
      </S.SubmitButton>
    </S.Container>
  );
}
