import styled from "styled-components";

import { layer } from "../../styles/semantic";
import { media } from "../../styles/theme";
import { spacing } from "../../styles/tokens";

// 대사창·선택지 최대 너비
const DIALOGUE_MAX_WIDTH = "800px";

/*
 * 겹침 구조 3층: 캐릭터(아래 고정) < 대사 UI(아래 덮개) < 종료 슬롯
 * 층끼리 흐름을 공유하지 않음 > 선택지가 늘어도 캐릭터 위치 불변
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

// 2층: 선택지 > 대사창, 화면 아래 덮개
export const DialogueLayer = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  width: 100%;
  max-width: ${DIALOGUE_MAX_WIDTH};
  margin: 0 auto;
  padding: ${spacing.lg};

  ${media.mobile} {
    padding: ${spacing.sm};
  }
`;

// 선택지가 많아도 대사창을 밀어내지 않게 스크롤
export const ChoiceArea = styled.div`
  max-height: 50dvh;
  overflow-y: auto;
  cursor: default;
`;

// 3층: 종료 슬롯, 화면 가운데 덮개
export const EndSlotArea = styled.div`
  position: absolute;
  inset: 0;
  z-index: ${layer.sticky};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  cursor: default;
`;
