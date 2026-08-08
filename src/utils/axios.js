import axios from "axios";

import { clearTokens, getAuthToken } from "./auth";

// 환경변수가 없어도 동작해야 하므로 기존 운영 주소로 폴백한다.
// 배포 파이프라인에 .env 주입이 추가되기 전까지의 안전장치다.
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "https://api.bagel.suhsaechan.kr";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// 요청마다 토큰을 자동 주입한다.
// 이전에는 저장되지 않는 키(authToken)를 읽어 인터셉터가 사실상 죽어 있었고,
// 그래서 모든 호출부가 Authorization 헤더를 수동으로 붙이고 있었다.
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * 인증 실패로 간주하는 상태 코드.
 *
 * 401뿐 아니라 403을 포함하는 이유: 이 서버는 잘못된/만료된 토큰에 **403을 반환한다**
 * (실측 확인). 401만 처리하면 토큰이 만료돼도 자동 로그아웃이 되지 않아,
 * 사용자가 계속 실패하는 화면만 보게 된다.
 *
 * 403을 인증 실패로 묶어도 안전한 이유: 이 프로젝트에는 사용자별 권한 구분이 없다.
 * 권한 체계가 생기면 "인증됐지만 권한 없음"과 구분해야 하므로 이 판단을 재검토해야 한다.
 */
const AUTH_FAILURE_STATUS = [401, 403];

// 로그인은 별도 라우트가 아니라 홈의 모달로 처리되므로 "/"가 목적지다.
// (이전에는 존재하지 않는 "/login"으로 보내고 있었다)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // 토큰이 없으면 이미 로그아웃 상태다.
    // 이때도 이동시키면 홈에서 실패한 요청이 홈으로 리다이렉트를 반복한다.
    if (AUTH_FAILURE_STATUS.includes(status) && getAuthToken()) {
      clearTokens();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
