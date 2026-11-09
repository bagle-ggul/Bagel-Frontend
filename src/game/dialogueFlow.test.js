import {
  advanceFlow,
  chooseFlow,
  createFlowState,
  endFlow,
  PHASE,
  selectChoices,
  selectLine,
  selectLineKey,
} from "./dialogueFlow";

const line = (text) => ({
  speakerId: "narration",
  speakerName: "",
  text,
});

const choiceScene = {
  sprite: null,
  lines: [line("a"), line("b")],
  choices: [
    { label: "x", score: 1, gameOver: false, followUp: [line("f1"), line("f2")] },
    { label: "y", score: 0, gameOver: false, followUp: [] },
  ],
};
const plainScene = { sprite: null, lines: [line("a")], choices: [] };
const emptyScene = { sprite: null, lines: [], choices: choiceScene.choices };
const nothingScene = { sprite: null, lines: [], choices: [] };

const toChoices = () => {
  let state = createFlowState(choiceScene, 0);
  state = advanceFlow(state, choiceScene);
  return advanceFlow(state, choiceScene);
};

describe("dialogueFlow", () => {
  it("대사를 끝까지 넘기면 선택지 단계가 된다", () => {
    const state = toChoices();
    expect(state.phase).toBe(PHASE.CHOICES);
    expect(selectChoices(state, choiceScene)).toHaveLength(2);
  });

  it("선택지 단계에서 advance는 상태를 바꾸지 않는다", () => {
    const state = toChoices();
    expect(advanceFlow(state, choiceScene)).toBe(state);
  });

  it("대사 단계에서 choose는 무시된다", () => {
    const state = createFlowState(choiceScene, 0);
    expect(chooseFlow(state, choiceScene, 0)).toBe(state);
  });

  it("범위 밖 선택은 무시된다", () => {
    const state = toChoices();
    expect(chooseFlow(state, choiceScene, 5)).toBe(state);
    expect(chooseFlow(state, choiceScene, -1)).toBe(state);
  });

  it("선택하면 이어지는 대사 0번 줄부터 진행한다", () => {
    const state = chooseFlow(toChoices(), choiceScene, 0);
    expect(state).toMatchObject({
      phase: PHASE.FOLLOW_UP,
      lineIndex: 0,
      choiceIndex: 0,
    });
    expect(selectLine(state, choiceScene).text).toBe("f1");
  });

  it("이어지는 대사를 다 넘기면 sceneDone", () => {
    let state = chooseFlow(toChoices(), choiceScene, 0);
    state = advanceFlow(state, choiceScene);
    expect(state.phase).toBe(PHASE.FOLLOW_UP);
    state = advanceFlow(state, choiceScene);
    expect(state.phase).toBe(PHASE.SCENE_DONE);
  });

  it("followUp이 비면 선택 즉시 sceneDone", () => {
    const state = chooseFlow(toChoices(), choiceScene, 1);
    expect(state.phase).toBe(PHASE.SCENE_DONE);
    expect(state.choiceIndex).toBe(1);
  });

  it("선택지 없는 장면은 마지막 줄 다음이 sceneDone", () => {
    const state = advanceFlow(createFlowState(plainScene, 1), plainScene);
    expect(state.phase).toBe(PHASE.SCENE_DONE);
  });

  it("줄이 없는 장면은 선택지로 시작한다", () => {
    expect(createFlowState(emptyScene).phase).toBe(PHASE.CHOICES);
    expect(createFlowState(nothingScene).phase).toBe(PHASE.SCENE_DONE);
  });

  it("selectLineKey는 장면·선택·줄 번호로 고유하다", () => {
    let state = advanceFlow(createFlowState(choiceScene, 0), choiceScene);
    expect(selectLineKey(state, "s1")).toBe("s1:0:s:1");
    state = chooseFlow(toChoices(), choiceScene, 0);
    expect(selectLineKey(state, "s1")).toBe("s1:0:0:0");
  });

  it("선택지 단계의 키는 null", () => {
    expect(selectLineKey(toChoices(), "s1")).toBeNull();
  });

  it("줄이 없는 phase의 selectLine은 null, 선택지는 빈 배열", () => {
    const state = toChoices();
    expect(selectLine(state, choiceScene)).toBeNull();
    const done = endFlow(state);
    expect(done.phase).toBe(PHASE.ENDED);
    expect(selectChoices(done, choiceScene)).toEqual([]);
    expect(advanceFlow(done, choiceScene)).toBe(done);
  });
});
