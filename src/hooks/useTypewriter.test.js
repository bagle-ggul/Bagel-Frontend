import { renderHook, act } from "@testing-library/react";

import { useTypewriter } from "./useTypewriter";

describe("useTypewriter", () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it("시간이 지나면 한 글자씩 늘어난다", () => {
    const { result } = renderHook(() => useTypewriter("안녕", { speed: 10 }));
    expect(result.current.visibleText).toBe("");
    act(() => jest.advanceTimersByTime(10));
    expect(result.current.visibleText).toBe("안");
    act(() => jest.advanceTimersByTime(10));
    expect(result.current.visibleText).toBe("안녕");
    expect(result.current.isDone).toBe(true);
  });

  it("complete는 즉시 전체 문장과 isDone", () => {
    const { result } = renderHook(() => useTypewriter("안녕하세요", { speed: 10 }));
    act(() => result.current.complete());
    expect(result.current.visibleText).toBe("안녕하세요");
    expect(result.current.isDone).toBe(true);
  });

  it("resetKey가 바뀌면 처음부터", () => {
    const { result, rerender } = renderHook(
      ({ resetKey }) => useTypewriter("안녕", { speed: 10, resetKey }),
      { initialProps: { resetKey: 1 } }
    );
    act(() => result.current.complete());
    rerender({ resetKey: 2 });
    expect(result.current.visibleText).toBe("");
    expect(result.current.isDone).toBe(false);
  });

  it("text가 바뀌면 처음부터", () => {
    const { result, rerender } = renderHook(({ text }) => useTypewriter(text, { speed: 10 }), {
      initialProps: { text: "가나" },
    });
    act(() => result.current.complete());
    rerender({ text: "다라" });
    expect(result.current.visibleText).toBe("");
  });

  it("speed 0이면 즉시 완료", () => {
    const { result } = renderHook(() => useTypewriter("안녕", { speed: 0 }));
    expect(result.current.visibleText).toBe("안녕");
    expect(result.current.isDone).toBe(true);
  });

  it("언마운트 시 타이머를 해제한다", () => {
    const { unmount } = renderHook(() => useTypewriter("안녕", { speed: 10 }));
    unmount();
    expect(jest.getTimerCount()).toBe(0);
  });
});
