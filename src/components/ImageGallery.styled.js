import { motion } from "framer-motion";
import styled from "styled-components";

import { action, border, focus, glass, layer, surface, text } from "../styles/semantic";
import { media } from "../styles/theme";
import { blur, radius, shadow, spacing, transition } from "../styles/tokens";

// 갤러리 목록 모달 오버레이
export const GalleryModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: ${surface.strong};
  backdrop-filter: ${blur.subtle};
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${layer.galleryModal};
  padding: 20px;
`;

// 갤러리 목록 모달 콘텐츠
export const GalleryModalContent = styled(motion.div)`
  position: relative;
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  border-radius: ${glass.borderRadius};
  padding: 2.5rem 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: ${glass.boxShadow};
  color: ${text.primary};

  ${media.tablet} {
    padding: 2rem 1.5rem;
    max-width: 95vw;
  }

  ${media.mobile} {
    padding: 1.5rem 1rem;
  }
`;

export const GalleryTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: ${shadow.text};
  color: ${text.accent};

  ${media.tablet} {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  ${media.mobile} {
    font-size: 1.5rem;
  }
`;

export const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${spacing.lg};
  margin: 0 0 1.5rem 0;

  ${media.tablet} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  ${media.mobile} {
    gap: ${spacing.md};
  }
`;

export const ImageThumbnail = styled(motion.img)`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: ${radius.md};
  cursor: pointer;
  transition: ${transition.smooth};
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.03);
    filter: brightness(1.1) contrast(1.05);
    border-color: ${border.accentStrong};
    box-shadow: ${shadow.buttonHover};
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 원형 아이콘 버튼 공통 (목록 닫기·뷰어 닫기)
export const RoundIconButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  background: ${surface.raised};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.default};
  border-radius: 50%;
  color: ${text.muted};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transition.fast};

  &:hover {
    color: ${text.primary};
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  ${media.tablet} {
    width: 44px;
    height: 44px;
  }

  ${media.mobile} {
    width: 40px;
    height: 40px;
  }
`;

// 목록 모달 우상단 닫기 버튼 (hover 시 보라 강조)
export const GalleryCloseButton = styled(RoundIconButton)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  z-index: ${layer.dropdown};

  &:hover {
    background: ${action.secondaryHover};
    border-color: ${border.accentStrong};
    box-shadow: ${shadow.buttonHover};
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px ${focus.ring};
  }

  ${media.tablet} {
    top: 1rem;
    right: 1rem;
  }

  ${media.mobile} {
    top: 0.8rem;
    right: 0.8rem;
  }
`;
