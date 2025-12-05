import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import Logo from "@/shared/components/Logo";
import * as S from "../styles/LoginPage.styles";
import { login, googleLogin, getGoogleClientId } from "../api/authApi";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [googleClientId, setGoogleClientId] = useState(null);

  const isButtonEnabled = email.trim() !== "" && password.trim() !== "";

  /**
   * 기본 로그인 핸들러
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isButtonEnabled || isLoading) return;
    
    setIsLoading(true);
    setError("");
    
    try {
      await login(email, password);
      // 로그인 성공 시 온보딩 페이지로 이동 (또는 메인 페이지)
      navigate("/onboarding");
    } catch (err) {
      setError(err.response?.data?.message || "로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * 백엔드에서 Google 클라이언트 ID 가져오기 및 초기화
   */
  useEffect(() => {
    const fetchClientId = async () => {
      try {
        const clientId = await getGoogleClientId();
        setGoogleClientId(clientId);
        
        // Google Identity Services가 로드될 때까지 대기
        const checkGoogle = setInterval(() => {
          if (window.google?.accounts?.id) {
            // Google 로그인 초기화
            window.google.accounts.id.initialize({
              client_id: clientId,
              callback: async (response) => {
                if (response.credential) {
                  setIsLoading(true);
                  setError("");
                  try {
                    await googleLogin(response.credential);
                    navigate("/main");
                  } catch (err) {
                    const errorMessage = err.response?.data?.message || err.message || "구글 로그인에 실패했습니다.";
                    setError(errorMessage);
                    setIsLoading(false);
                  }
                }
              },
            });
            clearInterval(checkGoogle);
          }
        }, 100);

        return () => clearInterval(checkGoogle);
      } catch (err) {
        console.error("Google 클라이언트 ID를 가져오는데 실패했습니다:", err);
        // 백엔드 API가 없을 경우 환경 변수에서 가져오기 (fallback)
        const envClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (envClientId && envClientId !== "your-google-client-id-here") {
          setGoogleClientId(envClientId);
          const checkGoogle = setInterval(() => {
            if (window.google?.accounts?.id) {
              window.google.accounts.id.initialize({
                client_id: envClientId,
                callback: async (response) => {
                  if (response.credential) {
                    setIsLoading(true);
                    setError("");
                    try {
                      await googleLogin(response.credential);
                      navigate("/main");
                    } catch (err) {
                      const errorMessage = err.response?.data?.message || err.message || "구글 로그인에 실패했습니다.";
                      setError(errorMessage);
                      setIsLoading(false);
                    }
                  }
                },
              });
              clearInterval(checkGoogle);
            }
          }, 100);
          return () => clearInterval(checkGoogle);
        }
      }
    };

    fetchClientId();
  }, [navigate]);

  /**
   * 구글 로그인 버튼 클릭 핸들러
   * Google Identity Services의 로그인 플로우를 시작합니다.
   */
  const handleGoogleLogin = () => {
    if (isLoading) return;
    
    const clientId = googleClientId;
    
    if (!clientId) {
      setError("Google 클라이언트 ID를 불러오는 중입니다.\n잠시 후 다시 시도해주세요.");
      return;
    }

    // Google Identity Services가 로드되었는지 확인
    if (!window.google?.accounts?.id) {
      setError("Google 로그인 서비스를 불러올 수 없습니다. 페이지를 새로고침해주세요.");
      return;
    }

    // Google 로그인 플로우 시작 (팝업 또는 One Tap)
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // One Tap이 표시되지 않으면 수동으로 로그인 요청
        // 이 경우 사용자가 버튼을 클릭했으므로 로그인 플로우를 계속 진행
        // callback은 이미 useEffect에서 설정되어 있음
        setIsLoading(true);
        setError("");
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
        
        {error && <S.ErrorMessage>{error}</S.ErrorMessage>}
        <S.LoginButton type="submit" disabled={!isButtonEnabled || isLoading} $isEnabled={isButtonEnabled && !isLoading}>
          {isLoading ? "로그인 중..." : "로그인"}
        </S.LoginButton>
      </S.Form>
      
      <S.Divider>
        <span>or</span>
      </S.Divider>
      
      <S.GoogleButton type="button" onClick={handleGoogleLogin}>
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

