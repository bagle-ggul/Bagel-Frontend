import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { getMaxStage, PROGRESS_KEYS, resetProgress } from "../game/progress";
import { clearSeenLines } from "../game/seenLines";
import axios from "../utils/axios";

import StagePage from "./StagePage";

jest.mock("../utils/axios");

MotionGlobalConfig.skipAnimations = true;

// 스테이지 1 전체를 넘기는 데 충분한 조작 횟수 상한 (무한 반복 방지)
const MAXIMUM_INTERACTION_COUNT = 200;

const renderStage = (stage = 1) =>
  render(
    <MemoryRouter initialEntries={[`/main${stage}`]}>
      <RecoilRoot>
        <Routes>
          <Route path={`/main${stage}`} element={<StagePage stage={stage} />} />
          <Route path="/over" element={<div>게임오버 화면</div>} />
        </Routes>
      </RecoilRoot>
    </MemoryRouter>
  );

const tapScreen = () => fireEvent.click(screen.getByTestId("dialogue-player"));
const queryChoiceGroup = () => screen.queryByRole("group", { name: "선택지" });

// 선택지가 나올 때까지 탭 (타이핑 완성 + 진행)
const tapUntilChoices = () => {
  for (let count = 0; count < MAXIMUM_INTERACTION_COUNT && !queryChoiceGroup(); count += 1) {
    tapScreen();
  }
};

const chooseByLabel = (label) => {
  tapUntilChoices();
  fireEvent.click(within(queryChoiceGroup()).getByRole("button", { name: label }));
};

const chooseByIndex = (choiceIndex) => {
  const choiceButtons = within(queryChoiceGroup()).getAllByRole("button");
  fireEvent.click(choiceButtons[choiceIndex]);
};

describe("StagePage", () => {
  beforeEach(() => {
    resetProgress();
    clearSeenLines();
    axios.get.mockResolvedValue({ data: { characterName: "" } });
    // jsdom의 HTMLMediaElement.play 미구현
    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  });

  it("스테이지 1 첫 줄을 나레이션으로 보여 준다", () => {
    renderStage();
    tapScreen();
    expect(screen.getByText(/여행 전날 밤\./)).toBeInTheDocument();
  });

  it("진입하면 진행도를 기록한다", () => {
    renderStage();
    expect(getMaxStage()).toBeGreaterThanOrEqual(1);
  });

  it("닉네임이 비어 있으면 프로필을 조회해 이름표에 쓴다", async () => {
    axios.get.mockResolvedValue({ data: { characterName: "민수" } });
    renderStage();
    await waitFor(() => expect(axios.get).toHaveBeenCalledWith("/api/my-page"));

    tapUntilChoices();
    chooseByIndex(0);
    tapScreen();
    expect(await screen.findByText("민수")).toBeInTheDocument();
  });

  it("선택하면 점수가 즉시 반영된다", () => {
    renderStage();
    tapUntilChoices();
    chooseByIndex(0);
    expect(sessionStorage.getItem(PROGRESS_KEYS.SCORE)).toBe("10");
  });

  it("게임오버 선택은 이어지는 대사 뒤 /over로 간다", () => {
    renderStage();
    // 장면 0 첫 선택지 > 이어지는 대사 > 장면 1 선택지
    tapUntilChoices();
    chooseByIndex(0);
    tapUntilChoices();
    fireEvent.click(within(queryChoiceGroup()).getByRole("button", { name: "그냥 잔다" }));
    expect(screen.queryByText("게임오버 화면")).toBeNull();

    for (
      let count = 0;
      count < MAXIMUM_INTERACTION_COUNT && !screen.queryByText("게임오버 화면");
      count += 1
    ) {
      tapScreen();
    }
    expect(screen.getByText("게임오버 화면")).toBeInTheDocument();
  });

  it("스테이지를 마치면 다음 장소로 버튼이 기본 목적지를 가리킨다", () => {
    renderStage();
    const findNextStageLink = () => screen.queryByRole("link", { name: "다음 장소로" });

    // 모든 장면에서 첫 선택지 (게임오버 없음)
    for (let count = 0; count < MAXIMUM_INTERACTION_COUNT && !findNextStageLink(); count += 1) {
      if (queryChoiceGroup()) chooseByIndex(0);
      else tapScreen();
    }
    expect(findNextStageLink()).toHaveAttribute("href", "/main2");
  });

  it("점수 변화 없는 선택만 해도 카페 돈 줍기는 우산 경로로 간다", () => {
    renderStage(2);
    const findNextStageLink = () => screen.queryByRole("link", { name: "다음 장소로" });

    // 장면 0 아샷추(0점) > 장면 2 유일 선택지(0점) > 장면 3 줍는다(0점)
    chooseByLabel("아샷추");
    chooseByLabel("왜? 음료가 별로였어?");
    chooseByLabel("줍는다");
    for (let count = 0; count < MAXIMUM_INTERACTION_COUNT && !findNextStageLink(); count += 1) {
      tapScreen();
    }
    expect(findNextStageLink()).toHaveAttribute("href", "/main4");
  });
});
