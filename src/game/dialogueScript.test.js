import introStory from "../data/stories/intro.json";
import { storyData as data1 } from "../utils/data";
import { storyData as data2 } from "../utils/data2";
import { storyData as data3 } from "../utils/data3";
import { storyData as data4 } from "../utils/data4";
import { storyData as data5 } from "../utils/data5";

import {
  DEFAULT_PLAYER_NAME,
  SPEAKER,
  fromIntroStory,
  parseChoiceLabel,
  parseLines,
  toSceneScript,
  toStageScript,
} from "./dialogueScript";

describe("parseLines", () => {
  it("이수정 : 접두를 화자 sujung으로 분리한다", () => {
    expect(parseLines("이수정 : 내일 여행 갈 준비는 다 했어?")).toEqual([
      { speakerId: "sujung", speakerName: "이수정", text: "내일 여행 갈 준비는 다 했어?" },
    ]);
  });

  it("주인공: 과 곡선 따옴표를 처리하고 닉네임을 화자명으로 쓴다", () => {
    expect(parseLines("주인공: “물론이지.”", { playerName: "민수" })).toEqual([
      { speakerId: "player", speakerName: "민수", text: "물론이지." },
    ]);
  });

  it("공백·전각 콜론 변형을 모두 인식한다", () => {
    const lines = ['주인공 : "응"', "수정：“응”", "나 : “응”"].map((raw) => parseLines(raw)[0]);
    expect(lines.map((line) => line.speakerId)).toEqual(["player", "sujung", "player"]);
    expect(lines.map((line) => line.text)).toEqual(["응", "응", "응"]);
  });

  it("괄호 나레이션은 이름표 없이 괄호를 벗긴다", () => {
    expect(
      parseLines("(수정이로부터 연락이 왔다.)\n\n이수정 : 내일 여행 갈 준비는 다 했어?")
    ).toEqual([
      { speakerId: "narration", speakerName: "", text: "수정이로부터 연락이 왔다." },
      { speakerId: "sujung", speakerName: "이수정", text: "내일 여행 갈 준비는 다 했어?" },
    ]);
  });

  it("연속 나레이션 여러 줄은 한 줄로 합친다", () => {
    const lines = parseLines(data3.plot[0].text);
    expect(lines).toHaveLength(1);
    expect(lines[0].text).toContain("\n");
    expect(lines[0].text.startsWith("(")).toBe(false);
    expect(lines[0].text.startsWith("갑자기 비가 쏟아진다.\n")).toBe(true);
  });

  it("괄호 뒤 문장부호는 남기고 괄호만 벗긴다", () => {
    const [line] = parseLines(data4.plot[0].text);
    expect(line.text.startsWith("갑자기 비가 온다.\n")).toBe(true);
    expect(parseLines("(갑자기 비가 온다).")[0].text).toBe("갑자기 비가 온다.");
  });

  it("^ 로 나뉜 이어지는 대사를 순서대로 만든다", () => {
    const noOption = data1.plot[1].options.find((option) => option.ans === "No");
    expect(parseLines(noOption.subtext).map((line) => line.speakerId)).toEqual([
      "player",
      "narration",
      "player",
      "narration",
    ]);
  });

  it("본문의 주인공을 닉네임으로 바꾼다", () => {
    const [line] = parseLines("(주인공이 웃는다.)", { playerName: "민수" });
    expect(line.text).toBe("민수이 웃는다.");
  });

  it("닉네임이 비면 주인공으로 둔다", () => {
    expect(DEFAULT_PLAYER_NAME).toBe("주인공");
    expect(parseLines("주인공: “응”", { playerName: "  " })[0].speakerName).toBe("주인공");
  });

  it("알 수 없는 화자는 따옴표 본문일 때만 화자로 본다", () => {
    expect(parseLines("???: “그녀를 구하고 싶은가?”")).toEqual([
      { speakerId: "???", speakerName: "???", text: "그녀를 구하고 싶은가?" },
    ]);
    expect(parseLines("시간: 세 시")).toEqual([
      { speakerId: SPEAKER.NARRATION, speakerName: "", text: "시간: 세 시" },
    ]);
  });

  it("빈 문자열은 빈 배열", () => {
    expect(parseLines("")).toEqual([]);
    expect(parseLines(undefined)).toEqual([]);
  });
});

describe("parseChoiceLabel", () => {
  it("바깥 따옴표를 벗긴다", () => {
    expect(parseChoiceLabel('"괜찮아, 우리 비 그칠 때까지 조금만 있자."')).toBe(
      "괜찮아, 우리 비 그칠 때까지 조금만 있자."
    );
  });

  it("나 : 접두를 지운다", () => {
    expect(parseChoiceLabel('나 : "저리 가!"')).toBe("저리 가!");
  });

  it("평문은 그대로", () => {
    expect(parseChoiceLabel("계획을 준비한다")).toBe("계획을 준비한다");
  });

  it("주인공을 닉네임으로 바꾼다", () => {
    expect(parseChoiceLabel("주인공이 간다", { playerName: "민수" })).toBe("민수이 간다");
  });
});

describe("toSceneScript", () => {
  it("그림이 없으면 sprite는 null", () => {
    const scene = toSceneScript({ text: "(비가 온다)", options: [] }, {});
    expect(scene).toEqual({
      sprite: null,
      lines: [{ speakerId: "narration", speakerName: "", text: "비가 온다" }],
      choices: [],
    });
  });
});

describe("레거시 데이터 변환", () => {
  const stages = [
    ["data", data1],
    ["data2", data2],
    ["data3", data3],
    ["data4", data4],
    ["data5", data5],
  ];
  const playerName = "민수";

  it.each(stages)("%s: 장면 수 = plot 길이, 선택지 수 = options 길이", (_name, storyData) => {
    const script = toStageScript(storyData, { playerName });
    expect(script).toHaveLength(storyData.plot.length);
    script.forEach((scene, index) => {
      expect(scene.choices).toHaveLength(storyData.plot[index].options.length);
    });
  });

  it.each(stages)(
    "%s: 모든 장면에 줄 1개 이상, 모든 선택지에 followUp 1개 이상",
    (_name, storyData) => {
      toStageScript(storyData, { playerName }).forEach((scene) => {
        expect(scene.lines.length).toBeGreaterThanOrEqual(1);
        scene.choices.forEach((choice) => expect(choice.followUp.length).toBeGreaterThanOrEqual(1));
      });
    }
  );

  it.each(stages)(
    "%s: 어떤 text도 화자 접두나 여는 따옴표로 시작하지 않는다",
    (_name, storyData) => {
      toStageScript(storyData, { playerName }).forEach((scene) => {
        const texts = [...scene.lines, ...scene.choices.flatMap((choice) => choice.followUp)].map(
          (line) => line.text
        );
        texts.forEach((text) => {
          expect(text).not.toMatch(/^(이수정|수정|주인공|나)\s*[:：]/);
          expect(text).not.toMatch(/^[“"‘']/);
        });
      });
    }
  );

  it.each(stages)("%s: 어떤 나레이션 text도 여는 괄호로 시작하지 않는다", (_name, storyData) => {
    toStageScript(storyData, { playerName }).forEach((scene) => {
      const lines = [...scene.lines, ...scene.choices.flatMap((choice) => choice.followUp)];
      lines
        .filter((line) => line.speakerId === "narration")
        .forEach((line) => expect(line.text.startsWith("(")).toBe(false));
    });
  });

  it.each(stages)('%s: playerName "민수"이면 어떤 text에도 "주인공"이 없다', (_name, storyData) => {
    toStageScript(storyData, { playerName }).forEach((scene) => {
      const lines = [...scene.lines, ...scene.choices.flatMap((choice) => choice.followUp)];
      lines.forEach((line) => expect(line.text).not.toContain("주인공"));
      scene.choices.forEach((choice) => expect(choice.label).not.toContain("주인공"));
    });
  });

  it("게임오버 선택지는 정확히 data/data3/data4/data5의 error 옵션 4개다", () => {
    const gameOverCounts = stages.map(
      ([, storyData]) =>
        toStageScript(storyData, { playerName })
          .flatMap((scene) => scene.choices)
          .filter((choice) => choice.gameOver).length
    );
    expect(gameOverCounts).toEqual([1, 0, 1, 1, 1]);
    expect(gameOverCounts.reduce((sum, count) => sum + count, 0)).toBe(4);
  });

  it("fromIntroStory는 intro.json 12줄을 화자 player·sujung·???로 만든다", () => {
    const [scene] = fromIntroStory(introStory.story, { playerName });
    expect(scene.choices).toEqual([]);
    expect(scene.lines).toHaveLength(12);
    expect(new Set(scene.lines.map((line) => line.speakerId))).toEqual(
      new Set(["player", "sujung", "???"])
    );
    expect(scene.lines[0].speakerName).toBe(playerName);
    expect(scene.lines[0].sprite).toBe(introStory.story.scenes[0].characterImage);
    expect(scene.lines.find((line) => line.speakerId === "sujung").speakerName).toBe("이수정");
    expect(scene.lines.find((line) => line.speakerId === "???").speakerName).toBe("???");
  });

  it("fromIntroStory는 텍스트의 주인공을 닉네임으로 바꾼다", () => {
    const story = {
      characters: { mc: { displayName: "주인공" } },
      scenes: [{ speaker: "mc", text: "주인공은 웃었다", characterImage: "/img/a.webp" }],
    };
    expect(fromIntroStory(story, { playerName })[0].lines[0].text).toBe("민수은 웃었다");
  });
});
