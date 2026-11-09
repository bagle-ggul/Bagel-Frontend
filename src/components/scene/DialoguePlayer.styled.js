import styled from "styled-components";

import { layer } from "../../styles/semantic";
import { media } from "../../styles/theme";
import { spacing } from "../../styles/tokens";

// 대사창·선택지 최대 너비
const DIALOGUE_MAX_WIDTH = "800px";

// 화면 전체 탭 영역: 세로 flex (캐릭터 > 선택지 > 대사창 순으로 아래 정렬)
export const Screen = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 100dvh;
  cursor: pointer;
  user-select: none;
`;

export const SpriteArea = styled.div`
  flex: 1;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  min-height: 0;
  padding-top: ${spacing.xxl};
`;

// 대사창·선택지 하단 고정 영역
export const BottomArea = styled.div`
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

// 종료 슬롯: 화면 가운데 덮개
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
