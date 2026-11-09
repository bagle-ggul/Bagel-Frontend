import { ROUTES } from "../constants/routes";

import { resolveNextStep } from "./storyFlow";

/**
 * 장면 종료 판정: 게임오버 > 전이 규칙(storyFlow) > 화면 이동 / 다음 장면 / 스테이지 끝
 * 이동이면 completed true (게임오버 제외)
 */
export const resolveAfterScene = ({ stage, sceneIndex, sceneCount, score, gameOver }) => {
  // 게임오버 선택은 점수와 무관하게 종료 화면
  if (gameOver) return { type: "navigate", to: ROUTES.GAME_OVER, completed: false };

  const step = resolveNextStep(stage, sceneIndex, score);
  if (step.type === "navigate") return { type: "navigate", to: step.to, completed: true };

  // 다음 장면 인덱스가 장면 수를 넘으면 스테이지 끝
  if (step.index >= sceneCount) return { type: "stageEnd" };
  return { type: "scene", index: step.index };
};
