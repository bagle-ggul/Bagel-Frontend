import { useState, useCallback, useRef, useEffect } from "react";
import axios from "../utils/axios";

/**
 * 랭킹 데이터 관리를 위한 커스텀 훅
 * @param {number} pageSize - 페이지당 아이템 수
 * @returns {Object} - 랭킹 데이터와 관련 함수들
 */
export const useRankingData = (pageSize = 20) => {
  const [data, setData] = useState({
    rankings: [],
    currentPage: 0,
    totalPages: 0,
    totalItems: 0,
    hasNextPage: true,
    isLoading: false,
    isInitialLoading: true,
    error: null,
  });

  const abortControllerRef = useRef();
  const accessToken = localStorage.getItem("refreshToken");

  // 메모리 관리를 위한 최대 아이템 수
  const MAX_ITEMS_IN_MEMORY = 1000;

  /**
   * 메모리 관리 함수 - 너무 많은 아이템이 쌓이면 오래된 것들 제거
   */
  const manageMemory = useCallback((currentRankings, newRankings) => {
    const allRankings = [...currentRankings, ...newRankings];

    if (allRankings.length > MAX_ITEMS_IN_MEMORY) {
      // 오래된 항목 200개 제거
      return allRankings.slice(200);
    }

    return allRankings;
  }, []);

  /**
   * 다음 페이지 데이터 로드
   */
  const loadNextPage = useCallback(async () => {
    if (data.isLoading || !data.hasNextPage) {
      return;
    }

    // 이전 요청 취소
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 새 AbortController 생성
    abortControllerRef.current = new AbortController();

    setData((prev) => ({
      ...prev,
      isLoading: true,
      error: null,
    }));

    try {
      const response = await axios.get("/api/game/ranking", {
        signal: abortControllerRef.current.signal,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          page: data.currentPage,
          size: pageSize,
        },
      });

      const newRankings = response.data.rankings || [];
      const totalPages = response.data.totalPages || 1;
      const totalItems = response.data.totalItems || 0;

      setData((prev) => {
        const managedRankings = manageMemory(prev.rankings, newRankings);

        return {
          ...prev,
          rankings: managedRankings,
          currentPage: prev.currentPage + 1,
          totalPages,
          totalItems,
          hasNextPage: prev.currentPage + 1 < totalPages,
          isLoading: false,
          isInitialLoading: false,
          error: null,
        };
      });
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("랭킹 데이터 로딩 오류:", error);
        setData((prev) => ({
          ...prev,
          isLoading: false,
          isInitialLoading: false,
          error: error.message || "데이터를 불러오는 중 오류가 발생했습니다.",
        }));
      }
    }
  }, [data.currentPage, data.hasNextPage, data.isLoading, pageSize, accessToken, manageMemory]);

  /**
   * 데이터 새로고침 (처음부터 다시 로드)
   */
  const refreshData = useCallback(() => {
    setData({
      rankings: [],
      currentPage: 0,
      totalPages: 0,
      totalItems: 0,
      hasNextPage: true,
      isLoading: false,
      isInitialLoading: true,
      error: null,
    });
  }, []);

  /**
   * 에러 재시도
   */
  const retryLoad = useCallback(() => {
    setData((prev) => ({ ...prev, error: null }));
    loadNextPage();
  }, [loadNextPage]);

  // 컴포넌트 언마운트시 요청 취소
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // 초기 데이터 로드
  useEffect(() => {
    if (data.isInitialLoading && data.rankings.length === 0) {
      loadNextPage();
    }
  }, [data.isInitialLoading, data.rankings.length, loadNextPage]);

  return {
    data,
    loadNextPage,
    refreshData,
    retryLoad,
  };
};

/**
 * 성능 모니터링을 위한 훅
 */
export const usePerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({
    renderTime: 0,
    itemsRendered: 0,
    memoryUsed: 0,
  });

  const measureRender = useCallback((itemCount) => {
    const startTime = performance.now();

    requestAnimationFrame(() => {
      const endTime = performance.now();
      setMetrics((prev) => ({
        ...prev,
        renderTime: Math.round(endTime - startTime),
        itemsRendered: itemCount,
      }));
    });
  }, []);

  const measureMemory = useCallback(() => {
    if ("memory" in performance) {
      setMetrics((prev) => ({
        ...prev,
        memoryUsed: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024), // MB
      }));
    }
  }, []);

  return { metrics, measureRender, measureMemory };
};
