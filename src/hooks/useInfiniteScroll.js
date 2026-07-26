import { useState, useEffect, useRef, useCallback } from "react";

/**
 * 무한스크롤을 위한 Intersection Observer 기반 커스텀 훅
 * @param {Function} loadMore - 더 많은 데이터를 로드하는 함수
 * @param {boolean} hasNextPage - 더 로드할 데이터가 있는지 여부
 * @param {Object} options - Intersection Observer 옵션
 * @returns {Object} - { loadMoreRef, isLoading }
 */
export const useInfiniteScrollObserver = (loadMore, hasNextPage, options = {}) => {
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef();
  const observerRef = useRef();

  const handleIntersection = useCallback(
    async (entries) => {
      const [entry] = entries;

      if (entry.isIntersecting && hasNextPage && !isLoading) {
        setIsLoading(true);
        try {
          await loadMore();
        } catch (error) {
          console.error("데이터 로딩 오류:", error);
        } finally {
          setIsLoading(false);
        }
      }
    },
    [loadMore, hasNextPage, isLoading]
  );

  useEffect(() => {
    const targetElement = loadMoreRef.current;

    // Intersection Observer 지원 확인
    if ("IntersectionObserver" in window && targetElement) {
      const defaultOptions = {
        threshold: 0.1,
        rootMargin: "100px",
        ...options,
      };

      observerRef.current = new IntersectionObserver(handleIntersection, defaultOptions);

      observerRef.current.observe(targetElement);

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    } else if (targetElement) {
      // 폴백: 스크롤 이벤트 사용
      const handleScroll = () => {
        const rect = targetElement.getBoundingClientRect();
        const isIntersecting = rect.top < window.innerHeight + 100;

        if (isIntersecting && hasNextPage && !isLoading) {
          handleIntersection([{ isIntersecting: true }]);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, [handleIntersection, hasNextPage, isLoading, options]);

  return { loadMoreRef, isLoading };
};

/**
 * 스크롤 진행률 계산 훅
 * @returns {number} - 0-100 사이의 스크롤 진행률
 */
export const useScrollProgress = () => {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const calculateScrollProgress = () => {
      const scrollTop = window.pageYOffset;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    const throttledCalculateScrollProgress = throttle(calculateScrollProgress, 16);

    window.addEventListener("scroll", throttledCalculateScrollProgress);
    calculateScrollProgress(); // 초기값 설정

    return () => {
      window.removeEventListener("scroll", throttledCalculateScrollProgress);
    };
  }, []);

  return scrollProgress;
};

/**
 * 맨 위로 스크롤 버튼 표시 여부 훅
 * @param {number} threshold - 버튼을 표시할 스크롤 위치 (px)
 * @returns {Object} - { showScrollTop, scrollToTop }
 */
export const useScrollToTop = (threshold = 300) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.pageYOffset > threshold);
    };

    const throttledHandleScroll = throttle(handleScroll, 100);

    window.addEventListener("scroll", throttledHandleScroll);
    handleScroll(); // 초기값 설정

    return () => {
      window.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [threshold]);

  return { showScrollTop, scrollToTop };
};

/**
 * 모바일 터치 제스처 훅
 * @param {Function} onSwipeUp - 위로 스와이프 시 실행할 함수
 * @param {number} minSwipeDistance - 최소 스와이프 거리 (px)
 * @returns {Object} - 터치 이벤트 핸들러들
 */
export const useTouchSwipe = (onSwipeUp, minSwipeDistance = 50) => {
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const handleTouchStart = useCallback((e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientY);
  }, []);

  const handleTouchMove = useCallback((e) => {
    setTouchEnd(e.targetTouches[0].clientY);
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isUpSwipe = distance > minSwipeDistance;

    if (isUpSwipe && onSwipeUp) {
      onSwipeUp();
    }
  }, [touchStart, touchEnd, minSwipeDistance, onSwipeUp]);

  return {
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  };
};

// 유틸리티 함수들
const throttle = (func, limit) => {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
