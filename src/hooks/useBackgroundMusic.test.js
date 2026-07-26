import { render, renderHook } from "@testing-library/react";
import React from "react";

import { useBackgroundMusic } from "./useBackgroundMusic";

const AudioComponent = ({ play }) => {
  const audioRef = useBackgroundMusic();
  return <audio ref={audioRef} data-testid="bgm" src="/audio/test.mp3" onPlay={play} />;
};

describe("useBackgroundMusic", () => {
  let playSpy;

  beforeEach(() => {
    // jsdom의 HTMLMediaElement.play는 구현되어 있지 않다
    playSpy = jest.fn().mockResolvedValue(undefined);
    window.HTMLMediaElement.prototype.play = playSpy;
  });

  it("ref를 반환한다", () => {
    const { result } = renderHook(() => useBackgroundMusic());

    expect(result.current).toHaveProperty("current");
  });

  it("audio 요소에 연결되면 재생을 시도한다", () => {
    render(<AudioComponent />);

    expect(playSpy).toHaveBeenCalled();
  });

  // 브라우저 자동재생 정책으로 실패해도 게임 진행에는 지장이 없어야 한다
  it("재생이 거부되어도 예외를 던지지 않는다", () => {
    window.HTMLMediaElement.prototype.play = jest
      .fn()
      .mockRejectedValue(new Error("NotAllowedError"));

    expect(() => render(<AudioComponent />)).not.toThrow();
  });

  it("audio 요소가 없으면 아무 일도 하지 않는다", () => {
    renderHook(() => useBackgroundMusic());

    expect(playSpy).not.toHaveBeenCalled();
  });
});
