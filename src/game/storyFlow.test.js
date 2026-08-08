import { ROUTES } from "../constants/routes";

import { resolveNextStep, resolveStageExit } from "./storyFlow";

/**
 * 이 테스트는 **현재 동작의 기대값 표**다.
 *
 * 스토리 분기를 JSON 데이터로 옮길 때, 마이그레이션 전후로 이 테스트가 모두 통과해야
 * 회귀가 없다고 말할 수 있다. 값이 이상해 보여도 바꾸지 않는다 —
 * 여기 적힌 것이 실제로 배포되어 동작 중인 규칙이다.
 *
 * 근거: docs/GAME-FLOW.md
 */

const sceneAt = (index) => ({ type: "scene", index });

describe("스테이지 1 (집) — 분기 없음", () => {
  it("씬을 순서대로 넘긴다", () => {
    expect(resolveNextStep(1, 0, 0)).toEqual(sceneAt(1));
    expect(resolveNextStep(1, 3, 999)).toEqual(sceneAt(4));
  });

  it("점수가 진행에 영향을 주지 않는다", () => {
    expect(resolveNextStep(1, 2, 0)).toEqual(resolveNextStep(1, 2, 500));
  });
});

describe("스테이지 2 (카페) — 첫 씬에서 점수로 갈린다", () => {
  it("15점 미만이면 씬 2로", () => {
    expect(resolveNextStep(2, 0, 0)).toEqual(sceneAt(2));
    expect(resolveNextStep(2, 0, 14)).toEqual(sceneAt(2));
  });

  it("15~39점이면 씬 1로", () => {
    expect(resolveNextStep(2, 0, 15)).toEqual(sceneAt(1));
    expect(resolveNextStep(2, 0, 39)).toEqual(sceneAt(1));
  });

  it("40점 이상이면 씬 3으로", () => {
    expect(resolveNextStep(2, 0, 40)).toEqual(sceneAt(3));
    expect(resolveNextStep(2, 0, 100)).toEqual(sceneAt(3));
  });

  // 점수 분기로 1 또는 2에 들어왔으면 공통 씬(3)으로 합류한다
  it("씬 1·2를 마치면 씬 3으로 합류한다", () => {
    expect(resolveNextStep(2, 1, 0)).toEqual(sceneAt(3));
    expect(resolveNextStep(2, 2, 0)).toEqual(sceneAt(3));
  });

  it("씬 3을 마치면 스테이지가 끝난다 (plot 길이 4 초과)", () => {
    expect(resolveNextStep(2, 3, 0)).toEqual(sceneAt(4));
  });
});

describe("스테이지 3 (동굴) — 두 번째 씬에서 점수로 갈린다", () => {
  it("60점 이상이면 씬 2로", () => {
    expect(resolveNextStep(3, 1, 60)).toEqual(sceneAt(2));
    expect(resolveNextStep(3, 1, 200)).toEqual(sceneAt(2));
  });

  it("20~59점이면 씬 3으로", () => {
    expect(resolveNextStep(3, 1, 20)).toEqual(sceneAt(3));
    expect(resolveNextStep(3, 1, 59)).toEqual(sceneAt(3));
  });

  it("20점 미만이면 씬 4로", () => {
    expect(resolveNextStep(3, 1, 0)).toEqual(sceneAt(4));
    expect(resolveNextStep(3, 1, 19)).toEqual(sceneAt(4));
  });

  it("씬 2·3·4를 마치면 씬 5로 합류한다", () => {
    expect(resolveNextStep(3, 2, 0)).toEqual(sceneAt(5));
    expect(resolveNextStep(3, 3, 0)).toEqual(sceneAt(5));
    expect(resolveNextStep(3, 4, 0)).toEqual(sceneAt(5));
  });

  it("첫 씬은 순서대로 넘어간다", () => {
    expect(resolveNextStep(3, 0, 0)).toEqual(sceneAt(1));
  });

  it("씬 5를 마치면 스테이지가 끝난다 (plot 길이 6 초과)", () => {
    expect(resolveNextStep(3, 5, 0)).toEqual(sceneAt(6));
  });
});

describe("스테이지 4 (우산) — 특수 씬 임계치", () => {
  // 데이터에는 love: 60이 선언돼 있으나 실제 동작은 70이다.
  // 값 불일치는 알려진 결함이며 마이그레이션 시 동작(70)을 유지한다.
  it("70점 이상이면 특수 씬(3)으로 간다", () => {
    expect(resolveNextStep(4, 2, 70)).toEqual(sceneAt(3));
    expect(resolveNextStep(4, 2, 150)).toEqual(sceneAt(3));
  });

  it("70점 미만이면 특수 씬을 건너뛴다", () => {
    expect(resolveNextStep(4, 2, 69)).toEqual(sceneAt(4));
    expect(resolveNextStep(4, 2, 0)).toEqual(sceneAt(4));
  });

  it("선언값 60은 임계치가 아니다", () => {
    expect(resolveNextStep(4, 2, 60)).toEqual(sceneAt(4));
  });

  it("나머지 씬은 순서대로 넘어간다", () => {
    expect(resolveNextStep(4, 0, 0)).toEqual(sceneAt(1));
    expect(resolveNextStep(4, 3, 0)).toEqual(sceneAt(4));
  });
});

describe("스테이지 5 (해변) — 결과 화면으로 탈출", () => {
  it("마지막 씬을 마치면 결과 화면으로 이동한다", () => {
    expect(resolveNextStep(5, 2, 0)).toEqual({ type: "navigate", to: ROUTES.RESULT });
  });

  it("점수와 무관하게 결과 화면으로 간다", () => {
    expect(resolveNextStep(5, 2, 999)).toEqual({ type: "navigate", to: ROUTES.RESULT });
  });

  it("앞선 씬은 순서대로 넘어간다", () => {
    expect(resolveNextStep(5, 0, 0)).toEqual(sceneAt(1));
    expect(resolveNextStep(5, 1, 0)).toEqual(sceneAt(2));
  });
});

describe("스테이지 종료 시 다음 스테이지", () => {
  // 카페에서 돈을 줍는 선택이 우산(4) 경로를 연다.
  // data4의 "얻은 돈으로 편의점에서 우산을 사올 수 있었다"와 연결된다.
  it("카페에서 첫 선택지(돈을 줍는다)를 고르면 우산으로 간다", () => {
    expect(resolveStageExit(2, 0, ROUTES.MAIN3)).toBe(ROUTES.MAIN4);
  });

  it("카페에서 다른 선택지를 고르면 동굴로 간다", () => {
    expect(resolveStageExit(2, 1, ROUTES.MAIN3)).toBe(ROUTES.MAIN3);
    expect(resolveStageExit(2, 2, ROUTES.MAIN3)).toBe(ROUTES.MAIN3);
  });

  it("분기가 없는 스테이지는 기본 경로를 따른다", () => {
    expect(resolveStageExit(1, 0, ROUTES.MAIN2)).toBe(ROUTES.MAIN2);
    expect(resolveStageExit(3, 0, ROUTES.MAIN5)).toBe(ROUTES.MAIN5);
    expect(resolveStageExit(4, 1, ROUTES.MAIN5)).toBe(ROUTES.MAIN5);
  });
});

describe("전 경로 회귀 표 — 게임 한 판의 스테이지 이동", () => {
  // 실제 플레이에서 가능한 두 갈래를 명시적으로 고정한다
  it("돈을 주우면 집→카페→우산→해변", () => {
    expect(resolveStageExit(1, 0, ROUTES.MAIN2)).toBe(ROUTES.MAIN2);
    expect(resolveStageExit(2, 0, ROUTES.MAIN3)).toBe(ROUTES.MAIN4);
    expect(resolveStageExit(4, 0, ROUTES.MAIN5)).toBe(ROUTES.MAIN5);
  });

  it("돈을 줍지 않으면 집→카페→동굴→해변", () => {
    expect(resolveStageExit(1, 0, ROUTES.MAIN2)).toBe(ROUTES.MAIN2);
    expect(resolveStageExit(2, 1, ROUTES.MAIN3)).toBe(ROUTES.MAIN3);
    expect(resolveStageExit(3, 0, ROUTES.MAIN5)).toBe(ROUTES.MAIN5);
  });
});
