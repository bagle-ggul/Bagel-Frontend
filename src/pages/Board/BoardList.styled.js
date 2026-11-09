import { motion } from "framer-motion";
import styled, { css } from "styled-components";

import {
  action,
  border,
  focus,
  overlay,
  rank,
  rankGlow,
  surface,
  text,
} from "../../styles/semantic";
import { media } from "../../styles/theme";
import { blur } from "../../styles/tokens";

// 커스텀 스크롤바 (너비만 다르게)
const scrollbarStyle = (widthPixels) => css`
  &::-webkit-scrollbar {
    width: ${widthPixels}px;
  }

  &::-webkit-scrollbar-track {
    background: ${surface.raised};
    border-radius: ${widthPixels / 2}px;
  }

  &::-webkit-scrollbar-thumb {
    background: ${border.accentStrong};
    border-radius: ${widthPixels / 2}px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: ${action.primary};
  }
`;

// 순위별 글자색·발광 (1~3위 메달색, 4~5위 보라, 그 외 지정 안 함)
const rankTextStyle = ({ rank: rankNumber, glowPixels }) => {
  const medalStyleByRank = {
    1: { color: rank.first, glow: rankGlow.first },
    2: { color: rank.second, glow: rankGlow.second },
    3: { color: rank.third, glow: rankGlow.third },
  };
  const medalStyle = medalStyleByRank[rankNumber];
  if (medalStyle) {
    return css`
      color: ${medalStyle.color};
      text-shadow: 0 0 ${glowPixels}px ${medalStyle.glow};
    `;
  }
  if (rankNumber <= 5) {
    return css`
      color: ${text.accent};
      text-shadow: 0 0 6px ${focus.ring};
    `;
  }
  return null;
};

// 스크롤 가능한 테이블 컨테이너 (모바일에서는 숨김)
export const ScrollableTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  ${scrollbarStyle(8)}

  ${media.tablet} {
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
  background: ${action.secondaryHover};
  color: ${text.primary};
  position: sticky;
  top: 0;
  z-index: 10;
`;

export const TableRow = styled.tr`
  transition: all 0.3s ease;
  cursor: pointer;

  &:nth-child(even) {
    background: ${surface.faint};
  }

  &:hover {
    background: ${surface.accentHover};
    transform: translateX(5px);
  }
`;

export const TableHeader = styled.th`
  padding: 15px;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  color: ${text.primary};
  border-bottom: 1px solid ${border.subtle};
`;

export const TableCell = styled.td`
  padding: 15px;
  font-size: 1em;
  text-align: center;
  color: ${text.primary};
  font-weight: 500;
  border-bottom: 1px solid ${surface.faint};
  vertical-align: middle;
`;

// 아이콘 + 값을 가운데 정렬로 나란히 (MBTI, 날짜 셀)
export const CellContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
`;

// 랭킹 특별 표시 (1~5위)
export const RankCell = styled(TableCell)`
  font-weight: 700;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  ${({ $rank: rankNumber }) => rankTextStyle({ rank: rankNumber, glowPixels: 10 })}
  ${({ $rank: rankNumber }) => rankNumber === 1 && "animation: pulse 2s infinite;"}

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
  color: ${text.accent};
  text-shadow: 0 0 8px ${focus.ring};
`;

// 모바일 카드 컨테이너 (데스크톱에서는 숨김)
export const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  overflow-y: auto;
  flex: 1;
  ${scrollbarStyle(6)}

  ${media.tablet} {
    display: flex;
  }
`;

// 모바일 랭킹 카드 (5위 이내는 보라 강조)
export const RankCard = styled(motion.div)`
  background: ${surface.raised};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.subtle};
  border-radius: 15px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${({ $rank: rankNumber }) =>
    rankNumber <= 5 &&
    css`
      border: 1px solid ${border.accent};
      background: ${surface.accentFaint};
    `}

  &:hover {
    background: ${surface.accentHover};
    transform: translateY(-2px);
    box-shadow: 0 4px 15px ${overlay.light};
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
  color: ${text.primary};
  ${({ $rank: rankNumber }) => rankTextStyle({ rank: rankNumber, glowPixels: 8 })}
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
  color: ${text.primary};
`;

export const MobileMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9em;
  color: ${text.secondary};
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
  color: ${text.accent};
  text-shadow: 0 0 8px ${focus.ring};
`;

export const MobileScoreLabel = styled.div`
  font-size: 0.8em;
  color: ${text.tertiary};
`;
