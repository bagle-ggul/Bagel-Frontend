import { blur, palette, radius, shadow, transition } from "./tokens";

/**
 * 의미 토큰 (semantic tokens)
 *
 * **컴포넌트는 이것만 참조한다.** 원시 토큰(tokens.js)을 직접 쓰지 않는다.
 *
 * 이름이 "언제 쓰는지"를 말한다. `palette.lilac90`은 무슨 색인지만 알려주지만
 * `action.primary`는 어디에 써야 하는지 알려준다. 그래야 새 컴포넌트를 만들 때
 * 눈대중으로 색을 고르지 않게 된다.
 */

/** 표면 — 배경으로 깔리는 것 */
export const surface = {
  glass: palette.black40,
  glassHover: palette.black50,
  raised: palette.white10,
  raisedHover: palette.white15,
};

/** 텍스트 */
export const text = {
  primary: palette.white,
  secondary: palette.white70,
  tertiary: palette.white60,
  accent: palette.lilac90,
  onAction: palette.white,
};

/** 테두리 */
export const border = {
  subtle: palette.white15,
  accent: palette.lilac30,
  accentStrong: palette.lilac50,
  danger: palette.red30,
};

/** 액션 — 버튼처럼 누를 수 있는 것 */
export const action = {
  primary: palette.lilac90,
  primaryHover: palette.lilac100,
  secondary: palette.white15,
  secondaryHover: palette.lilac30,
};

/** 피드백 — 상태 알림 */
export const feedback = {
  error: palette.red90,
  errorSurface: palette.red10,
  errorBorder: palette.red30,
  warning: palette.amber90,
  success: palette.green90,
};

/** 순위 표시 */
export const rank = {
  first: palette.gold,
  second: palette.silver,
  third: palette.bronze,
};

/**
 * 이 프로젝트의 시각적 정체성.
 * 카드·모달의 기본 표면 처리다.
 */
export const glass = {
  background: surface.glass,
  backdropFilter: blur.card,
  border: `1px solid ${border.subtle}`,
  boxShadow: shadow.card,
  borderRadius: radius.lg,
};

export const glassHover = {
  background: surface.glassHover,
  borderColor: border.accent,
  boxShadow: `${shadow.cardHover}, 0 0 0 1px ${palette.lilac20}, inset 0 1px 0 ${palette.white10}`,
  transform: "translateY(-4px)",
};

/** 레이어 순서 */
export const layer = {
  base: 1,
  dropdown: 10,
  sticky: 100,
  scrollButton: 100,
  modal: 1000,
  progressBar: 1000,
};

const semantic = {
  surface,
  text,
  border,
  action,
  feedback,
  rank,
  glass,
  glassHover,
  layer,
  transition,
};

export default semantic;
