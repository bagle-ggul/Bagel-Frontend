import endingsJson from "../data/stories/endings.json";

import { CHARACTER_ID } from "./characters";
import { ENDING, ENDING_IDS, ENDING_ROUTE_BY_ID, resolveEnding, toEndingScript } from "./ending";

const HIDDEN_KEY_ENTRY = { stage: 4, sceneIndex: 1, choiceIndex: 1, label: "시간" };

describe("resolveEnding", () => {
  it.each([
    [150, ENDING.HAPPY],
    [100, ENDING.HAPPY],
    [99, ENDING.MIDDLE],
    [50, ENDING.MIDDLE],
    [49, ENDING.SAD],
    [0, ENDING.SAD],
  ])("히든 선택 없이 %i점이면 %s", (score, expected) => {
    expect(resolveEnding({ score, choiceHistory: [] })).toBe(expected);
  });

  it("100점 이상 + 스테이지 4 히든 선택이면 hidden", () => {
    expect(resolveEnding({ score: 100, choiceHistory: [HIDDEN_KEY_ENTRY] })).toBe(ENDING.HIDDEN);
  });

  it("히든 선택을 골라도 100점 미만이면 점수 기준", () => {
    expect(resolveEnding({ score: 99, choiceHistory: [HIDDEN_KEY_ENTRY] })).toBe(ENDING.MIDDLE);
  });

  it("같은 장면의 다른 선택지는 히든 조건이 아니다", () => {
    const otherChoice = { ...HIDDEN_KEY_ENTRY, choiceIndex: 0 };
    expect(resolveEnding({ score: 120, choiceHistory: [otherChoice] })).toBe(ENDING.HAPPY);
  });

  it("선택 기록이 없어도 동작한다", () => {
    expect(resolveEnding({ score: 120 })).toBe(ENDING.HAPPY);
  });
});

describe("toEndingScript", () => {
  it("엔딩 JSON 4종 모두 장면 1개, 선택지 없음", () => {
    ENDING_IDS.forEach((endingId) => {
      const script = toEndingScript(endingsJson[endingId], { playerName: "민수" });
      expect(script).toHaveLength(1);
      expect(script[0].choices).toEqual([]);
      expect(script[0].sprite).toBe(endingsJson[endingId].sprite);
      expect(script[0].lines).toHaveLength(endingsJson[endingId].lines.length);
    });
  });

  it("화자 id로 표시 이름을 채운다", () => {
    const [scene] = toEndingScript(endingsJson.happy, { playerName: "민수" });
    const playerLine = scene.lines.find((line) => line.speakerId === CHARACTER_ID.PLAYER);
    const sujungLine = scene.lines.find((line) => line.speakerId === CHARACTER_ID.SUJUNG);
    expect(playerLine.speakerName).toBe("민수");
    expect(sujungLine.speakerName).toBe("이수정");
  });

  it("name 덮어쓰기는 {player}를 채워 표시 이름으로 쓴다", () => {
    const [scene] = toEndingScript(endingsJson.hidden, { playerName: "민수" });
    const revealedNames = scene.lines
      .filter((line) => line.speakerId === CHARACTER_ID.STRANGER)
      .map((line) => line.speakerName);
    expect(revealedNames).toEqual(["???", "미래의 민수", "미래의 민수"]);
  });

  it("닉네임이 공백이면 기본 이름으로 채운다", () => {
    const [scene] = toEndingScript(
      { lines: [{ speaker: "stranger", name: "미래의 {player}", text: "{player}." }] },
      { playerName: "  " }
    );
    expect(scene.lines[0]).toEqual({
      speakerId: "stranger",
      speakerName: "미래의 주인공",
      text: "주인공.",
    });
    expect(scene.sprite).toBeNull();
  });
});

describe("ENDING_ROUTE_BY_ID", () => {
  it("엔딩 id마다 같은 이름의 경로", () => {
    ENDING_IDS.forEach((endingId) => {
      expect(ENDING_ROUTE_BY_ID[endingId]).toBe(`/${endingId}`);
    });
  });
});
