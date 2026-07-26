// 인증 관련 유틸리티 함수들

export const AUTH_TOKENS = {
  ACCESS_TOKEN: "accessToken",
  REFRESH_TOKEN: "refreshToken",
};

/**
 * 액세스 토큰 가져오기
 * @returns {string|null} 액세스 토큰
 */
export const getAccessToken = () => {
  return localStorage.getItem(AUTH_TOKENS.ACCESS_TOKEN);
};

/**
 * 리프레시 토큰 가져오기
 * @returns {string|null} 리프레시 토큰
 */
export const getRefreshToken = () => {
  return localStorage.getItem(AUTH_TOKENS.REFRESH_TOKEN);
};

/**
 * 현재 프로젝트에서 주로 사용하는 토큰 가져오기
 * (API 요청에 사용되는 토큰)
 * @returns {string|null} 토큰
 */
export const getAuthToken = () => {
  // 현재 프로젝트에서는 refreshToken을 주로 사용
  return getRefreshToken();
};

/**
 * 액세스 토큰 설정
 * @param {string} token 토큰 값
 */
export const setAccessToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKENS.ACCESS_TOKEN, token);
  } else {
    localStorage.removeItem(AUTH_TOKENS.ACCESS_TOKEN);
  }
};

/**
 * 리프레시 토큰 설정
 * @param {string} token 토큰 값
 */
export const setRefreshToken = (token) => {
  if (token) {
    localStorage.setItem(AUTH_TOKENS.REFRESH_TOKEN, token);
  } else {
    localStorage.removeItem(AUTH_TOKENS.REFRESH_TOKEN);
  }
};

/**
 * 모든 토큰 제거 (로그아웃)
 */
export const clearTokens = () => {
  localStorage.removeItem(AUTH_TOKENS.ACCESS_TOKEN);
  localStorage.removeItem(AUTH_TOKENS.REFRESH_TOKEN);
};

/**
 * 토큰 존재 여부 확인
 * @returns {boolean} 토큰 존재 여부
 */
export const hasAuthToken = () => {
  return !!getAuthToken();
};

/**
 * 사용자 인증 상태 확인
 * @returns {boolean} 인증 상태
 */
export const isAuthenticated = () => {
  const token = getAuthToken();
  return !!token;
};

/**
 * Authorization 헤더 생성
 * @returns {Object|null} Authorization 헤더 객체
 */
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : null;
};

/**
 * API 요청용 헤더 생성 (Authorization 포함)
 * @param {Object} additionalHeaders 추가 헤더
 * @returns {Object} 완성된 헤더 객체
 */
export const createApiHeaders = (additionalHeaders = {}) => {
  const authHeaders = getAuthHeaders();
  return {
    "Content-Type": "application/json",
    ...authHeaders,
    ...additionalHeaders,
  };
};

// 로깅 유틸리티 (개발 환경에서만 동작)
export const logger = {
  log: process.env.NODE_ENV === "development" ? console.log : () => {},
  warn: process.env.NODE_ENV === "development" ? console.warn : () => {},
  error: console.error, // 에러는 항상 로깅
  info: process.env.NODE_ENV === "development" ? console.info : () => {},
  debug: process.env.NODE_ENV === "development" ? console.debug : () => {},
};

export default {
  AUTH_TOKENS,
  getAccessToken,
  getRefreshToken,
  getAuthToken,
  setAccessToken,
  setRefreshToken,
  clearTokens,
  hasAuthToken,
  isAuthenticated,
  getAuthHeaders,
  createApiHeaders,
  logger,
};
