import { render, renderHook, screen, act, waitFor } from "@testing-library/react";
import React from "react";

import {
  useInfiniteScrollObserver,
  useScrollProgress,
  useScrollToTop,
  useTouchSwipe,
} from "./useInfiniteScroll";

/**
 * jsdom에는 IntersectionObserver가 없다.
 * 등록된 콜백을 붙잡아 교차 상태를 직접 흘려보내는 방식으로 검증한다.
 */
const installIntersectionObserverMock = () => {
  const state = { callback: null, observed: [], disconnected: false };

  class MockIntersectionObserver {
    constructor(cb) {
      state.callback = cb;
    }
    observe(el) {
      state.observed.push(el);
    }
    unobserve(el) {
      state.observed = state.observed.filter((o) => o !== el);
    }
    disconnect() {
      state.disconnected = true;
    }
  }

  window.IntersectionObserver = MockIntersectionObserver;
  return state;
};

// window.pageYOffset은 jsdom에서 읽기 전용이라 직접 정의한다
const setScrollTop = (value) => {
  Object.defineProperty(window, "pageYOffset", {
    value,
    writable: true,
    configurable: true,
  });
};

const SentinelComponent = ({ loadMore, hasNextPage }) => {
  const { loadMoreRef, isLoading } = useInfiniteScrollObserver(loadMore, hasNextPage);
  return (
    <div>
      <div ref={loadMoreRef} data-testid="sentinel" />
      <span data-testid="state">{isLoading ? "loading" : "idle"}</span>
    </div>
  );
};

describe("useInfiniteScrollObserver", () => {
  let observerState;
  const originalIO = window.IntersectionObserver;

  beforeEach(() => {
    observerState = installIntersectionObserverMock();
  });

  afterEach(() => {
    window.IntersectionObserver = originalIO;
  });

  it("ref와 로딩 상태를 반환한다", () => {
    const { result } = renderHook(() => useInfiniteScrollObserver(jest.fn(), true));

    expect(result.current.loadMoreRef).toBeDefined();
    expect(result.current.isLoading).toBe(false);
  });

  it("ref가 DOM에 연결되면 옵저버가 요소를 관찰한다", () => {
    render(<SentinelComponent loadMore={jest.fn()} hasNextPage />);

    expect(observerState.observed.length).toBeGreaterThan(0);
  });

  it("요소가 화면에 들어오면 loadMore를 호출한다", async () => {
    const loadMore = jest.fn().mockResolvedValue(undefined);

    render(<SentinelComponent loadMore={loadMore} hasNextPage />);

    await act(async () => {
      await observerState.callback([{ isIntersecting: true }]);
    });

    expect(loadMore).toHaveBeenCalled();
  });

  it("loadMore가 실패해도 로딩 상태를 해제한다", async () => {
    const loadMore = jest.fn().mockRejectedValue(new Error("로드 실패"));

    render(<SentinelComponent loadMore={loadMore} hasNextPage />);

    await act(async () => {
      await observerState.callback([{ isIntersecting: true }]);
    });

    await waitFor(() => expect(screen.getByTestId("state")).toHaveTextContent("idle"));
  });

  it("더 불러올 데이터가 없으면 loadMore를 호출하지 않는다", async () => {
    const loadMore = jest.fn();

    render(<SentinelComponent loadMore={loadMore} hasNextPage={false} />);

    await act(async () => {
      await observerState.callback([{ isIntersecting: true }]);
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  it("화면 밖이면 loadMore를 호출하지 않는다", async () => {
    const loadMore = jest.fn();

    render(<SentinelComponent loadMore={loadMore} hasNextPage />);

    await act(async () => {
      await observerState.callback([{ isIntersecting: false }]);
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  // 구형 브라우저 대응 폴백 경로 — IntersectionObserver가 없으면 스크롤 이벤트를 쓴다
  it("IntersectionObserver가 없으면 스크롤 폴백으로 동작한다", async () => {
    const loadMore = jest.fn().mockResolvedValue(undefined);
    delete window.IntersectionObserver;

    render(<SentinelComponent loadMore={loadMore} hasNextPage />);

    // 화면 안에 들어온 것으로 보이도록 위치를 고정한다
    const sentinel = screen.getByTestId("sentinel");
    sentinel.getBoundingClientRect = () => ({ top: 0 });

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => expect(loadMore).toHaveBeenCalled());
  });

  it("폴백 경로에서도 화면 밖이면 호출하지 않는다", async () => {
    const loadMore = jest.fn();
    delete window.IntersectionObserver;

    render(<SentinelComponent loadMore={loadMore} hasNextPage />);

    const sentinel = screen.getByTestId("sentinel");
    sentinel.getBoundingClientRect = () => ({ top: 99999 });

    await act(async () => {
      window.dispatchEvent(new Event("scroll"));
    });

    expect(loadMore).not.toHaveBeenCalled();
  });

  it("언마운트 시 옵저버를 정리한다", () => {
    const { unmount } = render(<SentinelComponent loadMore={jest.fn()} hasNextPage />);

    unmount();

    expect(observerState.disconnected).toBe(true);
  });
});

describe("useScrollProgress", () => {
  beforeEach(() => {
    setScrollTop(0);
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 2000,
      writable: true,
      configurable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 1000,
      writable: true,
      configurable: true,
    });
  });

  it("맨 위에서는 진행률이 0이다", () => {
    const { result } = renderHook(() => useScrollProgress());

    expect(result.current).toBe(0);
  });

  it("절반쯤 내리면 진행률이 50에 가깝다", async () => {
    setScrollTop(500);

    const { result } = renderHook(() => useScrollProgress());

    await waitFor(() => expect(result.current).toBeCloseTo(50, 0));
  });

  it("스크롤 이벤트가 발생하면 진행률을 갱신한다", async () => {
    const { result } = renderHook(() => useScrollProgress());

    setScrollTop(1000);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => expect(result.current).toBeGreaterThan(0));
  });

  it("문서가 화면보다 짧으면 진행률은 0이다", () => {
    Object.defineProperty(document.documentElement, "scrollHeight", {
      value: 500,
      writable: true,
      configurable: true,
    });
    setScrollTop(0);

    const { result } = renderHook(() => useScrollProgress());

    expect(result.current).toBe(0);
  });

  it("진행률은 100을 넘지 않는다", async () => {
    setScrollTop(999999);

    const { result } = renderHook(() => useScrollProgress());

    await waitFor(() => expect(result.current).toBeLessThanOrEqual(100));
  });
});

describe("useScrollToTop", () => {
  beforeEach(() => {
    setScrollTop(0);
    window.scrollTo = jest.fn();
  });

  it("임계값 아래에서는 버튼을 숨긴다", () => {
    const { result } = renderHook(() => useScrollToTop(300));

    expect(result.current.showScrollTop).toBe(false);
  });

  it("임계값을 넘으면 버튼을 표시한다", async () => {
    setScrollTop(500);

    const { result } = renderHook(() => useScrollToTop(300));

    await waitFor(() => expect(result.current.showScrollTop).toBe(true));
  });

  it("임계값을 인자로 조정할 수 있다", async () => {
    setScrollTop(150);

    const { result } = renderHook(() => useScrollToTop(100));

    await waitFor(() => expect(result.current.showScrollTop).toBe(true));
  });

  it("스크롤 이벤트가 발생하면 표시 여부를 갱신한다", async () => {
    const { result } = renderHook(() => useScrollToTop(300));

    setScrollTop(800);
    act(() => {
      window.dispatchEvent(new Event("scroll"));
    });

    await waitFor(() => expect(result.current.showScrollTop).toBe(true));
  });

  it("맨 위로 이동은 부드러운 스크롤을 사용한다", () => {
    const { result } = renderHook(() => useScrollToTop());

    act(() => {
      result.current.scrollToTop();
    });

    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });
});

describe("useTouchSwipe", () => {
  const touchEvent = (clientY) => ({ targetTouches: [{ clientY }] });

  it("터치 핸들러 3종을 반환한다", () => {
    const { result } = renderHook(() => useTouchSwipe(jest.fn()));

    expect(typeof result.current.handleTouchStart).toBe("function");
    expect(typeof result.current.handleTouchMove).toBe("function");
    expect(typeof result.current.handleTouchEnd).toBe("function");
  });

  it("최소 거리 이상 위로 스와이프하면 콜백을 실행한다", () => {
    const onSwipeUp = jest.fn();
    const { result } = renderHook(() => useTouchSwipe(onSwipeUp, 50));

    act(() => result.current.handleTouchStart(touchEvent(300)));
    act(() => result.current.handleTouchMove(touchEvent(200)));
    act(() => result.current.handleTouchEnd());

    expect(onSwipeUp).toHaveBeenCalled();
  });

  it("이동 거리가 짧으면 실행하지 않는다", () => {
    const onSwipeUp = jest.fn();
    const { result } = renderHook(() => useTouchSwipe(onSwipeUp, 50));

    act(() => result.current.handleTouchStart(touchEvent(300)));
    act(() => result.current.handleTouchMove(touchEvent(280)));
    act(() => result.current.handleTouchEnd());

    expect(onSwipeUp).not.toHaveBeenCalled();
  });

  it("아래로 스와이프하면 실행하지 않는다", () => {
    const onSwipeUp = jest.fn();
    const { result } = renderHook(() => useTouchSwipe(onSwipeUp, 50));

    act(() => result.current.handleTouchStart(touchEvent(200)));
    act(() => result.current.handleTouchMove(touchEvent(400)));
    act(() => result.current.handleTouchEnd());

    expect(onSwipeUp).not.toHaveBeenCalled();
  });

  it("이동 없이 손을 떼면 아무 일도 하지 않는다", () => {
    const onSwipeUp = jest.fn();
    const { result } = renderHook(() => useTouchSwipe(onSwipeUp));

    act(() => result.current.handleTouchEnd());

    expect(onSwipeUp).not.toHaveBeenCalled();
  });
});
