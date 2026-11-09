import { useEffect, useRef } from "react";

// 진행 키를 가로채지 않을 대상 (버튼·링크는 Space·Enter로 스스로 눌림)
const INTERACTIVE_TARGET_SELECTOR = "button, a, input, textarea, [role='dialog']";
// 숫자 선택 키를 가로채지 않을 대상 (글자 입력·모달만, 버튼 포커스 중엔 선택 허용)
const TEXT_ENTRY_TARGET_SELECTOR = "input, textarea, [role='dialog']";
const ADVANCE_KEYS = [" ", "Enter"];

const isTargetWithin = (event, selector) => Boolean(event.target?.closest?.(selector));

/**
 * 진행 키 입력: Space·Enter는 onAdvance, 1~4는 onChoose(index)
 * 비활성·키 반복·입력창/모달 위 입력은 무시, 버튼/링크 위 Space·Enter도 무시
 */
export function useAdvanceKeys({ enabled, onAdvance, onChoose, choiceCount }) {
  // 최신 콜백을 참조해 리스너 재등록 방지
  const latestRef = useRef({});
  latestRef.current = { onAdvance, onChoose, choiceCount };

  useEffect(() => {
    if (!enabled) return undefined;

    const handleKeyDown = (event) => {
      if (event.repeat) return;

      const { onAdvance: advance, onChoose: choose, choiceCount: count } = latestRef.current;
      if (ADVANCE_KEYS.includes(event.key)) {
        if (isTargetWithin(event, INTERACTIVE_TARGET_SELECTOR)) return;
        event.preventDefault();
        advance();
        return;
      }
      if (isTargetWithin(event, TEXT_ENTRY_TARGET_SELECTOR)) return;
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
