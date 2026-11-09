import { motion } from "framer-motion";
import styled from "styled-components";

import { Button } from "../components/ui";
import {
  action,
  border,
  feedback,
  focus,
  glass,
  layer,
  overlay,
  surface,
  text,
} from "../styles/semantic";
import { blur, radius, shadow } from "../styles/tokens";

// 배경 이미지 URL
export const backgroundImageUrl = "/img/bg_community_main.webp";

export const BoardWrapper = styled.div`
  background-image: url(${backgroundImageUrl});
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

export const Title = styled.h1`
  font-size: 3em;
  color: ${text.primary};
  text-shadow: 2px 2px 4px ${surface.strong};
  margin: 60px 0 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2em;
    margin: 50px 0 15px 0;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.8em;
    margin: 40px 0 10px 0;
    gap: 8px;
  }
`;

// 스크롤 진행 표시기
export const ScrollProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => props.$progress}%;
  height: 3px;
  background: linear-gradient(90deg, ${action.primary}, ${border.accentStrong});
  z-index: ${layer.progressBar};
  transition: width 0.3s ease;
  box-shadow: 0 2px 10px ${border.accent};
`;

// 글라스모피즘 컨테이너
export const GlassContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  box-shadow: ${glass.boxShadow};
  border-radius: ${glass.borderRadius};
  overflow: hidden;
  max-height: 75vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 80vh;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-height: 85vh;
    border-radius: 12px;
  }
`;

// 로딩 인디케이터
export const LoadingMoreIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  gap: 15px;
  background: ${overlay.faint};
  border-top: 1px solid ${border.subtle};
`;

export const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid ${surface.accentHover};
  border-top: 3px solid ${action.primary};
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

export const LoadingText = styled.span`
  color: ${text.muted};
  font-size: 1rem;
  font-weight: 500;
`;

// 에러 상태
export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: ${feedback.errorSurface};
  border: 1px solid ${feedback.errorBorder};
  border-radius: 15px;
  margin: 20px;
`;

export const ErrorText = styled.span`
  color: ${feedback.error};
  font-size: 1rem;
  text-align: center;
`;

// 모든 랭킹을 불러온 뒤 목록 하단 안내
export const EndOfListNotice = styled.div`
  text-align: center;
  padding: 20px;
  color: ${text.tertiary};
  border-top: 1px solid ${border.subtle};
`;

// 맨 위로 버튼
export const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: ${action.primary};
  border: 2px solid ${border.default};
  color: ${text.onAction};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${layer.scrollButton};
  backdrop-filter: ${blur.subtle};
  box-shadow: 0 8px 32px ${border.accent};

  &:hover {
    background: ${action.primaryHover};
    transform: translateY(-2px);
    box-shadow: 0 12px 40px ${focus.ring};
  }

  @media (max-width: 768px) {
    bottom: 70px;
    right: 15px;
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    bottom: 60px;
    right: 10px;
    width: 44px;
    height: 44px;
  }
`;

// 로딩 트리거 요소
export const LoadMoreTrigger = styled.div`
  height: 1px;
  width: 100%;
`;

export const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 20px;
  gap: 10px;

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

// 상단 이동 버튼: 배경 이미지 위에서 읽히도록 글라스 표면을 깐 ghost 버튼
export const TopNavButton = styled(Button)`
  background: ${surface.glass};
  backdrop-filter: ${blur.subtle};
  box-shadow: ${shadow.button};
  border-radius: ${radius.md};

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;
