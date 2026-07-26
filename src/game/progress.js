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

/**
 * 진행 상태 전체 초기화 (새 게임 시작)
 */
export const resetProgress = () => {
  sessionStorage.removeItem(PROGRESS_KEYS.SCORE);
  sessionStorage.removeItem(PROGRESS_KEYS.MAX_STAGE);
  sessionStorage.removeItem(PROGRESS_KEYS.COMPLETED);
};

/**
 * 해당 스테이지에 진입할 자격이 있는지 판정.
 * 직전 스테이지까지 도달했으면 통과시킨다.
 *
 * @param {number} stage 진입하려는 스테이지 번호 (1~5)
 * @returns {boolean}
 */
export const canEnterStage = (stage) => {
  if (stage <= 1) return true; // 첫 스테이지는 인트로만 거치면 된다
  return getMaxStage() >= stage - 1;
};

const progress = {
  PROGRESS_KEYS,
  getScore,
  setScore,
  getMaxStage,
  markStageReached,
  isGameCompleted,
  markGameCompleted,
  resetProgress,
  canEnterStage,
};

export default progress;
