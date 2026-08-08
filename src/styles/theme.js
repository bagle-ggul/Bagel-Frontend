/**
 * 테마 (호환 레이어)
 *
 * 토큰 체계는 2계층이다:
 *   tokens.js   — 원시 토큰. 값 그 자체
 *   semantic.js — 의미 토큰. "언제 쓰는지"를 이름이 말한다
 *
 * **새 코드는 semantic.js를 직접 import한다.** 이 파일은 기존 컴포넌트가 쓰던
 * 이름(colors, glassmorphism 등)을 유지하기 위한 호환 레이어이며,
 * 값은 전부 의미 토큰을 참조하므로 tokens.js 한 곳만 고치면 전체가 따라 바뀐다.
 */
import {
  action,
  border,
  feedback,
  glass,
  glassHover,
  layer,
  rank,
  surface,
  text,
} from "./semantic";
import { palette, radius, shadow, spacing, transition } from "./tokens";

export const colors = {
  primary: action.primary,
  glassBg: surface.glass,
  glassBorder: border.subtle,
  textPrimary: text.primary,
  textSecondary: text.secondary,
  textTertiary: text.tertiary,
  error: feedback.error,
  errorBg: feedback.errorSurface,
  errorBorder: feedback.errorBorder,
  warning: feedback.warning,
  success: feedback.success,

  gold: rank.first,
  silver: rank.second,
  bronze: rank.third,
};

export const glassmorphism = glass;

export const glassCard = {
  ...glass,
  transition: transition.smooth,
  hover: glassHover,
};

export const buttons = {
  primary: {
    background: action.primary,
    border: `1px solid ${border.subtle}`,
    color: text.onAction,
    borderRadius: radius.md,
    transition: transition.fast,

    hover: {
      background: action.primaryHover,
      transform: "translateY(-2px)",
      boxShadow: shadow.buttonHover,
    },
  },

  glass: {
    ...glass,
    borderRadius: radius.md,
    color: text.onAction,
    transition: transition.fast,
    boxShadow: shadow.button,

    hover: {
      background: action.secondaryHover,
      borderColor: border.accentStrong,
      transform: "translateY(-2px)",
      boxShadow: shadow.buttonHover,
    },
  },

  retry: {
    background: "rgba(200, 182, 226, 0.8)",
    border: `1px solid ${border.subtle}`,
    color: text.onAction,
    borderRadius: radius.md,
    transition: transition.fast,

    hover: {
      background: action.primaryHover,
      transform: "translateY(-2px)",
    },
  },
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },

  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 },
  },

  hover: {
    scale: 1.02,
    transition: { duration: 0.3 },
  },

  tap: {
    scale: 0.98,
  },
};

export const breakpoints = {
  mobile: "480px",
  tablet: "768px",
  desktop: "1024px",
  large: "1440px",
};

export const zIndex = layer;

// 미디어 쿼리 헬퍼 — 브레이크포인트를 컴포넌트에 하드코딩하지 않기 위한 것
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  large: `@media (min-width: ${breakpoints.large})`,
};

export const componentStyles = {
  detailRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: `${spacing.md} ${spacing.lg}`,
    background: surface.raised,
    backdropFilter: "blur(10px)",
    border: `1px solid ${palette.white10}`,
    borderRadius: radius.md,
    transition: transition.smooth,
    cursor: "pointer",
    overflow: "hidden",
    position: "relative",

    hover: {
      background: surface.raisedHover,
      borderColor: border.accent,
      transform: "translateX(3px) scale(1.01)",
      boxShadow: shadow.subtle,
    },
  },

  scrollbar: {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: surface.raised,
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      background: border.accentStrong,
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      background: "rgba(200, 182, 226, 0.8)",
    },
  },
};

const theme = {
  colors,
  glassmorphism,
  glassCard,
  buttons,
  animations,
  breakpoints,
  zIndex,
  media,
  componentStyles,
};

export default theme;
