/**
 * 로깅 유틸리티
 *
 * 개발 환경에서만 출력하고 프로덕션에서는 조용히 무시한다.
 * 디버그 로그가 배포본에 그대로 나가는 것을 막기 위함이다.
 * 단, error는 장애 추적에 필요하므로 환경과 무관하게 항상 출력한다.
 *
 * 인증(auth.js)에서 분리한 이유: 로깅은 인증의 책임이 아니다.
 */
const isDev = process.env.NODE_ENV === "development";
const noop = () => {};

export const logger = {
  log: isDev ? console.log : noop,
  warn: isDev ? console.warn : noop,
  info: isDev ? console.info : noop,
  debug: isDev ? console.debug : noop,
  error: console.error,
};

export default logger;
