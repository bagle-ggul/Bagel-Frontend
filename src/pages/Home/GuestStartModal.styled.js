import styled, { css, keyframes } from "styled-components";

import { action, border, surface, text } from "../../styles/semantic";
import { radius, shadow, spacing, transition } from "../../styles/tokens";
import { LoginForm, ModalContent, ModalTitle, SubmitButton } from "../Home.styled";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

// 입력 몇 개뿐인 폼이라 공용 모달보다 좁고 낮게 쓴다 (낮은 화면에서도 제출 버튼이 보이도록)
export const GuestModalContent = styled(ModalContent)`
  max-width: 460px;
  max-height: 92vh;
  padding: ${spacing.xl} ${spacing.xl};

  @media (max-width: 480px) {
    padding: ${spacing.lg} ${spacing.lg};
  }
`;

export const GuestModalTitle = styled(ModalTitle)`
  margin-bottom: ${spacing.sm};
  font-size: 2rem;

  @media (max-width: 480px) {
    font-size: 1.6rem;
  }
`;

export const GuestForm = styled(LoginForm)`
  gap: ${spacing.md};
`;

export const GuestModalDescription = styled.p`
  margin: 0 0 ${spacing.lg};
  text-align: center;
  font-size: 0.95rem;
  line-height: 1.5;
  color: ${text.secondary};
`;

export const NicknameRow = styled.div`
  display: flex;
  gap: ${spacing.sm};
  align-items: stretch;
`;

export const NicknameField = styled.div`
  flex: 1;
  min-width: 0;
`;

export const RerollButton = styled.button`
  flex-shrink: 0;
  width: 3.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${surface.raised};
  border: 1px solid ${border.subtle};
  border-radius: ${radius.md};
  color: ${text.primary};
  cursor: pointer;
  transition: ${transition.fast};

  &:hover:not(:disabled) {
    background: ${action.secondaryHover};
    border-color: ${border.accentStrong};
    box-shadow: ${shadow.subtle};
  }

  &:disabled {
    cursor: wait;
    opacity: 0.7;
  }

  svg {
    ${({ $isSpinning }) =>
      $isSpinning &&
      css`
        animation: ${spin} 0.8s linear infinite;
      `}
  }
`;

export const FieldHint = styled.span`
  display: block;
  margin-top: ${spacing.xs};
  padding-left: ${spacing.xs};
  font-size: 0.8rem;
  color: ${text.tertiary};
`;

// 화면에는 숨기고 스크린리더에만 읽히는 라벨
export const VisuallyHiddenLabel = styled.label`
  position: absolute;
  width: 1px;
  height: 1px;
  margin: -1px;
  padding: 0;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
`;

export const StartButton = styled(SubmitButton)`
  &:disabled {
    cursor: wait;
    opacity: 0.6;
    transform: none;
    box-shadow: none;
  }
`;
