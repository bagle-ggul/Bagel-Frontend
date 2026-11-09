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
  strong: palette.black80, // 불투명에 가까운 어두운 패널
  faint: palette.white05, // 카드 안에서 한 단계 더 옅게 구분하는 면
  accentFaint: palette.lilac10, // 강조 대상 행·카드의 옅은 보라 면
  accentHover: palette.lilac20, // 행·카드 hover 시 보라 면
  control: palette.black60, // 이미지 위에 얹는 조작 버튼·표시 면
};

/** 텍스트 */
export const text = {
  // 밝기 순: primary > emphasis > muted > secondary > tertiary
  primary: palette.white,
  secondary: palette.white70,
  tertiary: palette.white60,
  muted: palette.white80, // secondary보다 약간 진한 보조 텍스트
  emphasis: palette.white90, // primary 바로 아래 강조 텍스트
  accent: palette.lilac90,
  onAction: palette.white,
};

/** 테두리 */
export const border = {
  subtle: palette.white15,
  default: palette.white20,
  strong: palette.white30,
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
  errorText: palette.red400, // 어두운 배경 위에서 읽히는 밝은 오류 글자색
  warning: palette.amber90,
  success: palette.green90,
};

/** 오버레이 — 콘텐츠 위를 덮는 어두운 막 */
export const overlay = {
  faint: palette.black20,
  light: palette.black30,
  modal: palette.black70,
  dim: palette.black50, // 화면 일부를 어둡게 눌러 글자를 읽히게 하는 막
  viewer: palette.black95, // 이미지 뷰어 전체화면 배경
};

/** 포커스 — 키보드 포커스 표시 */
export const focus = {
  ring: palette.lilac40,
};

/** 대사 진행 화면 (대사창·나레이션·선택지 카드) */
export const dialogue = {
  box: palette.black70,
  narration: palette.white80,
  choice: palette.black60,
  choiceHover: palette.lilac30,
};

/** 장면 분위기 효과 (비·먼지·꽃잎·반짝임·장막) */
export const effect = {
  rain: palette.white30,
  dust: palette.white60,
  petal: palette.lilac50,
  sparkle: palette.white90,
  veil: palette.black80,
};

/** 순위 표시 */
export const rank = {
  first: palette.gold,
  second: palette.silver,
  third: palette.bronze,
};

/** 순위 글자 발광 (text-shadow 색) */
export const rankGlow = {
  first: palette.goldGlow,
  second: palette.silverGlow,
  third: palette.bronzeGlow,
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
  galleryModal: 1500, // 홈 위에 뜨는 이미지 갤러리 목록
  imageViewer: 2000, // 갤러리 목록 위의 확대 뷰어
  progressBar: 1000,
};

const semantic = {
  surface,
  text,
  border,
  action,
  feedback,
  overlay,
  focus,
  dialogue,
  effect,
  rank,
  rankGlow,
  glass,
  glassHover,
  layer,
  transition,
};

export default semantic;
