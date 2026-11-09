import { fireEvent, render, screen, within } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { characterNameAtom } from "../atom/atom";
import endingsJson from "../data/stories/endings.json";
import { ENDING } from "../game/ending";
import { incrementRegressionCount, recordChoice, resetProgress } from "../game/progress";
import { clearSeenLines } from "../game/seenLines";

import EndingPage from "./EndingPage";

MotionGlobalConfig.skipAnimations = true;

// 엔딩 대사 전체를 넘기는 데 충분한 조작 횟수 상한 (무한 반복 방지)
const MAXIMUM_INTERACTION_COUNT = 100;

const renderEnding = (endingId, { playerName = "민수" } = {}) =>
  render(
    <MemoryRouter initialEntries={[`/${endingId}`]}>
      <RecoilRoot initializeState={({ set }) => set(characterNameAtom, playerName)}>
        <Routes>
          <Route path={`/${endingId}`} element={<EndingPage endingId={endingId} />} />
          <Route path="/" element={<div>홈 화면</div>} />
          <Route path="/board" element={<div>랭킹 화면</div>} />
        </Routes>
      </RecoilRoot>
    </MemoryRouter>
  );

const tapScreen = () => fireEvent.click(screen.getByTestId("dialogue-player"));

// 종료 슬롯이 나올 때까지 탭 (타이핑 완성 + 진행)
const tapUntilEnd = () => {
  for (
    let count = 0;
    count < MAXIMUM_INTERACTION_COUNT && !screen.queryByTestId("end-slot");
    count += 1
  ) {
    tapScreen();
  }
  return screen.getByTestId("end-slot");
};

describe("EndingPage", () => {
  beforeEach(() => {
    resetProgress();
    clearSeenLines();
    // jsdom의 HTMLMediaElement.play 미구현
    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  });

  it("엔딩 첫 대사를 보여 준다", () => {
    renderEnding(ENDING.SAD);
    tapScreen();
    expect(screen.getByText(endingsJson.sad.lines[0].text)).toBeInTheDocument();
  });

  it("대사를 끝까지 넘기면 엔딩 이름·고른 선택·회귀 횟수·버튼을 보여 준다", () => {
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 1, label: "일어난다" });
    recordChoice({ stage: 2, sceneIndex: 0, choiceIndex: 0, label: "라떼를 고른다" });
    incrementRegressionCount();
    incrementRegressionCount();
    renderEnding(ENDING.HAPPY);

    const endSlot = within(tapUntilEnd());
    expect(endSlot.getByRole("heading", { name: "해피 엔딩" })).toBeInTheDocument();
    expect(endSlot.getByText(endingsJson.happy.subtitle)).toBeInTheDocument();
    const choiceItems = endSlot.getAllByRole("listitem");
    expect(choiceItems).toHaveLength(2);
    expect(choiceItems[0]).toHaveTextContent("스테이지 1일어난다");
    expect(endSlot.getByText("회귀 2번")).toBeInTheDocument();
    expect(endSlot.getByRole("link", { name: "홈" })).toHaveAttribute("href", "/");
    expect(endSlot.getByRole("link", { name: "랭킹 확인" })).toHaveAttribute("href", "/board");
  });

  it("고른 선택이 없으면 빈 안내와 회귀 0번", () => {
    renderEnding(ENDING.MIDDLE);
    const endSlot = within(tapUntilEnd());
    expect(endSlot.getByText("기록된 선택이 없어요")).toBeInTheDocument();
    expect(endSlot.getByText("회귀 0번")).toBeInTheDocument();
  });

  it("히든 엔딩은 낯선 남자의 정체를 플레이어 이름으로 드러낸다", () => {
    renderEnding(ENDING.HIDDEN);
    tapUntilEnd();
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    expect(screen.getAllByText("미래의 민수").length).toBeGreaterThan(0);
  });

  it("홈 버튼으로 홈 화면에 간다", () => {
    renderEnding(ENDING.SAD);
    fireEvent.click(within(tapUntilEnd()).getByRole("link", { name: "홈" }));
    expect(screen.getByText("홈 화면")).toBeInTheDocument();
  });
});
