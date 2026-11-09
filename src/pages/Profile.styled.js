import { motion } from "framer-motion";
import styled from "styled-components";

import { Button, Card } from "../components/ui";
import { border, glass, glassHover, layer, surface, text } from "../styles/semantic";
import { blur, radius, shadow, spacing, transition } from "../styles/tokens";

// 스켈레톤 로딩 UI
export const SkeletonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
`;

export const SkeletonRow = styled(motion.div)`
  width: 100%;
  height: 48px;
  background: ${surface.raised};
  border-radius: ${radius.md};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${spacing.lg};
`;

export const ErrorPanel = styled(Card)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2.5rem ${spacing.xl};
  max-width: 26rem;
  text-align: center;
`;

export const ErrorMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: ${text.emphasis};
`;

export const ProfileWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url("/img/bg_community_main.webp") no-repeat center center;
  background-size: cover;
  padding: 20px;
`;

// 데스크톱 레이아웃 컨테이너
export const DesktopContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${spacing.xl};
  height: 100%;
  align-items: center;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 76px; /* 버튼(44px) + 여백(16px) + 패딩(16px) */

  @media (max-width: 768px) {
    display: none;
  }
`;

// 모바일 레이아웃 컨테이너
export const MobileContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    padding-top: 71px; /* 버튼(39px) + 여백(16px) + 패딩(16px) */
  }

  @media (max-width: 480px) {
    padding-top: 66px; /* 버튼(34px) + 여백(16px) + 패딩(16px) */
  }
`;

// 프로필·통계 카드가 공유하는 카드 크기·여백·hover (center: 가운데 정렬)
const profileCardLayout = `
  padding: 3rem 2.5rem;
  max-width: 500px;
  width: 100%;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 90vw;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    max-width: 95vw;
  }
`;

// 로딩 상태를 위한 스켈레톤 카드
export const SkeletonCard = styled(motion(Card))`
  ${profileCardLayout}
  text-align: center;
  color: ${text.primary};
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
`;

// 프로필·통계 카드. 그리드 칸 안에서 가운데 정렬(max-width 때문에 왼쪽으로 쏠림 방지)
export const ProfileCard = styled(motion(Card))`
  ${profileCardLayout}
  text-align: ${({ $isCentered }) => ($isCentered ? "center" : "left")};
  color: ${text.primary};
  justify-self: center;
  cursor: pointer;
  transition: ${transition.smooth};

  &:hover {
    background: ${glassHover.background};
    border-color: ${glassHover.borderColor};
    box-shadow: ${glassHover.boxShadow};
    transform: ${glassHover.transform};
  }

  @media (max-width: 480px) {
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const SkeletonElement = styled(motion.div)`
  background: linear-gradient(
    90deg,
    ${surface.raised} 0%,
    ${border.default} 50%,
    ${surface.raised} 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: ${radius.sm};

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

export const SkeletonCircle = styled(SkeletonElement)`
  width: 150px;
  height: 150px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

// 자리표시자 너비는 행마다 달라서 transient prop($width)으로 받는다
export const SkeletonText = styled(SkeletonElement)`
  height: 20px;
  border-radius: 4px;
  width: ${({ $width }) => $width || "100%"};
`;

export const SkeletonTitle = styled(SkeletonElement)`
  height: 32px;
  width: 200px;
  border-radius: 6px;

  @media (max-width: 480px) {
    width: 150px;
    height: 28px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 20px;
  gap: 10px;
  z-index: ${layer.sticky};

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
  background: ${glass.background};
  backdrop-filter: ${blur.subtle};
  box-shadow: ${shadow.button};

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;
