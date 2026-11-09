/**
 * 스테이지 연결 지도: 다음 후보·직전 후보 조회
 * 스토리 데이터와 분리 (진행도 가드가 메인 번들에서 쓰므로 가볍게 유지)
 */

/** 스테이지 > 다음에 갈 수 있는 후보 스테이지 (2 > 3 동굴 또는 4 우산) */
export const NEXT_STAGES = { 1: [2], 2: [3, 4], 3: [5], 4: [5], 5: [] };

/** 스테이지 > 이 스테이지로 들어올 수 있는 직전 스테이지 목록 */
export const getPreviousStages = (stage) =>
  Object.entries(NEXT_STAGES)
    .filter(([, nextStages]) => nextStages.includes(stage))
    .map(([fromStage]) => Number(fromStage));
