/**
 * 대사 진행 상태: 대사 > 선택지 > 이어지는 대사 > 장면 종료
 * 모두 순수 함수. 상태는 바꾸지 않고 새 객체를 반환
 */

export const PHASE = {
  LINES: "lines", // 본 대사 진행 중
  CHOICES: "choices", // 선택지 표시 중
  FOLLOW_UP: "followUp", // 선택 후 이어지는 대사
  SCENE_DONE: "sceneDone", // 장면 끝 (다음 장면 이동 대기)
  ENDED: "ended", // 게임 종료
};

const NO_CHOICE_KEY = "s"; // 본 대사 줄의 키 구분자

// 선택지 단계 진입 (선택지 없으면 장면 종료)
const enterChoices = (state, script) => ({
  ...state,
  phase: script.choices.length > 0 ? PHASE.CHOICES : PHASE.SCENE_DONE,
  lineIndex: 0,
  choiceIndex: null,
});

/**
 * 장면 시작 상태 (줄 없음 > 선택지, 선택지도 없음 > 장면 종료)
 */
export const createFlowState = (script, sceneIndex = 0) => {
  const initialState = {
    sceneIndex,
    phase: PHASE.LINES,
    lineIndex: 0,
    choiceIndex: null,
  };
  return script.lines.length > 0 ? initialState : enterChoices(initialState, script);
};

/**
 * 다음 줄로 진행 (마지막 줄이면 다음 단계, 그 외 phase는 그대로)
 */
export const advanceFlow = (state, script) => {
  if (state.phase === PHASE.LINES) {
    if (state.lineIndex + 1 < script.lines.length) {
      return { ...state, lineIndex: state.lineIndex + 1 };
    }
    return enterChoices(state, script);
  }
  if (state.phase === PHASE.FOLLOW_UP) {
    const followUp = script.choices[state.choiceIndex].followUp;
    if (state.lineIndex + 1 < followUp.length) {
      return { ...state, lineIndex: state.lineIndex + 1 };
    }
    return { ...state, phase: PHASE.SCENE_DONE };
  }
  return state;
};

/**
 * 선택지 선택 (선택지 단계 + 범위 안일 때만, followUp 비면 장면 종료)
 */
export const chooseFlow = (state, script, choiceIndex) => {
  const isChoosable =
    state.phase === PHASE.CHOICES &&
    Number.isInteger(choiceIndex) &&
    choiceIndex >= 0 &&
    choiceIndex < script.choices.length;
  if (!isChoosable) return state;

  const hasFollowUp = script.choices[choiceIndex].followUp.length > 0;
  return {
    ...state,
    phase: hasFollowUp ? PHASE.FOLLOW_UP : PHASE.SCENE_DONE,
    lineIndex: 0,
    choiceIndex,
  };
};

/**
 * 게임 종료 상태
 */
export const endFlow = (state) => ({ ...state, phase: PHASE.ENDED });

/**
 * 지금 보여줄 줄 (줄이 없는 phase면 null)
 */
export const selectLine = (state, script) => {
  if (state.phase === PHASE.LINES) {
    return script.lines[state.lineIndex] ?? null;
  }
  if (state.phase === PHASE.FOLLOW_UP) {
    return script.choices[state.choiceIndex]?.followUp[state.lineIndex] ?? null;
  }
  return null;
};

/**
 * 선택지 단계의 선택지 목록 (그 외 phase는 빈 배열)
 */
export const selectChoices = (state, script) =>
  state.phase === PHASE.CHOICES ? script.choices : [];

/**
 * 본 줄 기록용 고유 키: {scopeId}:{장면}:{선택지|s}:{줄} (줄 없는 phase는 null)
 */
export const selectLineKey = (state, scopeId) => {
  const hasLine = state.phase === PHASE.LINES || state.phase === PHASE.FOLLOW_UP;
  if (!hasLine) return null;
  const choiceKey = state.choiceIndex ?? NO_CHOICE_KEY;
  return `${scopeId}:${state.sceneIndex}:${choiceKey}:${state.lineIndex}`;
};
