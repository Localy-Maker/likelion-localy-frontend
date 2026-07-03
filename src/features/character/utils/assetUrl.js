import { API_BASE_URL } from "@/shared/api/client";

/**
 * 서버가 내려주는 이미지 URL 을 렌더 가능한 절대 URL 로 변환한다.
 *
 * 백엔드(Localy_BE)는 `app.assets.base-url` 환경값에 따라 이미지 URL 을
 * 절대 URL(S3 등) 또는 상대 경로(`/images/characters/happy.svg`)로 내려줄 수 있다.
 *   - ShopDataInitializer.img() = assetsBaseUrl + "/images/" + path
 *   - 정적 리소스는 백엔드 자체에서도 /images/... 로 서빙됨(src/main/resources/static/images)
 * 어느 설정이든 안전하게 동작하도록:
 *   - 이미 http(s) 로 시작하는 절대 URL 이면 그대로 사용
 *   - 아니면 API_BASE_URL 을 접두어로 붙여 절대 URL 로 만든다
 *
 * ponytail: 절대/상대 두 케이스만 처리. 실제 어떤 값이 오는지는 BE 복구 후 확인 필요.
 */
export const resolveAssetUrl = (url) => {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
};
