import styled from "styled-components";

import { glass } from "../../styles/semantic";
import { spacing } from "../../styles/tokens";

const paddingBySize = { md: spacing.lg, lg: spacing.xl };

/**
 * 글래스 표면 카드: padding(md, lg)
 * as로 section, article 등 다른 요소로 렌더 가능
 */
const Card = styled.div
  .withConfig({ shouldForwardProp: (propName) => propName !== "padding" })
  .attrs(({ padding = "md" }) => ({
    $padding: padding,
  }))`
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  box-shadow: ${glass.boxShadow};
  border-radius: ${glass.borderRadius};
  padding: ${({ $padding }) => paddingBySize[$padding]};
`;

export default Card;
