import { motion } from "framer-motion";
import styled from "styled-components";

import { Card } from "../components/ui";
import { border, text } from "../styles/semantic";
import { media } from "../styles/theme";
import { spacing } from "../styles/tokens";

const SUMMARY_MAX_WIDTH = "480px"; // 회차 요약 카드 최대 너비
const CHOICE_LIST_MAX_HEIGHT = "40dvh"; // 선택 목록이 길면 카드 안에서 스크롤

// 요약 카드 등장 래퍼 (종료 슬롯 가운데)
export const SummaryMotion = styled(motion.div)`
  width: 100%;
  max-width: ${SUMMARY_MAX_WIDTH};
`;

export const SummaryCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  color: ${text.primary};
  text-align: center;

  ${media.mobile} {
    padding: ${spacing.md};
  }
`;

export const EndingTitle = styled.h1`
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

export const EndingSubtitle = styled.p`
  margin: 0;
  font-size: 1.05rem;
  color: ${text.accent};
`;

export const SectionHeading = styled.h2`
  margin: 0;
  padding-top: ${spacing.sm};
  border-top: 1px solid ${border.subtle};
  font-size: 1rem;
  font-weight: 600;
  color: ${text.secondary};
`;

// 고른 선택 번호 목록
export const ChoiceSummaryList = styled.ol`
  max-height: ${CHOICE_LIST_MAX_HEIGHT};
  margin: 0;
  padding-left: ${spacing.lg};
  overflow-y: auto;
  text-align: left;
`;

export const ChoiceSummaryItem = styled.li`
  padding: ${spacing.xs} 0;
  color: ${text.emphasis};
`;

// 스테이지 번호 머리표 (선택 문구보다 옅게)
export const ChoiceStageLabel = styled.span`
  margin-right: ${spacing.sm};
  color: ${text.tertiary};
`;

export const EmptyChoiceText = styled.p`
  margin: 0;
  color: ${text.tertiary};
`;

export const RegressionCountText = styled.p`
  margin: 0;
  font-weight: 600;
  color: ${text.accent};
`;

export const ButtonRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  justify-content: center;

  & > * {
    flex: 1;
  }
`;
