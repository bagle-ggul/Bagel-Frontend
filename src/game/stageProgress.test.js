import { toStageScript } from "./dialogueScript";
import { resolveAfterScene } from "./stageProgress";
import { STAGE_CONFIGS } from "./stages";
import { resolveStageExit } from "./storyFlow";

const NO_NAME = { playerName: "" };

// 가짜 플레이어: 선택 인덱스 배열대로 장면을 진행하고 점수를 누적
const playStage = (stage, choiceIndexes) => {
  const script = toStageScript(STAGE_CONFIGS[stage].storyData, NO_NAME);
  let sceneIndex = 0;
  let score = 0;
  let lastChoiceIndex = 0;
  for (let turn = 0; turn < 50; turn += 1) {
    const choiceIndex = choiceIndexes[turn] ?? 0;
    const choice = script[sceneIndex].choices[choiceIndex];
    score += choice.score;
    lastChoiceIndex = choiceIndex;
    const after = resolveAfterScene({
      stage,
      sceneIndex,
      sceneCount: script.length,
      score,
      gameOver: choice.gameOver,
    });
    if (after.type !== "scene") return { after, score, lastChoiceIndex };
    sceneIndex = after.index;
  }
  throw new Error("진행이 끝나지 않음");
};

describe("resolveAfterScene", () => {
  it("게임오버 선택은 점수와 무관하게 /over, completed false", () => {
    expect(
      resolveAfterScene({ stage: 2, sceneIndex: 0, sceneCount: 4, score: 100, gameOver: true })
    ).toEqual({ type: "navigate", to: "/over", completed: false });
  });

  it("스테이지 2 첫 장면 20점이면 장면 1", () => {
    expect(
      resolveAfterScene({ stage: 2, sceneIndex: 0, sceneCount: 4, score: 20, gameOver: false })
    ).toEqual({ type: "scene", index: 1 });
  });

  it("스테이지 5 장면 2를 마치면 /result, completed true", () => {
    expect(
      resolveAfterScene({ stage: 5, sceneIndex: 2, sceneCount: 3, score: 0, gameOver: false })
    ).toEqual({ type: "navigate", to: "/result", completed: true });
  });

  it("스테이지 1 마지막 장면을 마치면 stageEnd", () => {
    expect(
      resolveAfterScene({ stage: 1, sceneIndex: 2, sceneCount: 3, score: 0, gameOver: false })
    ).toEqual({ type: "stageEnd" });
  });
});

describe("선택 경로별 최종 목적지", () => {
  it("스테이지 1 전부 0번 선택 > stageEnd, 점수 25", () => {
    const { after, score } = playStage(1, []);
    expect(after).toEqual({ type: "stageEnd" });
    expect(score).toBe(25);
  });

  it("카페 마지막 장면 0번 > 다음 스테이지 /main4", () => {
    const { after, lastChoiceIndex } = playStage(2, []);
    expect(after).toEqual({ type: "stageEnd" });
    expect(resolveStageExit(2, lastChoiceIndex, STAGE_CONFIGS[2].defaultExit)).toBe("/main4");
  });

  it("해변 장면 2 종료 > /result", () => {
    const { after } = playStage(5, []);
    expect(after).toEqual({ type: "navigate", to: "/result", completed: true });
  });
});
