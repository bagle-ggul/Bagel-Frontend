import stageRules from "../data/stageRules.json";

import { NEXT_STAGES } from "./stageGraph";
import { getPreloadImages, getStageConfig, STAGE_CONFIGS } from "./stages";

describe("stages", () => {
  it.each([
    [1, "/img/bg_house_main.webp", "/audio/1.m4a", "/main2", "dust"],
    [2, "/img/bg_cafe_main.webp", "/audio/2.m4a", "/main3", "petals"],
    [3, "/img/bg_cave_main.webp", "/audio/34.m4a", "/main5", "rain"],
    [4, "/img/bg_road_main.webp", "/audio/34.m4a", "/main5", "rain"],
    [5, "/img/bg_beach_main.webp", "/audio/5.m4a", null, "sparkle"],
  ])("스테이지 %i 설정이 기존 Main 페이지 값과 같다", (stage, background, music, exit, ambient) => {
    expect(STAGE_CONFIGS[stage]).toMatchObject({
      stage,
      background,
      music,
      defaultExit: exit,
      ambient,
    });
    expect(STAGE_CONFIGS[stage].storyData.scenes.length).toBeGreaterThan(0);
  });

  it("NEXT_STAGES는 stageRules의 stageExit 목적지와 일치한다", () => {
    const { byChoice, default: defaultRoute } = stageRules.stages["2"].stageExit;
    expect(byChoice["0"]).toBe("/main4");
    expect(defaultRoute).toBe("/main3");
    const stage2Destinations = [byChoice["0"], defaultRoute].map((route) =>
      Number(route.replace("/main", ""))
    );
    expect([...NEXT_STAGES[2]].sort()).toEqual([...stage2Destinations].sort());
    Object.entries(NEXT_STAGES).forEach(([stage, nextStages]) => {
      nextStages.forEach((next) => expect(next).toBeGreaterThan(Number(stage)));
    });
  });

  it("getPreloadImages(2)는 동굴·우산 배경을 포함하고 중복이 없다", () => {
    const images = getPreloadImages(2);
    expect(images).toContain("/img/bg_cave_main.webp");
    expect(images).toContain("/img/bg_road_main.webp");
    expect(images).toContain("/img/bg_cafe_main.webp");
    expect(new Set(images).size).toBe(images.length);
  });

  it("알 수 없는 스테이지는 null", () => {
    expect(getStageConfig(9)).toBeNull();
    expect(getPreloadImages(9)).toEqual([]);
  });
});
