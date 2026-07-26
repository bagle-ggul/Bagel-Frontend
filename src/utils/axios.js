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

// 401은 토큰 만료로 간주해 정리 후 홈으로 보낸다.
// 로그인은 별도 라우트가 아니라 홈의 모달로 처리되므로 "/"가 목적지다.
// (이전에는 존재하지 않는 "/login"으로 보내고 있었다)
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearTokens();
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
