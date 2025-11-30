/**
 * Google OAuth 로그인 초기화
 * Google Identity Services가 로드되면 초기화합니다.
 */
export const initializeGoogleAuth = (clientId) => {
  if (window.google?.accounts?.id) {
    window.google.accounts.id.initialize({
      client_id: clientId,
    });
  }
};

