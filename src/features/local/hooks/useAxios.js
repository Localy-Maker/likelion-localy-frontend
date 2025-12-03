import axios from 'axios';

/**
 * API 클라이언트 설정
 * 단일 책임: axios 인스턴스 설정 및 인터셉터 관리
 */
const apiClient = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터: 토큰 자동 추가
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터: 에러 처리
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response) {
            // 서버 응답이 있는 경우
            const { status, data } = error.response;

            if (status === 401) {
                // 인증 오류 처리
                console.error('인증 오류:', data.message);
                // 필요시 로그인 페이지로 리다이렉트
            }

            return Promise.reject(new Error(data.message || '요청이 실패했습니다.'));
        } else if (error.request) {
            // 요청은 보냈지만 응답이 없는 경우
            return Promise.reject(new Error('서버로부터 응답이 없습니다.'));
        } else {
            // 요청 설정 중 오류 발생
            return Promise.reject(new Error('요청 중 오류가 발생했습니다.'));
        }
    }
);

export default apiClient;

