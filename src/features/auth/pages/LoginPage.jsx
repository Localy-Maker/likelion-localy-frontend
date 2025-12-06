import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "@/shared/components/Logo";
import * as S from "../styles/LoginPage.styles";
import { login, getGoogleClientId, googleLogin } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const googleClientIdRef = useRef(null);
  const googleButtonRef = useRef(null);

  const isButtonEnabled = email.trim() !== "" && password.trim() !== "" && !isLoading;

  // Google 로그인 콜백
  const handleGoogleCallback = useCallback(async (response) => {
    if (response.credential) {
      try {
        setIsLoading(true);
        setError("");
        const result = await googleLogin(response.credential);
        // 백엔드에서 onboardingCompleted 필드로 온보딩 완료 여부 확인
        // onboardingCompleted가 false이면 온보딩으로, true이면 메인으로 이동
        if (result.onboardingCompleted === false) {
          // 온보딩 미완료 사용자는 온보딩으로 이동
          navigate("/onboarding");
        } else {
          // 온보딩 완료 사용자는 메인으로 이동
          navigate("/main");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Google 로그인에 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    } else {
      setError("Google 로그인에 실패했습니다.");
    }
  }, [navigate]);

  // Google 클라이언트 ID 가져오기 및 초기화
  useEffect(() => {
    const initGoogleSignIn = async () => {
      try {
        const clientId = await getGoogleClientId();
        googleClientIdRef.current = clientId;

        // Google Sign-In 스크립트가 로드될 때까지 대기
        const checkGoogleScript = setInterval(() => {
          if (window.google?.accounts?.id) {
            clearInterval(checkGoogleScript);
            
            // Google Sign-In 초기화
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: handleGoogleCallback,
            });

            // One Tap 자동 표시 (선택사항)
            // window.google.accounts.id.prompt();
          }
        }, 100);

        // 10초 후에도 스크립트가 로드되지 않으면 타임아웃
        setTimeout(() => {
          clearInterval(checkGoogleScript);
        }, 10000);
      } catch (err) {
        console.error("Google 클라이언트 ID 가져오기 실패:", err);
      }
    };

    initGoogleSignIn();
  }, [handleGoogleCallback]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isButtonEnabled) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await login(email.trim(), password);
      navigate("/main");
    } catch (err) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 구글 로그인 핸들러
   * Google Sign-In 버튼 클릭 시 실행
   */
  const handleGoogleLogin = () => {
    if (!googleClientIdRef.current) {
      setError("Google 로그인을 초기화하는 중입니다. 잠시 후 다시 시도해주세요.");
      return;
    }

    if (!window.google?.accounts?.id) {
      setError("Google 로그인 스크립트가 로드되지 않았습니다.");
      return;
    }

    setIsLoading(true);
    setError("");

    // Google Sign-In 팝업 열기 (One Tap 시도)
    window.google.accounts.id.prompt((notification) => {
      // One Tap이 표시되지 않거나 스킵된 경우
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // 숨겨진 버튼을 렌더링하여 클릭 이벤트 트리거
        const hiddenButton = document.createElement("div");
        hiddenButton.style.display = "none";
        document.body.appendChild(hiddenButton);
        
        window.google.accounts.id.renderButton(hiddenButton, {
          theme: "outline",
          size: "large",
          type: "standard",
          text: "signin_with",
        });

        // 버튼 클릭 시뮬레이션
        setTimeout(() => {
          const button = hiddenButton.querySelector("div[role='button']");
          if (button) {
            button.click();
          } else {
            setError("Google 로그인을 시작할 수 없습니다. 페이지를 새로고침해주세요.");
            setIsLoading(false);
          }
        }, 100);
      } else if (notification.isDismissedMoment()) {
        setIsLoading(false);
      }
    });
  };

  return (
    <S.Container>
      <S.LogoWrapper>
        <Logo />
      </S.LogoWrapper>
      <S.Title>로그인</S.Title>
      <S.SignupLink>
        신규 사용자이신가요? <Link to="/signup">회원가입하기</Link>
      </S.SignupLink>
      
      <S.Form onSubmit={handleSubmit}>
        <S.InputWrapper>
          <S.Input
            type="email"
            placeholder="이메일(아이디)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </S.InputWrapper>
        
        <S.InputWrapper>
          <S.Input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <S.PasswordToggle
            type="button"
            onClick={() => setShowPassword(!showPassword)}
          >
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              {showPassword ? (
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" fill="currentColor"/>
              ) : (
                <>
                  <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" fill="currentColor"/>
                </>
              )}
            </svg>
          </S.PasswordToggle>
        </S.InputWrapper>
        
        <S.LoginButton type="submit" disabled={!isButtonEnabled} $isEnabled={isButtonEnabled}>
          {isLoading ? "로그인 중..." : "로그인"}
        </S.LoginButton>
      </S.Form>
      
      {error && (
        <S.ErrorMessage style={{ marginTop: "8px", textAlign: "center", color: "#FF3B30" }}>
          {error}
        </S.ErrorMessage>
      )}
      
      <S.Divider>
        <span>or</span>
      </S.Divider>
      
      <S.GoogleButton type="button" onClick={handleGoogleLogin} disabled={isLoading} ref={googleButtonRef}>
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19.6 10.2273C19.6 9.51818 19.5364 8.83636 19.4182 8.18182H10V12.05H15.3818C15.15 13.3 14.4455 14.3591 13.3864 15.0682V17.5773H16.6182C18.5091 15.8364 19.6 13.2727 19.6 10.2273Z" fill="#4285F4"/>
          <path d="M10 20C12.7 20 14.9636 19.1045 16.6182 17.5773L13.3864 15.0682C12.4909 15.6682 11.3455 16.0227 10 16.0227C7.39545 16.0227 5.19091 14.2636 4.40455 11.9H1.06364V14.4909C2.70909 17.7591 6.09091 20 10 20Z" fill="#34A853"/>
          <path d="M4.40455 11.9C4.20455 11.3 4.09091 10.6591 4.09091 10C4.09091 9.34091 4.20455 8.7 4.40455 8.1V5.50909H1.06364C0.386364 6.85909 0 8.38636 0 10C0 11.6136 0.386364 13.1409 1.06364 14.4909L4.40455 11.9Z" fill="#FBBC05"/>
          <path d="M10 3.97727C11.4682 3.97727 12.7864 4.48182 13.8182 5.37273L16.6909 2.5C14.9591 0.909091 12.6955 0 10 0C6.09091 0 2.70909 2.24091 1.06364 5.50909L4.40455 8.1C5.19091 5.73636 7.39545 3.97727 10 3.97727Z" fill="#EB4335"/>
        </svg>
        <span>Google로 시작하기</span>
      </S.GoogleButton>
      
      <S.FindPasswordLink>
        비밀번호를 잊으셨나요? <Link to="/find-password">비밀번호찾기</Link>
      </S.FindPasswordLink>
    </S.Container>
  );
}

