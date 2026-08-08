import { ROUTES } from "../constants/routes";

/**
 * 스토리 전이 규칙
 *
 * 이 규칙은 원래 `BagelSelectPageComponent`의 `onSubClicked()` 안에
 * `scene`/`index` 숫자 조건문 약 60줄로 박혀 있었다. 컴포넌트가 스토리 구조를
 * 알고 있어서, 씬을 하나 추가하려면 데이터가 아니라 컴포넌트를 고쳐야 했다.
 *
 * 여기서는 **동작을 그대로 유지한 채** 순수 함수로만 떼어냈다.
 * 순수 함수가 되면 전 경로를 테스트로 검증할 수 있고, 그 테스트가
 * 이후 데이터화(JSON 스키마 전환)의 회귀 안전망이 된다.
 *
 * 값은 바꾸지 않았다. 임계치가 이상해 보여도 그것이 현재 동작이다.
 * 근거는 docs/GAME-FLOW.md에 기록되어 있다.
 */

/** 스테이지 종료를 뜻하는 신호. 씬 인덱스 대신 이 값을 반환한다. */
export const STAGE_END = "STAGE_END";

/**
 * 현재 씬을 마쳤을 때 다음에 무엇을 할지 결정한다.
 *
 * @param {number} scene 스테이지 번호 (1~5)
 * @param {number} index 방금 마친 씬 인덱스
 * @param {number} score 현재까지 누적 점수
 * @returns {{type: "scene", index: number} | {type: "navigate", to: string} | {type: "end"}}
 */
export const resolveNextStep = (scene, index, score) => {
  const toScene = (i) => ({ type: "scene", index: i });

  if (scene === 2) {
    if (index === 0) {
      if (score >= 15 && score < 40) return toScene(1);
      if (score < 15) return toScene(2);
      return toScene(3);
    }
    // 점수 분기로 1 또는 2에 들어왔다면 공통 씬(3)으로 합류한다
    if (index === 1 || index === 2) return toScene(3);
    return toScene(index + 1);
  }

  if (scene === 3) {
    if (index === 1) {
      if (score >= 60) return toScene(2);
      if (score >= 20) return toScene(3);
      return toScene(4);
    }
    if (index === 2 || index === 3 || index === 4) return toScene(5);
    return toScene(index + 1);
  }

  if (scene === 4) {
    // 점수가 높으면 특수 씬(맥주)을 거친다.
    // 데이터에 `love: 60`이 선언돼 있으나 실제 동작은 70이다 (docs/GAME-FLOW.md 참조)
    if (index === 2) {
      return score >= 70 ? toScene(3) : toScene(4);
    }
    return toScene(index + 1);
  }

  if (scene === 5) {
    // 마지막 스테이지를 마치면 결과 화면으로 나간다
    if (index === 2) return { type: "navigate", to: ROUTES.RESULT };
    return toScene(index + 1);
  }

  return toScene(index + 1);
};

/**
 * 스테이지를 마쳤을 때 이동할 다음 스테이지 경로.
 *
 * 카페(2)에서 "돈을 줍는다"(첫 선택지)를 고르면 우산(4), 아니면 동굴(3)로 간다.
 * `data4`의 도입부 "얻은 돈으로 편의점에서 우산을 사올 수 있었다"가 이 선택과 연결된다.
 *
 * @param {number} scene 스테이지 번호
 * @param {number} choiceIndex 고른 선택지 인덱스
 * @param {string} defaultRoute 분기가 없는 스테이지의 기본 목적지
 * @returns {string} 다음 스테이지 경로
 */
export const resolveStageExit = (scene, choiceIndex, defaultRoute) => {
  if (scene === 2) {
    return choiceIndex === 0 ? ROUTES.MAIN4 : ROUTES.MAIN3;
  }
  return defaultRoute;
};

const storyFlow = { STAGE_END, resolveNextStep, resolveStageExit };

export default storyFlow;
