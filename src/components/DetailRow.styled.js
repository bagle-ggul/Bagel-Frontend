import { motion } from "framer-motion";
import styled from "styled-components";

import { text } from "../styles/semantic";
import { toCss } from "../styles/styleObject";
import { media } from "../styles/theme";

// 프로필·통계 카드가 공유하는 "라벨 - 값" 한 줄.
// 호출부가 theme={componentStyles.detailRow}를 넘기면 그 값이 기본 스타일이 된다.
export const DetailRow = styled(motion.div)`
  ${({ theme }) => toCss(theme)}

  ${media.mobile} {
    padding: 0.6rem 1rem;
    flex-direction: column;
    gap: 0.3rem;
    text-align: center;

    &:hover {
      transform: translateY(-2px) scale(1.01);
    }
  }
`;

export const DetailTitle = styled.span`
  font-weight: 600;
  color: ${text.accent};
  font-size: 1rem;

  ${media.mobile} {
    font-size: 0.9rem;
  }
`;

export const DetailValue = styled.span`
  color: ${text.emphasis};
  font-weight: 500;
  font-size: 1rem;

  ${media.mobile} {
    font-size: 0.9rem;
  }
`;
