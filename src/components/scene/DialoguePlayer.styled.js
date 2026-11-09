import { motion } from "framer-motion";
import styled from "styled-components";

import { layer, overlay } from "../../styles/semantic";
import { media } from "../../styles/theme";
import { spacing } from "../../styles/tokens";

const DIALOGUE_MAX_WIDTH = "1100px"; // 대사창 띠 최대 너비
const CHOICE_MAX_WIDTH = "560px"; // 가운데 선택지 묶음 최대 너비
const CHOICE_BOTTOM_CLEARANCE = "11rem"; // 선택지가 대사창과 겹치지 않게 비우는 아래 공간
const CHOICE_BOTTOM_CLEARANCE_MOBILE = "9.5rem";

/*
 * 겹침 구조 4층: 캐릭터(아래 고정) < 선택지(가운데 막) < 대사창(아래 띠) < 종료 슬롯
 * 층끼리 흐름을 공유하지 않음 > 선택지가 늘어도 캐릭터·대사창 위치 불변
 */

// 화면 전체 탭 영역 (넘치는 캐릭터 아래쪽은 잘림)
export const Screen = styled.div`
  position: relative;
  height: 100dvh;
  overflow: hidden;
  cursor: pointer;
  user-select: none;
`;

// 1층: 캐릭터, 화면 아래에 붙임
export const SpriteLayer = styled.div`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  pointer-events: none;
`;

// 2층: 대사창, 화면 아래 넓은 띠
export const DialogueLayer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  max-width: ${DIALOGUE_MAX_WIDTH};
  margin: 0 auto;
  padding: ${spacing.lg};

  ${media.mobile} {
    padding: ${spacing.sm};
  }
`;

// 3층: 선택지 막 (화면을 살짝 눌러 선택에 집중, 대사창 위 공간 가운데)
export const ChoiceLayer = styled(motion.div)`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.xxl} ${spacing.lg} ${CHOICE_BOTTOM_CLEARANCE};
  background: ${overlay.dim};
  cursor: default;

  ${media.mobile} {
    padding: ${spacing.xxl} ${spacing.sm} ${CHOICE_BOTTOM_CLEARANCE_MOBILE};
  }
`;

// 선택지 묶음 (많아도 화면 밖으로 넘치지 않게 스크롤)
export const ChoiceArea = styled.div`
  width: 100%;
  max-width: ${CHOICE_MAX_WIDTH};
  max-height: 100%;
  overflow-y: auto;
`;

// 4층: 종료 슬롯, 화면 가운데 (빈 곳은 통과 > 조작 버튼·지난 대사 계속 사용)
export const EndSlotArea = styled.div`
  position: absolute;
  inset: 0;
  z-index: ${layer.sticky};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  pointer-events: none;

  & > * {
    pointer-events: auto;
    cursor: default;
  }
`;
