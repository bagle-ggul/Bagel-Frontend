import { fireEvent, render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { RecoilRoot } from "recoil";

import { getMaxStage, PROGRESS_KEYS, resetProgress, markStageReached } from "../game/progress";
import { clearSeenLines } from "../game/seenLines";
import { getPreloadImages } from "../game/stages";
import { __resetPreloadedUrlsForTest } from "../hooks/useImagePreload";
import axios from "../utils/axios";

import Intro from "./Intro";

jest.mock("../utils/axios");

MotionGlobalConfig.skipAnimations = true;

// 인트로 전체를 넘기는 데 충분한 조작 횟수 상한 (무한 반복 방지)
const MAXIMUM_INTERACTION_COUNT = 200;

const renderIntro = () =>
  render(
    <MemoryRouter initialEntries={["/intro"]}>
      <RecoilRoot>
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/main1" element={<div>메인1 화면</div>} />
        </Routes>
      </RecoilRoot>
    </MemoryRouter>
  );

// 닉네임 조회 반영까지 대기 (비동기 state 갱신을 테스트 안에서 마무리)
const renderLoadedIntro = async () => {
  renderIntro();
  await screen.findByText("민수");
};

const tapScreen = () => fireEvent.click(screen.getByTestId("dialogue-player"));

describe("Intro", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    resetProgress();
    clearSeenLines();
    axios.get.mockResolvedValue({ data: { characterName: "민수" } });
    // jsdom의 HTMLMediaElement.play 미구현
    window.HTMLMediaElement.prototype.play = jest.fn().mockResolvedValue(undefined);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it("첫 줄의 화자 이름표를 닉네임으로 보여 준다", async () => {
    await renderLoadedIntro();
    expect(screen.getByText("민수")).toBeInTheDocument();
  });

  it("인트로 건너뛰기는 진행도를 초기화하고 /main1로 간다", async () => {
    markStageReached(3);
    sessionStorage.setItem(PROGRESS_KEYS.SCORE, "40");
    await renderLoadedIntro();
    fireEvent.click(screen.getByRole("button", { name: "인트로 건너뛰기" }));
    expect(screen.getByText("메인1 화면")).toBeInTheDocument();
    expect(getMaxStage()).toBe(0);
    expect(sessionStorage.getItem(PROGRESS_KEYS.SCORE)).not.toBe("40");
  });

  it("마지막 줄을 넘기면 /main1로 간다", async () => {
    await renderLoadedIntro();
    for (
      let count = 0;
      count < MAXIMUM_INTERACTION_COUNT && !screen.queryByText("메인1 화면");
      count += 1
    ) {
      tapScreen();
    }
    expect(screen.getByText("메인1 화면")).toBeInTheDocument();
  });

  it("인트로 중에 1스테이지 그림을 미리 받는다", async () => {
    __resetPreloadedUrlsForTest();
    const requestedUrls = [];
    const imageSpy = jest.spyOn(window, "Image").mockImplementation(() => {
      const image = {};
      Object.defineProperty(image, "src", { set: (url) => requestedUrls.push(url) });
      return image;
    });
    await renderLoadedIntro();
    imageSpy.mockRestore();
    expect(requestedUrls).toEqual(expect.arrayContaining(getPreloadImages(1)));
  });

  it("건너뛰기(세션) 버튼은 없다", async () => {
    await renderLoadedIntro();
    expect(screen.queryByRole("button", { name: "건너뛰기" })).toBeNull();
    expect(screen.getByRole("button", { name: "자동" })).toBeInTheDocument();
  });
});
