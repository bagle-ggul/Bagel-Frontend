import { useEffect, useRef } from "react";

// 자동 모드: 타이핑이 끝난 뒤 다음 줄까지 대기 (ms)
export const AUTO_DELAY_MS = 1600;
// 건너뛰기 모드: 본 줄을 넘기는 간격 (ms)
export const SKIP_INTERVAL_MS = 90;

/**
 * 자동 진행·건너뛰기: auto는 타이핑 완료 후 지연 뒤 진행, skip은 본 줄만 빠르게 진행
 * skip은 선택지(lineKey null)나 처음 보는 줄에서 멈춤(onStop), manual은 동작 없음
 */
export function useAutoPlay({
  mode,
  lineKey,
  isTypingDone,
  isSeen,
  onComplete,
  onAdvance,
  onStop,
}) {
  // 최신 콜백을 참조해 타이머 재시작 방지
  const callbacksRef = useRef({});
  callbacksRef.current = { onComplete, onAdvance, onStop };

  useEffect(() => {
    if (mode === "auto") {
      if (lineKey === null || lineKey === undefined || !isTypingDone) return undefined;
      const timerId = setTimeout(() => callbacksRef.current.onAdvance(), AUTO_DELAY_MS);
      return () => clearTimeout(timerId);
    }

    if (mode === "skip") {
      if (lineKey === null || lineKey === undefined || !isSeen) {
        callbacksRef.current.onStop();
        return undefined;
      }
      const timerId = setTimeout(() => {
        callbacksRef.current.onComplete();
        callbacksRef.current.onAdvance();
      }, SKIP_INTERVAL_MS);
      return () => clearTimeout(timerId);
    }

    return undefined;
  }, [mode, lineKey, isTypingDone, isSeen]);
}
