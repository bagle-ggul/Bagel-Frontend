import { motion } from "framer-motion";
import styled, { css, keyframes } from "styled-components";

import { Button } from "../../components/ui";
import { action, border, feedback, focus, surface, text } from "../../styles/semantic";
import { blur, radius, shadow, spacing, transition } from "../../styles/tokens";

const spin = keyframes`
  to {
    transform: rotate(360deg);
  }
`;

export const GuestForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  width: 100%;
`;

export const InputWrapper = styled(motion.div)`
  width: 100%;
`;

export const GlassInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: ${surface.raised};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${border.default};
  border-radius: ${radius.md};
  color: ${text.primary};
  font-size: 1rem;
  box-sizing: border-box;
  transition: ${transition.fast};

  &::placeholder {
    color: ${text.secondary};
  }

  &:focus {
    outline: none;
    border-color: ${border.accentStrong};
    box-shadow: 0 0 0 3px ${focus.ring};
    background: ${surface.raisedHover};
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

export const ErrorMessage = styled(motion.div)`
  width: 100%;
  padding: 0.8rem 1rem;
  background: ${feedback.errorSurface};
  backdrop-filter: ${blur.subtle};
  border: 1px solid ${feedback.errorBorder};
  border-radius: ${radius.sm};
  color: ${feedback.errorText};
  font-size: 0.9rem;
  text-align: center;
  margin-top: ${spacing.sm};

  @media (max-width: 768px) {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.7rem;
    font-size: 0.8rem;
  }
`;

export const GuestModalDescription = styled.p`
  margin: 0 0 ${spacing.lg};
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

// 제출 중에는 대기 커서
export const StartButton = styled(Button)`
  width: 100%;

  &:disabled {
    cursor: wait;
  }
`;
