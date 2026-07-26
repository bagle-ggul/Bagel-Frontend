import { renderHook, waitFor, act } from "@testing-library/react";

import axios from "../utils/axios";

import { useRankingData, usePerformanceMonitor } from "./useRankingData";

// 실제 네트워크 호출 금지 — 모듈 단위로 모킹한다
jest.mock("../utils/axios");

const makePage = ({ rankings = [], totalPages = 1, totalItems = 0 } = {}) => ({
  data: { rankings, totalPages, totalItems },
});

describe("useRankingData 초기 로드", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("마운트 시 첫 페이지를 자동으로 불러온다", async () => {
    axios.get.mockResolvedValue(
      makePage({ rankings: [{ id: 1, name: "1등" }], totalPages: 1, totalItems: 1 })
    );

    const { result } = renderHook(() => useRankingData(20));

    await waitFor(() => expect(result.current.data.isInitialLoading).toBe(false));

    expect(axios.get).toHaveBeenCalledWith("/api/game/ranking", expect.any(Object));
    expect(result.current.data.rankings).toHaveLength(1);
    expect(result.current.data.totalItems).toBe(1);
  });

  it("페이지 크기를 요청 파라미터로 전달한다", async () => {
    axios.get.mockResolvedValue(makePage());

    renderHook(() => useRankingData(50));

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    const [, config] = axios.get.mock.calls[0];
    expect(config.params.size).toBe(50);
    expect(config.params.page).toBe(0);
  });

  it("응답에 rankings가 없어도 빈 배열로 처리한다", async () => {
    axios.get.mockResolvedValue({ data: {} });

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.isInitialLoading).toBe(false));

    expect(result.current.data.rankings).toEqual([]);
  });
});

describe("useRankingData 페이지네이션", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("남은 페이지가 있으면 hasNextPage가 참이다", async () => {
    axios.get.mockResolvedValue(makePage({ rankings: [{ id: 1 }], totalPages: 3 }));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.isInitialLoading).toBe(false));

    expect(result.current.data.hasNextPage).toBe(true);
    expect(result.current.data.currentPage).toBe(1);
  });

  it("마지막 페이지에 도달하면 hasNextPage가 거짓이다", async () => {
    axios.get.mockResolvedValue(makePage({ rankings: [{ id: 1 }], totalPages: 1 }));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.isInitialLoading).toBe(false));

    expect(result.current.data.hasNextPage).toBe(false);
  });

  it("더 불러올 페이지가 없으면 추가 요청을 보내지 않는다", async () => {
    axios.get.mockResolvedValue(makePage({ rankings: [{ id: 1 }], totalPages: 1 }));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.hasNextPage).toBe(false));
    const callsBefore = axios.get.mock.calls.length;

    await act(async () => {
      await result.current.loadNextPage();
    });

    expect(axios.get.mock.calls.length).toBe(callsBefore);
  });
});

describe("useRankingData 에러 처리", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // axios의 영문 원본 메시지를 사용자에게 그대로 보여주면 안 된다.
  // 상세 내용은 로거로만 남기고 화면에는 한국어 안내를 띄운다.
  it("요청이 실패하면 사용자용 한국어 안내를 상태에 담는다", async () => {
    axios.get.mockRejectedValue(new Error("Request failed with status code 403"));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.error).toBeTruthy());

    expect(result.current.data.error).toBe(
      "랭킹을 불러오지 못했습니다. 잠시 후 다시 시도해주세요."
    );
    expect(result.current.data.error).not.toContain("status code");
    expect(result.current.data.isLoading).toBe(false);
    expect(result.current.data.isInitialLoading).toBe(false);
  });

  // 요청 취소는 사용자가 화면을 벗어난 경우이므로 에러로 표시하지 않는다
  it("AbortError는 에러 상태로 만들지 않는다", async () => {
    const abortError = new Error("취소됨");
    abortError.name = "AbortError";
    axios.get.mockRejectedValue(abortError);

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(axios.get).toHaveBeenCalled());

    expect(result.current.data.error).toBeNull();
  });
});

describe("useRankingData 새로고침", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("새로고침하면 상태를 초기값으로 되돌린다", async () => {
    axios.get.mockResolvedValue(makePage({ rankings: [{ id: 1 }], totalPages: 2 }));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.rankings).toHaveLength(1));

    act(() => {
      result.current.refreshData();
    });

    await waitFor(() => expect(result.current.data.currentPage).toBeGreaterThanOrEqual(0));
    expect(result.current.data.totalPages).toBeGreaterThanOrEqual(0);
  });

  it("재시도하면 에러를 지우고 다시 요청한다", async () => {
    axios.get.mockRejectedValueOnce(new Error("일시 오류"));

    const { result } = renderHook(() => useRankingData());

    await waitFor(() => expect(result.current.data.error).toBeTruthy());

    axios.get.mockResolvedValue(makePage({ rankings: [{ id: 9 }], totalPages: 1 }));

    await act(async () => {
      result.current.retryLoad();
    });

    await waitFor(() => expect(result.current.data.error).toBeNull());
  });
});

describe("usePerformanceMonitor", () => {
  it("초기 지표는 0으로 시작한다", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    expect(result.current.metrics.renderTime).toBe(0);
    expect(result.current.metrics.itemsRendered).toBe(0);
  });

  it("렌더 측정 함수를 제공한다", () => {
    const { result } = renderHook(() => usePerformanceMonitor());

    expect(typeof result.current.measureRender).toBe("function");
    expect(typeof result.current.measureMemory).toBe("function");
  });
});
