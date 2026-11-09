import { motion } from "framer-motion";
import styled from "styled-components";

import { action, border, layer, overlay, surface, text } from "../styles/semantic";
import { media } from "../styles/theme";
import { blur, radius, shadow, transition } from "../styles/tokens";

import { RoundIconButton } from "./ImageGallery.styled";

// 이미지 뷰어 풀스크린 오버레이
export const ImageViewerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${overlay.viewer};
  backdrop-filter: ${blur.card};
  z-index: ${layer.imageViewer};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

export const ImageViewerContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ExpandedImage = styled(motion.img)`
  max-width: 85vw;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: ${shadow.viewerImage};

  ${media.tablet} {
    max-width: 90vw;
    max-height: 60vh;
  }
`;

// 다운로드·닫기 버튼 묶음 (이미지 아래)
export const ImageControls = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;

  ${media.tablet} {
    bottom: -50px;
    gap: 0.8rem;
  }
`;

export const DownloadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: ${action.primary};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.accent};
  border-radius: ${radius.md};
  color: ${text.onAction};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: ${transition.fast};

  &:hover {
    background: ${action.primaryHover};
    transform: translateY(-2px);
    box-shadow: ${shadow.buttonHover};
  }

  &:active {
    transform: scale(0.98);
  }

  ${media.tablet} {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  ${media.mobile} {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    gap: 0.4rem;
  }
`;

// 뷰어 닫기 버튼 (hover 시 흰색 강조)
export const ViewerCloseButton = styled(RoundIconButton)`
  &:hover {
    background: ${surface.raisedHover};
    border-color: ${border.strong};
  }
`;

// 좌우 이동 버튼
const NavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: ${surface.control};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.default};
  border-radius: 50%;
  color: ${text.primary};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${transition.fast};
  z-index: ${layer.dropdown};

  &:hover {
    background: ${action.primary};
    border-color: ${border.accentStrong};
    transform: translateY(-50%) scale(1.1);
    box-shadow: ${shadow.buttonHover};
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  ${media.tablet} {
    width: 50px;
    height: 50px;
  }

  ${media.mobile} {
    width: 45px;
    height: 45px;
  }
`;

export const PreviousButton = styled(NavButton)`
  left: 20px;

  ${media.tablet} {
    left: 15px;
  }

  ${media.mobile} {
    left: 10px;
  }
`;

export const NextButton = styled(NavButton)`
  right: 20px;

  ${media.tablet} {
    right: 15px;
  }

  ${media.mobile} {
    right: 10px;
  }
`;

// 현재 위치 표시 (3 / 9)
export const ImageCounter = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${surface.control};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.default};
  border-radius: ${radius.lg};
  padding: 0.5rem 1rem;
  color: ${text.primary};
  font-size: 0.9rem;
  font-weight: 500;

  ${media.tablet} {
    top: 15px;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;
