import { useEffect, useRef } from "react";

// 키 입력을 가로채지 않을 대상 (버튼·링크·입력창·모달)
const INTERACTIVE_TARGET_SELECTOR = "button, a, input, textarea, [role='dialog']";
const ADVANCE_KEYS = [" ", "Enter"];

/**
 * 진행 키 입력: Space·Enter는 onAdvance, 1~4는 onChoose(index)
 * 비활성·키 반복·버튼/입력창/모달 위 입력은 무시
 */
export function useAdvanceKeys({ enabled, onAdvance, onChoose, choiceCount }) {
  // 최신 콜백을 참조해 리스너 재등록 방지
  const latestRef = useRef({});
  latestRef.current = { onAdvance, onChoose, choiceCount };

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      if (event.repeat) return;
      if (event.target?.closest?.(INTERACTIVE_TARGET_SELECTOR)) return;

      const { onAdvance: advance, onChoose: choose, choiceCount: count } = latestRef.current;
      if (ADVANCE_KEYS.includes(event.key)) {
        event.preventDefault();
        advance();
        return;
      }
      // "1"~"4" > 0~3번 선택지 (선택지 수 안쪽만)
      const index = Number(event.key) - 1;
      if (Number.isInteger(index) && index >= 0 && index <= 3 && index < count) {
        choose(index);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enabled]);
}
