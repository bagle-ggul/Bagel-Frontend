import { renderHook, act } from "@testing-library/react";

import { AUTO_DELAY_MS, SKIP_INTERVAL_MS, useAutoPlay } from "./useAutoPlay";

const setup = (overrides = {}) => {
  const callbacks = { onComplete: jest.fn(), onAdvance: jest.fn(), onStop: jest.fn() };
  const initialProps = {
    mode: "manual",
    lineKey: "a",
    isTypingDone: true,
    isSeen: true,
    ...callbacks,
    ...overrides,
  };
  const view = renderHook((props) => useAutoPlay(props), { initialProps });
  return { ...callbacks, ...view, initialProps };
};

describe("useAutoPlay", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("auto는 타이핑 완료 뒤 지연 후 진행", () => {
    const { onAdvance } = setup({ mode: "auto" });
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS - 1));
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("auto는 타이핑 중이면 기다린다", () => {
    const { onAdvance } = setup({ mode: "auto", isTypingDone: false });
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS * 2));
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("auto는 선택지(lineKey null)에서 진행하지 않는다", () => {
    const { onAdvance } = setup({ mode: "auto", lineKey: null });
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS * 2));
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("skip은 본 줄이면 완성 후 진행", () => {
    const { onComplete, onAdvance, onStop } = setup({ mode: "skip" });
    act(() => jest.advanceTimersByTime(SKIP_INTERVAL_MS));
    expect(onComplete).toHaveBeenCalledTimes(1);
    expect(onAdvance).toHaveBeenCalledTimes(1);
    expect(onStop).not.toHaveBeenCalled();
  });

  it("skip은 처음 보는 줄에서 onStop", () => {
    const { onStop, onAdvance } = setup({ mode: "skip", isSeen: false });
    expect(onStop).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(SKIP_INTERVAL_MS * 2));
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("skip은 선택지(lineKey null)에서 onStop", () => {
    const { onStop } = setup({ mode: "skip", lineKey: null });
    expect(onStop).toHaveBeenCalledTimes(1);
  });

  it("manual은 아무것도 하지 않는다", () => {
    const { onAdvance, onComplete, onStop } = setup();
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS * 2));
    expect(onAdvance).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
    expect(onStop).not.toHaveBeenCalled();
  });

  it("줄이 바뀌면 이전 타이머를 지운다", () => {
    const { onAdvance, rerender, initialProps } = setup({ mode: "auto" });
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS - 100));
    rerender({ ...initialProps, lineKey: "b" });
    act(() => jest.advanceTimersByTime(100));
    expect(onAdvance).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(AUTO_DELAY_MS));
    expect(onAdvance).toHaveBeenCalledTimes(1);
  });

  it("언마운트 시 타이머를 해제한다", () => {
    const { unmount } = setup({ mode: "auto" });
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
