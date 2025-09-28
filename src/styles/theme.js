// 공통 테마 스타일 시스템
export const colors = {
  primary: 'rgba(200, 182, 226, 0.9)',
  glassBg: 'rgba(0, 0, 0, 0.4)',
  glassBorder: 'rgba(255, 255, 255, 0.15)',
  textPrimary: 'white',
  textSecondary: 'rgba(255, 255, 255, 0.7)',
  textTertiary: 'rgba(255, 255, 255, 0.6)',
  error: 'rgba(220, 53, 69, 0.9)',
  errorBg: 'rgba(220, 53, 69, 0.1)',
  errorBorder: 'rgba(220, 53, 69, 0.3)',
  warning: 'rgba(255, 193, 7, 0.9)',
  success: 'rgba(40, 167, 69, 0.9)',

  // 랭킹 컬러
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32'
};

export const glassmorphism = {
  background: colors.glassBg,
  backdropFilter: 'blur(15px)',
  border: `1px solid ${colors.glassBorder}`,
  boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
  borderRadius: '20px'
};

export const glassCard = {
  ...glassmorphism,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',

  hover: {
    background: 'rgba(0, 0, 0, 0.5)',
    borderColor: 'rgba(200, 182, 226, 0.4)',
    boxShadow: `
      0 12px 40px rgba(0, 0, 0, 0.6),
      0 0 0 1px rgba(200, 182, 226, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1)
    `,
    transform: 'translateY(-4px)'
  }
};

export const buttons = {
  primary: {
    background: colors.primary,
    border: `1px solid ${colors.glassBorder}`,
    color: colors.textPrimary,
    borderRadius: '12px',
    transition: 'all 0.3s ease',

    hover: {
      background: 'rgba(200, 182, 226, 1)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(200, 182, 226, 0.3)'
    }
  },

  glass: {
    ...glassmorphism,
    borderRadius: '12px',
    color: colors.textPrimary,
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',

    hover: {
      background: 'rgba(200, 182, 226, 0.3)',
      borderColor: 'rgba(200, 182, 226, 0.5)',
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(200, 182, 226, 0.3)'
    }
  },

  retry: {
    background: 'rgba(200, 182, 226, 0.8)',
    border: `1px solid ${colors.glassBorder}`,
    color: colors.textPrimary,
    borderRadius: '12px',
    transition: 'all 0.3s ease',

    hover: {
      background: 'rgba(200, 182, 226, 1)',
      transform: 'translateY(-2px)'
    }
  }
};

export const animations = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 }
  },

  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  },

  scaleIn: {
    initial: { scale: 0.8, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.8, opacity: 0 }
  },

  hover: {
    scale: 1.02,
    transition: { duration: 0.3 }
  },

  tap: {
    scale: 0.98
  }
};

export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  large: '1440px'
};

export const zIndex = {
  base: 1,
  dropdown: 10,
  sticky: 100,
  modal: 1000,
  progressBar: 1000,
  scrollButton: 100
};

// 미디어 쿼리 헬퍼
export const media = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.desktop})`,
  large: `@media (min-width: ${breakpoints.large})`
};

// 공통 컴포넌트 스타일
export const componentStyles = {
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    padding: '0.8rem 1.2rem',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '12px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',

    hover: {
      background: 'rgba(255, 255, 255, 0.15)',
      borderColor: 'rgba(200, 182, 226, 0.4)',
      transform: 'translateX(3px) scale(1.01)',
      boxShadow: '0 4px 15px rgba(200, 182, 226, 0.15)'
    }
  },

  scrollbar: {
    '&::-webkit-scrollbar': {
      width: '8px'
    },
    '&::-webkit-scrollbar-track': {
      background: 'rgba(255, 255, 255, 0.1)',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb': {
      background: 'rgba(200, 182, 226, 0.5)',
      borderRadius: '4px'
    },
    '&::-webkit-scrollbar-thumb:hover': {
      background: 'rgba(200, 182, 226, 0.8)'
    }
  }
};

export default {
  colors,
  glassmorphism,
  glassCard,
  buttons,
  animations,
  breakpoints,
  zIndex,
  media,
  componentStyles
};