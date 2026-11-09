import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";
import { MemoryRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { clearSeenLines } from "../../game/seenLines";
import { AUTO_DELAY_MS, SKIP_INTERVAL_MS } from "../../hooks/useAutoPlay";
import { TYPING_SPEED_MS } from "../../hooks/useTypewriter";

import DialoguePlayer from "./DialoguePlayer";

MotionGlobalConfig.skipAnimations = true;

// 타이머 1개씩 별도 act로 진행 (연쇄 setTimeout + 렌더 반영)
const MAXIMUM_TICK_COUNT = 80;

const narration = (text) => ({ speakerId: "narration", speakerName: "", text });
const sujung = (text) => ({ speakerId: "sujung", speakerName: "이수정", text });

// 장면 0: 나레이션 1줄 + sujung 1줄 + 선택지 2개 (followUp 각 2줄)
const script = [
  {
    sprite: "/sujung.webp",
    lines: [narration("비가 내린다."), sujung("우산 있어?")],
    choices: [
      {
        label: "같이 쓰자",
        score: 5,
        gameOver: false,
        followUp: [sujung("고마워."), narration("둘은 함께 걸었다.")],
      },
      {
        label: "없는데",
        score: -5,
        gameOver: false,
        followUp: [sujung("그렇구나."), narration("수정은 먼저 떠났다.")],
      },
    ],
  },
];

const renderPlayer = (props = {}) => {
  const onChoose = jest.fn();
  const onSceneDone = jest.fn();
  const view = render(
    <MemoryRouter>
      <RecoilRoot>
        <DialoguePlayer
          script={script}
          scopeId="test-stage"
          background="/bg.webp"
          playerName="민수"
          onChoose={onChoose}
          onSceneDone={onSceneDone}
          {...props}
        />
      </RecoilRoot>
    </MemoryRouter>
  );
  return { onChoose, onSceneDone, ...view };
};

const tapScreen = () => fireEvent.click(screen.getByTestId("dialogue-player"));
const pressKey = (key) => fireEvent.keyDown(window, { key });
const tick = (milliseconds) => act(() => jest.advanceTimersByTime(milliseconds));

const queryChoiceGroup = () => screen.queryByRole("group", { name: "선택지" });

// 타이핑 완성 탭 + 진행 탭 (줄 1개 넘기기)
const tapThroughLine = () => {
  tapScreen();
  tapScreen();
};

const tapUntilChoices = () => {
  tapThroughLine();
  tapThroughLine();
};

describe("DialoguePlayer", () => {
  beforeEach(() => {
    clearSeenLines();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it("화면을 누르면 타이핑 중인 줄을 즉시 완성한다", () => {
    renderPlayer();
    expect(screen.queryByText("비가 내린다.")).toBeNull();
    tapScreen();
    expect(screen.getByText("비가 내린다.")).toBeInTheDocument();
  });

  it("완성된 줄에서 누르면 다음 줄로 간다", () => {
    renderPlayer();
    tapThroughLine();
    tapScreen();
    expect(screen.getByText("우산 있어?")).toBeInTheDocument();
    expect(screen.getByText("이수정")).toBeInTheDocument();
  });

  it("대사가 끝나기 전에는 선택지가 없다", () => {
    renderPlayer();
    tapThroughLine();
    expect(queryChoiceGroup()).toBeNull();
  });

  it("대사가 끝나면 같은 모양의 선택지가 나온다", () => {
    renderPlayer();
    tapUntilChoices();
    const choiceButtons = within(queryChoiceGroup()).getAllByRole("button");
    expect(choiceButtons).toHaveLength(2);
    expect(new Set(choiceButtons.map((button) => button.className)).size).toBe(1);
    // 대사창은 마지막 줄 유지
    expect(screen.getByText("우산 있어?")).toBeInTheDocument();
  });

  it("선택지 단계에서 화면을 눌러도 넘어가지 않는다", () => {
    renderPlayer();
    tapUntilChoices();
    tapScreen();
    expect(queryChoiceGroup()).toBeInTheDocument();
  });

  it("키보드 2로 두 번째 선택지를 고른다", () => {
    const { onChoose } = renderPlayer();
    tapUntilChoices();
    pressKey("2");
    expect(onChoose).toHaveBeenCalledWith({
      sceneIndex: 0,
      choiceIndex: 1,
      choice: script[0].choices[1],
    });
    expect(queryChoiceGroup()).toBeNull();
  });

  it("이어지는 대사는 버튼이 아니라 대사창에 나온다", () => {
    renderPlayer();
    tapUntilChoices();
    fireEvent.click(screen.getByRole("button", { name: /같이 쓰자/ }));
    tapScreen();
    expect(screen.getByText("고마워.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /고마워/ })).toBeNull();
  });

  it("Space로 이어지는 대사를 넘기고 끝나면 onSceneDone", () => {
    const { onSceneDone } = renderPlayer();
    tapUntilChoices();
    pressKey("1");
    ["고마워.", "둘은 함께 걸었다."].forEach(() => {
      pressKey(" ");
      pressKey(" ");
    });
    expect(onSceneDone).toHaveBeenCalledTimes(1);
    expect(onSceneDone).toHaveBeenCalledWith({
      sceneIndex: 0,
      choiceIndex: 0,
      choice: script[0].choices[0],
    });
  });

  it("자동 진행을 켜면 시간이 지나 다음 줄로 간다", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "자동" }));
    "비가 내린다.".split("").forEach(() => tick(TYPING_SPEED_MS));
    expect(screen.getByText("비가 내린다.")).toBeInTheDocument();
    tick(AUTO_DELAY_MS);
    "우산 있어?".split("").forEach(() => tick(TYPING_SPEED_MS));
    expect(screen.getByText("우산 있어?")).toBeInTheDocument();
  });

  it("로그가 열려 있으면 자동 진행이 멈춘다", () => {
    renderPlayer();
    fireEvent.click(screen.getByRole("button", { name: "자동" }));
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    for (let count = 0; count < MAXIMUM_TICK_COUNT; count += 1) tick(TYPING_SPEED_MS);
    tick(AUTO_DELAY_MS * 3);
    expect(screen.queryByText("우산 있어?")).toBeNull();
    expect(screen.getByRole("button", { name: "자동" })).toHaveAttribute("aria-pressed", "true");
  });

  it("자동을 켰다 끈 뒤 Space로 다음 줄로 간다", () => {
    renderPlayer();
    const autoButton = screen.getByRole("button", { name: "자동" });
    autoButton.focus();
    fireEvent.click(autoButton);
    autoButton.focus();
    fireEvent.click(autoButton);
    expect(autoButton).toHaveAttribute("aria-pressed", "false");
    expect(autoButton).not.toHaveFocus();

    // 포커스가 버튼을 떠났으므로 Space는 화면 진행 (완성 > 다음 줄 > 완성)
    ["완성", "다음 줄", "완성"].forEach(() => pressKey(" "));
    expect(screen.getByText("우산 있어?")).toBeInTheDocument();
  });

  it("처음 보는 줄에서는 건너뛰기가 비활성이다", () => {
    renderPlayer();
    expect(screen.getByRole("button", { name: "건너뛰기" })).toBeDisabled();
  });

  it("allowSkip false면 건너뛰기가 없다", () => {
    renderPlayer({ allowSkip: false });
    expect(screen.queryByRole("button", { name: "건너뛰기" })).toBeNull();
  });

  it("본 줄은 건너뛰기로 선택지까지 빠르게 넘어가고 멈춘다", () => {
    const { unmount } = renderPlayer();
    tapUntilChoices();
    unmount();

    renderPlayer();
    const skipButton = screen.getByRole("button", { name: "건너뛰기" });
    expect(skipButton).toBeEnabled();
    fireEvent.click(skipButton);
    for (let count = 0; count < MAXIMUM_TICK_COUNT && !queryChoiceGroup(); count += 1) {
      tick(SKIP_INTERVAL_MS);
    }
    expect(queryChoiceGroup()).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "건너뛰기" })).toHaveAttribute(
      "aria-pressed",
      "false"
    );
  });

  it("지난 대사 모달에 본 줄과 고른 선택지가 있다", () => {
    renderPlayer();
    tapUntilChoices();
    pressKey("1");
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    const dialog = screen.getByRole("dialog");
    expect(within(dialog).getByText("비가 내린다.")).toBeInTheDocument();
    expect(within(dialog).getByText("우산 있어?")).toBeInTheDocument();
    expect(within(dialog).getByText("선택 · 같이 쓰자")).toBeInTheDocument();
  });

  it("로그가 열려 있으면 Space가 진행하지 않는다", () => {
    renderPlayer();
    tapScreen();
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    pressKey(" ");
    tapScreen();
    expect(screen.queryByText("우산 있어?")).toBeNull();
  });

  it("ended면 endSlot을 보여 준다", () => {
    const onSceneDone = jest.fn(() => ({ type: "end" }));
    renderPlayer({ onSceneDone, endSlot: <p>엔딩 화면</p> });
    expect(screen.queryByText("엔딩 화면")).toBeNull();
    tapUntilChoices();
    pressKey("2");
    tapThroughLine();
    tapThroughLine();
    expect(onSceneDone).toHaveBeenCalledTimes(1);
    expect(screen.getByText("엔딩 화면")).toBeInTheDocument();
  });

  it("ended 뒤에도 지난 대사 버튼으로 로그를 연다", () => {
    const onSceneDone = jest.fn(() => ({ type: "end" }));
    renderPlayer({ onSceneDone, endSlot: <button type="button">다음 장소로</button> });
    tapUntilChoices();
    pressKey("1");
    tapThroughLine();
    tapThroughLine();
    const endSlotButton = screen.getByRole("button", { name: "다음 장소로" });
    // 덮개 빈 곳은 클릭 통과, 종료 버튼만 클릭 받음
    expect(screen.getByTestId("end-slot")).toHaveStyle("pointer-events: none");
    expect(endSlotButton).not.toHaveStyle("pointer-events: none");
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    expect(within(screen.getByRole("dialog")).getByText("고마워.")).toBeInTheDocument();
  });
});
