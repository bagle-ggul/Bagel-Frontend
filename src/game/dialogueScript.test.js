import introJson from "../data/stories/intro.json";
import stage1Json from "../data/stories/stage1.json";
import stage2Json from "../data/stories/stage2.json";
import stage3Json from "../data/stories/stage3.json";
import stage4Json from "../data/stories/stage4.json";
import stage5Json from "../data/stories/stage5.json";

import { CHARACTER_ID, fillPlayerName, resolveSpeakerName } from "./characters";
import { SPEAKER, toIntroScript, toStageScript } from "./dialogueScript";

const PLAYER_NAME = "민수";

// [이름, JSON, 장면 수, 게임오버 선택지 수]
const stages = [
  ["stage1", stage1Json, 3, 1],
  ["stage2", stage2Json, 4, 0],
  ["stage3", stage3Json, 6, 1],
  ["stage4", stage4Json, 4, 1],
  ["stage5", stage5Json, 3, 1],
];

const collectLines = (scene) => [...scene.lines, ...scene.choices.flatMap((c) => c.followUp)];

describe("characters", () => {
  it("SPEAKER는 CHARACTER_ID 별칭이다", () => {
    expect(SPEAKER).toBe(CHARACTER_ID);
  });

  it("화자 id > 표시 이름", () => {
    expect(resolveSpeakerName("sujung", "민수")).toBe("이수정");
    expect(resolveSpeakerName("stranger", "민수")).toBe("???");
    expect(resolveSpeakerName("narration", "민수")).toBe("");
    expect(resolveSpeakerName("player", "민수")).toBe("민수");
  });

  it("player 이름이 비거나 공백이면 주인공", () => {
    expect(resolveSpeakerName("player", "")).toBe("주인공");
    expect(resolveSpeakerName("player", "   ")).toBe("주인공");
    expect(resolveSpeakerName("player", undefined)).toBe("주인공");
  });

  it("{player}를 모두 이름으로 채우고 공백 이름은 주인공으로 채운다", () => {
    expect(fillPlayerName("{player}야, {player}!", "민수")).toBe("민수야, 민수!");
    expect(fillPlayerName("{player}야", " ")).toBe("주인공야");
  });
});

describe("toStageScript", () => {
  it("대사·선택지·followUp을 SceneScript 모양으로 변환한다", () => {
    const json = {
      place: "test",
      scenes: [
        {
          sprite: "/img/a.webp",
          lines: [
            { speaker: "narration", text: "비가 온다" },
            { speaker: "player", text: "{player}입니다" },
          ],
          choices: [
            {
              label: "{player} 선택",
              score: 5,
              gameOver: true,
              followUp: [{ speaker: "sujung", text: "응" }],
            },
            { label: "다른 선택", score: 0, followUp: [] },
          ],
        },
      ],
    };
    expect(toStageScript(json, { playerName: PLAYER_NAME })).toEqual([
      {
        sprite: "/img/a.webp",
        lines: [
          { speakerId: "narration", speakerName: "", text: "비가 온다" },
          { speakerId: "player", speakerName: "민수", text: "민수입니다" },
        ],
        choices: [
          {
            label: "민수 선택",
            score: 5,
            gameOver: true,
            followUp: [{ speakerId: "sujung", speakerName: "이수정", text: "응" }],
          },
          { label: "다른 선택", score: 0, gameOver: false, followUp: [] },
        ],
      },
    ]);
  });

  it("이름이 비면 주인공으로 채운다", () => {
    const json = { scenes: [{ lines: [{ speaker: "player", text: "{player}" }], choices: [] }] };
    const [scene] = toStageScript(json, { playerName: "" });
    expect(scene.sprite).toBeNull();
    expect(scene.lines[0]).toMatchObject({ speakerName: "주인공", text: "주인공" });
  });

  it.each(stages)(
    "%s: 장면 수와 게임오버 선택지 수가 맞다",
    (_name, json, sceneCount, overCount) => {
      const script = toStageScript(json, { playerName: PLAYER_NAME });
      expect(script).toHaveLength(sceneCount);
      const gameOverChoices = script.flatMap((s) => s.choices).filter((c) => c.gameOver);
      expect(gameOverChoices).toHaveLength(overCount);
    }
  );

  it.each(stages)("%s: 모든 장면에 줄이 있고 선택지는 followUp이 있다", (_name, json) => {
    toStageScript(json, { playerName: PLAYER_NAME }).forEach((scene) => {
      expect(scene.lines.length).toBeGreaterThanOrEqual(1);
      scene.choices.forEach((choice) => expect(choice.followUp.length).toBeGreaterThanOrEqual(1));
    });
  });

  it.each(stages)("%s: {player}가 남지 않고 화자 id가 정의돼 있다", (_name, json) => {
    const validSpeakerIds = Object.values(CHARACTER_ID);
    toStageScript(json, { playerName: PLAYER_NAME }).forEach((scene) => {
      scene.choices.forEach((choice) => expect(choice.label).not.toContain("{player}"));
      collectLines(scene).forEach((line) => {
        expect(line.text).not.toContain("{player}");
        expect(validSpeakerIds).toContain(line.speakerId);
      });
    });
  });
});

describe("toIntroScript", () => {
  it("intro.json 12줄을 장면 1개로 만들고 화자 이름을 채운다", () => {
    const [scene] = toIntroScript(introJson, { playerName: PLAYER_NAME });
    expect(toIntroScript(introJson)).toHaveLength(1);
    expect(scene.choices).toEqual([]);
    expect(scene.lines).toHaveLength(12);
    expect(scene.lines[0]).toMatchObject({ speakerId: "player", speakerName: "민수" });
    expect(scene.lines[1]).toMatchObject({ speakerId: "sujung", speakerName: "이수정" });
    expect(scene.lines[4]).toMatchObject({ speakerId: "stranger", speakerName: "???" });
    scene.lines.forEach((line) => expect(line.sprite).toBeTruthy());
  });
});
