/**
 * 원시 토큰 (primitive tokens)
 *
 * 값 그 자체다. **컴포넌트에서 직접 쓰지 않는다.**
 * 여기 있는 값은 "무엇인지"만 말하고 "언제 쓰는지"는 말하지 않는다.
 * 용도는 semantic.js가 정한다.
 */

/** 팔레트 원색 */
export const palette = {
  // 브랜드 — 연보라
  lilac90: "rgba(200, 182, 226, 0.9)",
  lilac100: "rgba(200, 182, 226, 1)",
  lilac50: "rgba(200, 182, 226, 0.5)",
  lilac30: "rgba(200, 182, 226, 0.3)",
  lilac20: "rgba(200, 182, 226, 0.2)",

  // 중립 — 흰색 계열 (어두운 배경 위에서 쓴다)
  white: "#ffffff",
  white70: "rgba(255, 255, 255, 0.7)",
  white60: "rgba(255, 255, 255, 0.6)",
  white30: "rgba(255, 255, 255, 0.3)",
  white15: "rgba(255, 255, 255, 0.15)",
  white10: "rgba(255, 255, 255, 0.1)",

  // 중립 — 검정 계열
  black60: "rgba(0, 0, 0, 0.6)",
  black50: "rgba(0, 0, 0, 0.5)",
  black40: "rgba(0, 0, 0, 0.4)",
  black30: "rgba(0, 0, 0, 0.3)",

  // 상태
  red90: "rgba(220, 53, 69, 0.9)",
  red30: "rgba(220, 53, 69, 0.3)",
  red10: "rgba(220, 53, 69, 0.1)",
  amber90: "rgba(255, 193, 7, 0.9)",
  green90: "rgba(40, 167, 69, 0.9)",

  // 순위
  gold: "#FFD700",
  silver: "#C0C0C0",
  bronze: "#CD7F32",
};

/** 간격 스케일 */
export const spacing = {
  xs: "0.25rem",
  sm: "0.5rem",
  md: "0.8rem",
  lg: "1.2rem",
  xl: "2rem",
  xxl: "3rem",
};

/** 모서리 반경 */
export const radius = {
  sm: "8px",
  md: "12px",
  lg: "20px",
  pill: "999px",
};

/** 그림자 */
export const shadow = {
  card: "0 8px 32px 0 rgba(0, 0, 0, 0.5)",
  cardHover: "0 12px 40px rgba(0, 0, 0, 0.6)",
  button: "0 4px 12px rgba(0, 0, 0, 0.3)",
  buttonHover: "0 6px 20px rgba(200, 182, 226, 0.3)",
  subtle: "0 4px 15px rgba(200, 182, 226, 0.15)",
};

/** 흐림 강도 (글라스모피즘) */
export const blur = {
  card: "blur(15px)",
  subtle: "blur(10px)",
};

/** 전환 */
export const transition = {
  fast: "all 0.3s ease",
  smooth: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
};

const tokens = { palette, spacing, radius, shadow, blur, transition };

export default tokens;
