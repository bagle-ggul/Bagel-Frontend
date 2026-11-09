import styled from "styled-components";

import { action, border, surface, text } from "../../styles/semantic";
import { media } from "../../styles/theme";
import { blur, radius, spacing, transition } from "../../styles/tokens";

export const MbtiCompactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  box-sizing: border-box;
  background: ${surface.raised};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.subtle};
  border-radius: ${radius.md};
`;

export const MbtiTitle = styled.h4`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  margin: 0 0 ${spacing.xs};
  font-size: 1rem;
  font-weight: 600;
  color: ${text.accent};

  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

// 4축을 모두 고르면 제목 옆에 완성된 MBTI를 보여준다 (별도 박스를 두면 모달이 길어져 제출 버튼이 밀려남)
export const MbtiResultBadge = styled.span`
  padding: 0.1rem ${spacing.md};
  background: ${action.primary};
  border-radius: ${radius.pill};
  color: ${text.onAction};
  font-size: 0.9rem;
  font-weight: 700;
  letter-spacing: 0.1em;
`;

// 모바일에서도 라벨과 버튼을 한 줄로 유지한다 (세로로 쌓으면 4축이 두 배 높이가 됨)
export const MbtiRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${spacing.md};
`;

export const MbtiLabel = styled.span`
  min-width: 3.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${text.secondary};

  ${media.mobile} {
    font-size: 0.8rem;
    min-width: 2.8rem;
  }
`;

export const MbtiButtonGroup = styled.div`
  display: flex;
  gap: ${spacing.sm};
  flex: 1;
  max-width: 220px;
`;

export const MbtiButton = styled.button`
  flex: 1;
  min-width: 0;
  padding: 0.55rem 0.6rem;
  background: ${({ $isSelected }) => ($isSelected ? action.primary : surface.raised)};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? border.accentStrong : border.subtle)};
  border-radius: ${radius.sm};
  color: ${text.onAction};
  font-size: 0.9rem;
  font-weight: 600;
  white-space: nowrap;
  cursor: pointer;
  transition: ${transition.fast};

  &:hover {
    background: ${action.secondaryHover};
    transform: translateY(-1px);
  }

  ${media.mobile} {
    padding: 0.5rem 0.4rem;
    font-size: 0.8rem;
  }
`;
