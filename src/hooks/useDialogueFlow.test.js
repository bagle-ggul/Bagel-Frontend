import { act, renderHook } from "@testing-library/react";
import { StrictMode } from "react";

import { PHASE } from "../game/dialogueFlow";
import { clearSeenLines, isLineSeen } from "../game/seenLines";

import { useDialogueFlow } from "./useDialogueFlow";

const narration = (text) => ({ speakerId: "narration", speakerName: "", text });
const sujung = (text) => ({ speakerId: "sujung", speakerName: "이수정", text });

// 장면 0: 2줄 + 선택지 2개, 장면 1: 1줄 + 선택지 없음
const script = [
  {
    sprite: "/sujung.webp",
    lines: [narration("바람이 분다."), sujung("안녕?")],
    choices: [
      { label: "반가워", score: 5, gameOver: false, followUp: [sujung("나도!")] },
      { label: "누구세요", score: -5, gameOver: true, followUp: [] },
    ],
  },
  {
    sprite: null,
    lines: [{ ...narration("다음 날."), sprite: "/morning.webp" }],
    choices: [],
  },
];

// 줄·선택지 없는 장면 (시작하자마자 sceneDone)
const emptyScene = { sprite: null, lines: [], choices: [] };

const setup = (overrides = {}, renderOptions = {}) => {
  const callbacks = { onChoose: jest.fn(), onSceneDone: jest.fn() };
  const initialProps = {
    script,
    scopeId: "stage1",
    playerName: "민수",
    ...callbacks,
    ...overrides,
  };
  const view = renderHook((props) => useDialogueFlow(props), {
    initialProps,
    ...renderOptions,
  });
  return { ...callbacks, ...view };
};

describe("useDialogueFlow", () => {
  beforeEach(() => clearSeenLines());

  it("advance로 줄을 넘긴다", () => {
    const { result } = setup();
    expect(result.current.line.text).toBe("바람이 분다.");
    expect(result.current.lineKey).toBe("stage1:0:s:0");
    expect(result.current.sprite).toBe("/sujung.webp");

    act(() => result.current.advance());
    expect(result.current.line.text).toBe("안녕?");

    act(() => result.current.advance());
    expect(result.current.flow.phase).toBe(PHASE.CHOICES);
    expect(result.current.line).toBeNull();
    expect(result.current.choices.map((choice) => choice.label)).toEqual(["반가워", "누구세요"]);
  });

  it("선택하면 onChoose 후 followUp", () => {
    const { result, onChoose } = setup();
    act(() => result.current.advance());
    act(() => result.current.advance());
    act(() => result.current.choose(0));

    expect(onChoose).toHaveBeenCalledWith({
      sceneIndex: 0,
      choiceIndex: 0,
      choice: script[0].choices[0],
    });
    expect(result.current.flow.phase).toBe(PHASE.FOLLOW_UP);
    expect(result.current.line.text).toBe("나도!");
    expect(result.current.choices).toEqual([]);
  });

  it("선택지 단계가 아니면 choose를 무시한다", () => {
    const { result, onChoose } = setup();
    act(() => result.current.choose(0));
    expect(onChoose).not.toHaveBeenCalled();
    expect(result.current.flow.phase).toBe(PHASE.LINES);
  });

  it("sceneDone이면 onSceneDone을 한 번 부르고 반환한 장면으로 이동", () => {
    const onSceneDone = jest.fn(() => ({ type: "scene", index: 1 }));
    const { result } = setup({ onSceneDone });
    act(() => result.current.advance());
    act(() => result.current.advance());
    act(() => result.current.choose(1));

    expect(onSceneDone).toHaveBeenCalledTimes(1);
    expect(onSceneDone).toHaveBeenCalledWith({
      sceneIndex: 0,
      choiceIndex: 1,
      choice: script[0].choices[1],
    });
    expect(result.current.flow).toEqual({
      sceneIndex: 1,
      phase: PHASE.LINES,
      lineIndex: 0,
      choiceIndex: null,
    });
    // 줄 sprite가 장면 sprite보다 우선
    expect(result.current.sprite).toBe("/morning.webp");
  });

  it("end를 반환하면 ended", () => {
    const onSceneDone = jest.fn(() => ({ type: "end" }));
    const { result } = setup({ onSceneDone, initialSceneIndex: 1 });
    act(() => result.current.advance());

    expect(onSceneDone).toHaveBeenCalledTimes(1);
    expect(onSceneDone).toHaveBeenCalledWith({ sceneIndex: 1, choiceIndex: null, choice: null });
    expect(result.current.flow.phase).toBe(PHASE.ENDED);
  });

  it("없는 장면 번호를 반환하면 ended", () => {
    const onSceneDone = jest.fn(() => ({ type: "scene", index: 9 }));
    const { result } = setup({ onSceneDone, initialSceneIndex: 1 });
    act(() => result.current.advance());
    expect(result.current.flow.phase).toBe(PHASE.ENDED);
  });

  it("반환이 없으면 sceneDone에 머물고 다시 부르지 않는다", () => {
    const { result, onSceneDone, rerender } = setup({ initialSceneIndex: 1 });
    act(() => result.current.advance());
    rerender({ script, scopeId: "stage1", playerName: "민수", onSceneDone, initialSceneIndex: 1 });

    expect(onSceneDone).toHaveBeenCalledTimes(1);
    expect(result.current.flow.phase).toBe(PHASE.SCENE_DONE);
    expect(result.current.line).toBeNull();
    expect(result.current.lineKey).toBeNull();
  });

  it("줄마다 log에 쌓이고 선택도 기록된다", () => {
    const { result } = setup();
    act(() => result.current.advance());
    act(() => result.current.advance());
    act(() => result.current.choose(0));

    expect(
      result.current.log.map(({ speakerId, speakerName, text }) => [speakerId, speakerName, text])
    ).toEqual([
      ["narration", "", "바람이 분다."],
      ["sujung", "이수정", "안녕?"],
      ["choice", "민수", "반가워"],
      ["sujung", "이수정", "나도!"],
    ]);
    expect(new Set(result.current.log.map((entry) => entry.id)).size).toBe(4);
  });

  it("본 줄로 기록한다", () => {
    const first = setup();
    expect(first.result.current.isLineSeenBefore).toBe(false);
    expect(isLineSeen("stage1:0:s:0")).toBe(true);
    act(() => first.result.current.advance());
    expect(first.result.current.isLineSeenBefore).toBe(false);
    first.unmount();

    const second = setup();
    expect(second.result.current.isLineSeenBefore).toBe(true);
  });

  it("다른 scopeId의 줄은 본 줄이 아니다", () => {
    setup().unmount();
    const { result } = setup({ scopeId: "stage2" });
    expect(result.current.isLineSeenBefore).toBe(false);
  });

  it("다음 장면도 곧바로 끝나면 onSceneDone을 다시 부른다", () => {
    const onSceneDone = jest.fn(({ sceneIndex }) =>
      sceneIndex === 0 ? { type: "scene", index: 1 } : { type: "end" }
    );
    const { result } = setup({ script: [emptyScene, emptyScene], onSceneDone });

    expect(onSceneDone).toHaveBeenCalledTimes(2);
    expect(onSceneDone.mock.calls.map(([payload]) => payload.sceneIndex)).toEqual([0, 1]);
    expect(result.current.flow.phase).toBe(PHASE.ENDED);
  });

  it("StrictMode에서도 onSceneDone을 한 번만 부른다", () => {
    const onSceneDone = jest.fn();
    setup({ script: [emptyScene], onSceneDone }, { wrapper: StrictMode });
    expect(onSceneDone).toHaveBeenCalledTimes(1);
  });

  it("범위 밖 initialSceneIndex는 0번 장면에서 시작한다", () => {
    const { result } = setup({ initialSceneIndex: 7 });
    expect(result.current.flow.sceneIndex).toBe(0);
    expect(result.current.line.text).toBe("바람이 분다.");
  });
});
