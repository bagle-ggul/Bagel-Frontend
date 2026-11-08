import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ROUTES } from "../../constants/routes";
import { action, text } from "../../styles/semantic";
import { radius, spacing, transition } from "../../styles/tokens";

const EmptyStateWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${spacing.md};
  padding: ${spacing.xxl} ${spacing.lg};
  text-align: center;
  color: ${text.primary};
`;

const EmptyStateTitle = styled.h3`
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
`;

const EmptyStateHint = styled.p`
  margin: 0;
  font-size: 1rem;
  color: ${text.secondary};
`;

const PlayLink = styled(Link)`
  margin-top: ${spacing.sm};
  padding: 0.8rem ${spacing.xl};
  background: ${action.primary};
  border-radius: ${radius.md};
  color: ${text.onAction};
  font-weight: 600;
  text-decoration: none;
  transition: ${transition.fast};

  &:hover {
    background: ${action.primaryHover};
    transform: translateY(-2px);
  }
`;

/**
 * 랭킹 빈 상태: 아직 아무도 기록을 남기지 않았을 때 다음 행동(플레이)을 안내
 * 표 헤더만 덩그러니 보이면 화면이 고장난 것처럼 보이기 때문
 */
function BoardEmptyState() {
  return (
    <EmptyStateWrapper initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <EmptyStateTitle>아직 기록이 없어요</EmptyStateTitle>
      <EmptyStateHint>첫 번째 랭커가 되어보세요!</EmptyStateHint>
      <PlayLink to={ROUTES.INTRO}>게임 하러 가기</PlayLink>
    </EmptyStateWrapper>
  );
}

export default BoardEmptyState;
