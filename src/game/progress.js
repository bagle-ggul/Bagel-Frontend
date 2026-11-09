import { logger } from "../utils/logger";

import { getPreviousStages } from "./stageGraph";

/**
 * 게임 진행 상태 영속화
 *
 * sessionStorage를 쓰는 이유: 탭을 닫으면 초기화되는 편이 자연스럽다.
 * localStorage를 쓰면 다음 방문 시 이전 게임의 점수가 남아 혼란을 준다.
 *
 * UI 설정(utils/storage.js)과 분리한 이유: 게임 진행은 한 판의 수명을 갖고
 * 매 게임 시작 시 초기화되지만, 설정은 사용자 환경으로 계속 유지된다.
 */

export const PROGRESS_KEYS = {
  SCORE: "bagel:game:score",
  MAX_STAGE: "bagel:game:maxStage",
  COMPLETED: "bagel:game:completed",
  // 이번 회차 고른 선택 [{ stage, sceneIndex, choiceIndex, label }]
  CHOICE_HISTORY: "bagel:game:choiceHistory",
  // 게임오버로 되돌아간 횟수 (회귀 재시작에도 유지, 새 게임에서만 초기화)
  REGRESSION_COUNT: "bagel:game:regressionCount",
};

/**
 * 현재 점수 조회
 * @returns {number} 저장된 점수. 없거나 손상되면 0
 */
export const getScore = () => {
  const raw = sessionStorage.getItem(PROGRESS_KEYS.SCORE);
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : 0;
};

/**
 * 점수 저장
 * @param {number} score
 */
export const setScore = (score) => {
  sessionStorage.setItem(PROGRESS_KEYS.SCORE, String(score));
};

/**
 * 도달한 최대 스테이지 조회
 * @returns {number} 1~5. 아직 시작 전이면 0
 */
export const getMaxStage = () => {
  const raw = sessionStorage.getItem(PROGRESS_KEYS.MAX_STAGE);
  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
};

/**
 * 스테이지 도달 기록.
 * 뒤로가기로 이전 스테이지를 봐도 최대 도달치는 내려가지 않는다.
 * @param {number} stage
 */
export const markStageReached = (stage) => {
  if (!Number.isFinite(stage) || stage <= 0) return;
  if (stage > getMaxStage()) {
    sessionStorage.setItem(PROGRESS_KEYS.MAX_STAGE, String(stage));
  }
};

/**
 * 게임 완료 여부 (엔딩·결과 화면 진입 자격)
 * @returns {boolean}
 */
export const isGameCompleted = () => {
  return sessionStorage.getItem(PROGRESS_KEYS.COMPLETED) === "true";
};

/** 게임 완료 표시 */
export const markGameCompleted = () => {
  sessionStorage.setItem(PROGRESS_KEYS.COMPLETED, "true");
};

// 저장소 쓰기·삭제 (용량 초과·사생활 모드 실패는 기록만 포기, 플레이는 계속)
const writeProgressItem = (key, value) => {
  try {
    sessionStorage.setItem(key, value);
  } catch (error) {
    logger.warn(`[progress] write failed : ${key}`, error);
  }
};

const removeProgressItem = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (error) {
    logger.warn(`[progress] remove failed : ${key}`, error);
  }
};

/** 이번 회차 고른 선택 목록 (손상된 JSON·저장소 막힘은 빈 목록) */
export const getChoiceHistory = () => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(PROGRESS_KEYS.CHOICE_HISTORY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

/**
 * 선택 기록: 같은 스테이지·장면 기존 기록 제거 후 추가 (뒤로가기·재진입 시 중복 방지)
 */
export const recordChoice = ({ stage, sceneIndex, choiceIndex, label }) => {
  const otherChoices = getChoiceHistory().filter(
    (entry) => !(entry.stage === stage && entry.sceneIndex === sceneIndex)
  );
  const nextHistory = [...otherChoices, { stage, sceneIndex, choiceIndex, label }];
  writeProgressItem(PROGRESS_KEYS.CHOICE_HISTORY, JSON.stringify(nextHistory));
};

/** 회귀 횟수 (없거나 손상되면 0) */
export const getRegressionCount = () => {
  try {
    const parsed = Number(sessionStorage.getItem(PROGRESS_KEYS.REGRESSION_COUNT));
    return Number.isInteger(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
};

/** 회귀 횟수 1 증가 (게임오버 선택 시) */
export const incrementRegressionCount = () => {
  writeProgressItem(PROGRESS_KEYS.REGRESSION_COUNT, String(getRegressionCount() + 1));
};

/**
 * 회차 상태 초기화 (게임오버 후 회귀 재시작): 점수, 도달 스테이지, 완료, 고른 선택
 * 회귀 횟수는 유지
 */
export const resetRunProgress = () => {
  sessionStorage.removeItem(PROGRESS_KEYS.SCORE);
  sessionStorage.removeItem(PROGRESS_KEYS.MAX_STAGE);
  sessionStorage.removeItem(PROGRESS_KEYS.COMPLETED);
  removeProgressItem(PROGRESS_KEYS.CHOICE_HISTORY);
};

/**
 * 진행 상태 전체 초기화 (새 게임 시작): 회차 상태 + 회귀 횟수
 */
export const resetProgress = () => {
  resetRunProgress();
  removeProgressItem(PROGRESS_KEYS.REGRESSION_COUNT);
};

/**
 * 스테이지 진입 자격: 들어올 수 있는 직전 스테이지 중 하나라도 도달했으면 통과
 * (분기 2 > 4, 3 > 5는 번호가 하나씩 이어지지 않음 > "번호 - 1" 판정이면 막힘)
 *
 * @param {number} stage 진입하려는 스테이지 번호 (1~5)
 * @returns {boolean}
 */
export const canEnterStage = (stage) => {
  if (stage <= 1) return true; // 첫 스테이지는 인트로만 거치면 된다
  const previousStages = getPreviousStages(stage);
  if (previousStages.length === 0) return false;
  return getMaxStage() >= Math.min(...previousStages);
};

const progress = {
  PROGRESS_KEYS,
  getScore,
  setScore,
  getMaxStage,
  markStageReached,
  isGameCompleted,
  markGameCompleted,
  getChoiceHistory,
  recordChoice,
  getRegressionCount,
  incrementRegressionCount,
  resetRunProgress,
  resetProgress,
  canEnterStage,
};

export default progress;
