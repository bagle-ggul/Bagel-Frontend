import { ROUTES } from "../constants/routes";
import stageRules from "../data/stageRules.json";

/**
 * 스토리 전이 엔진
 *
 * 규칙은 `src/data/stageRules.json`에 있다. 이 파일은 그 규칙을 **평가**만 한다.
 * 씬을 추가하거나 점수 임계치를 바꾸려면 JSON만 고치면 되고, 이 코드는 손대지 않는다.
 *
 * 원래는 `BagelSelectPageComponent`의 `onSubClicked()`에 숫자 조건문 60줄로 박혀 있었다.
 * 컴포넌트가 스토리 구조를 알고 있어서, 씬 하나를 추가하려면 컴포넌트를 고쳐야 했다.
 *
 * 동작은 그대로다. 값의 근거는 docs/GAME-FLOW.md,
 * 회귀 검증은 storyFlow.test.js의 전 경로 기대값 표가 담당한다.
 */

/**
 * 전이 규칙의 조건을 평가한다.
 * `when`이 없으면 항상 참 — 규칙 배열의 마지막 기본값으로 쓴다.
 *
 * @param {Object} [when] `{ scoreMin, scoreMax }`. scoreMax는 **미만**
 * @param {number} score
 * @returns {boolean}
 */
const matches = (when, score) => {
  if (!when) return true;
  if (when.scoreMin !== undefined && score < when.scoreMin) return false;
  if (when.scoreMax !== undefined && score >= when.scoreMax) return false;
  return true;
};

/**
 * 현재 씬을 마쳤을 때 다음에 무엇을 할지 결정한다.
 *
 * @param {number} scene 스테이지 번호 (1~5)
 * @param {number} index 방금 마친 씬 인덱스
 * @param {number} score 현재까지 누적 점수
 * @returns {{type: "scene", index: number} | {type: "navigate", to: string}}
 */
export const resolveNextStep = (scene, index, score) => {
  const rules = stageRules.stages?.[String(scene)]?.scenes?.[String(index)];

  if (rules) {
    const matched = rules.find((rule) => matches(rule.when, score));
    if (matched) {
      if (matched.exit) return { type: "navigate", to: matched.exit };
      return { type: "scene", index: matched.to };
    }
  }

  // 규칙이 없는 씬은 순서대로 진행한다.
  // 씬 인덱스가 데이터 길이를 넘으면 컴포넌트가 "다음 스테이지로" 버튼을 띄운다.
  return { type: "scene", index: index + 1 };
};

/**
 * 스테이지를 마쳤을 때 이동할 다음 스테이지 경로.
 *
 * 카페(2)에서 "돈을 줍는다"(첫 선택지)를 고르면 우산(4), 아니면 동굴(3)로 간다.
 * `data4`의 도입부 "얻은 돈으로 편의점에서 우산을 사올 수 있었다"가 이 선택과 연결된다.
 *
 * @param {number} scene 스테이지 번호
 * @param {number} choiceIndex 고른 선택지 인덱스
 * @param {string} defaultRoute 분기 규칙이 없는 스테이지의 기본 목적지
 * @returns {string} 다음 스테이지 경로
 */
export const resolveStageExit = (scene, choiceIndex, defaultRoute) => {
  const exitRule = stageRules.stages?.[String(scene)]?.stageExit;
  if (!exitRule) return defaultRoute;

  return exitRule.byChoice?.[String(choiceIndex)] ?? exitRule.default ?? defaultRoute;
};

/** 결과 화면 경로. 데이터의 exit 값과 일치해야 한다 */
export const RESULT_ROUTE = ROUTES.RESULT;

const storyFlow = { resolveNextStep, resolveStageExit, RESULT_ROUTE };

export default storyFlow;
