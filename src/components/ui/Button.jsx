import styled, { css } from "styled-components";

import { action, border, focus, text } from "../../styles/semantic";
import { radius, shadow, spacing, transition } from "../../styles/tokens";

// DOM으로 넘기지 않는 스타일 전용 props
const STYLE_ONLY_PROPS = ["variant", "size"];

// 버튼 변형별 스타일 (primary: 강조 / secondary: 보조 / ghost: 테두리만)
const variantStyles = {
  primary: css`
    background: ${action.primary};
    color: ${text.onAction};
    border: 1px solid transparent;

    &:hover:not(:disabled) {
      background: ${action.primaryHover};
      box-shadow: ${shadow.buttonHover};
    }
  `,
  secondary: css`
    background: ${action.secondary};
    color: ${text.primary};
    border: 1px solid ${border.default};

    &:hover:not(:disabled) {
      background: ${action.secondaryHover};
      border-color: ${border.accentStrong};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${text.secondary};
    border: 1px solid ${border.subtle};

    &:hover:not(:disabled) {
      color: ${text.primary};
      border-color: ${border.accent};
    }
  `,
};

// 버튼 크기별 여백·글자 크기
const sizeStyles = {
  md: css`
    padding: ${spacing.sm} ${spacing.lg};
    font-size: 1rem;
  `,
  lg: css`
    padding: ${spacing.md} ${spacing.xl};
    font-size: 1.1rem;
  `,
};

/**
 * 공용 버튼: variant(primary, secondary, ghost), size(md, lg)
 * as={Link}처럼 다른 요소로 렌더 가능
 */
const Button = styled.button
  .withConfig({ shouldForwardProp: (propName) => !STYLE_ONLY_PROPS.includes(propName) })
  .attrs(({ variant = "primary", size = "md" }) => ({
    $variant: variant,
    $size: size,
  }))`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${spacing.sm};
  border-radius: ${radius.md};
  font-weight: 600;
  text-decoration: none;
  cursor: pointer;
  transition: ${transition.fast};
  ${({ $variant }) => variantStyles[$variant]}
  ${({ $size }) => sizeStyles[$size]}

  &:focus-visible {
    outline: 2px solid ${focus.ring};
    outline-offset: 2px;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export default Button;
