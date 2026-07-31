import { motion } from "framer-motion";
import styled from "styled-components";

// 배경 이미지 URL
export const backgroundImageUrl = "/img/bg_community_main.png";

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
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
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
  background: linear-gradient(90deg, rgba(200, 182, 226, 0.9), rgba(200, 182, 226, 0.6));
  z-index: 1000;
  transition: width 0.3s ease;
  box-shadow: 0 2px 10px rgba(200, 182, 226, 0.3);
`;

// 글라스모피즘 컨테이너
export const GlassContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
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

// 스크롤 가능한 테이블 컨테이너
export const ScrollableTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(200, 182, 226, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(200, 182, 226, 0.8);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// 데스크톱 테이블
export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`;

export const TableHead = styled.thead`
  background: rgba(200, 182, 226, 0.3);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableRow = styled.tr`
  transition: all 0.3s ease;
  cursor: pointer;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }

  &:hover {
    background: rgba(200, 182, 226, 0.2);
    transform: translateX(5px);
  }
`;

export const TableHeader = styled.th`
  padding: 15px;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

export const TableCell = styled.td`
  padding: 15px;
  font-size: 1em;
  text-align: center;
  color: white;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
`;

// 랭킹 특별 표시 (1-5위)
export const RankCell = styled(TableCell)`
  font-weight: 700;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) => {
    if (props.rank === 1) {
      return `
        color: #FFD700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        animation: pulse 2s infinite;
      `;
    } else if (props.rank === 2) {
      return `
        color: #C0C0C0;
        text-shadow: 0 0 8px rgba(192, 192, 192, 0.5);
      `;
    } else if (props.rank === 3) {
      return `
        color: #CD7F32;
        text-shadow: 0 0 8px rgba(205, 127, 50, 0.5);
      `;
    } else if (props.rank <= 5) {
      return `
        color: rgba(200, 182, 226, 1);
        text-shadow: 0 0 6px rgba(200, 182, 226, 0.4);
      `;
    }
  }}

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

// 점수 표시
export const ScoreCell = styled(TableCell)`
  font-weight: 700;
  font-size: 1.3em;
  color: rgba(200, 182, 226, 1);
  text-shadow: 0 0 8px rgba(200, 182, 226, 0.4);
`;

// 모바일 카드 컨테이너
export const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    display: flex;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(200, 182, 226, 0.5);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(200, 182, 226, 0.8);
  }
`;

// 모바일 랭킹 카드
export const RankCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.rank <= 5) {
      return `
        border: 1px solid rgba(200, 182, 226, 0.3);
        background: rgba(200, 182, 226, 0.1);
      `;
    }
  }}

  &:hover {
    background: rgba(200, 182, 226, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

// 모바일 랭킹 표시
export const MobileRankDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  gap: 5px;
`;

export const MobileRankNumber = styled.div`
  font-size: 1.2em;
  font-weight: 700;

  ${(props) => {
    if (props.rank === 1) {
      return `
        color: #FFD700;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
      `;
    } else if (props.rank === 2) {
      return `
        color: #C0C0C0;
        text-shadow: 0 0 6px rgba(192, 192, 192, 0.5);
      `;
    } else if (props.rank === 3) {
      return `
        color: #CD7F32;
        text-shadow: 0 0 6px rgba(205, 127, 50, 0.5);
      `;
    } else if (props.rank <= 5) {
      return `
        color: rgba(200, 182, 226, 1);
        text-shadow: 0 0 6px rgba(200, 182, 226, 0.4);
      `;
    } else {
      return `color: white;`;
    }
  }}
`;

// 모바일 사용자 정보
export const MobileUserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MobileUserName = styled.div`
  font-size: 1.1em;
  font-weight: 600;
  color: white;
`;

export const MobileMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
`;

export const MobileMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 모바일 점수 표시
export const MobileScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  gap: 2px;
`;

export const MobileScoreValue = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  color: rgba(200, 182, 226, 1);
  text-shadow: 0 0 8px rgba(200, 182, 226, 0.4);
`;

export const MobileScoreLabel = styled.div`
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.6);
`;

// 로딩 인디케이터
export const LoadingMoreIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

export const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(200, 182, 226, 0.2);
  border-top: 3px solid rgba(200, 182, 226, 0.9);
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
  color: rgba(255, 255, 255, 0.8);
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
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 15px;
  margin: 20px;
`;

export const ErrorText = styled.span`
  color: rgba(220, 53, 69, 0.9);
  font-size: 1rem;
  text-align: center;
`;

export const RetryButton = styled(motion.button)`
  background: rgba(200, 182, 226, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
  }
`;

// 맨 위로 버튼
export const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(200, 182, 226, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(200, 182, 226, 0.3);

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(200, 182, 226, 0.4);
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

export const ButtonSpan = styled.span`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;
