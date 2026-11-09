import { useCallback, useEffect, useState } from "react";

// 글자 하나가 나타나는 간격 (ms)
export const TYPING_SPEED_MS = 35;

/**
 * 타이핑 효과: 글자 단위 setTimeout, 즉시 완성(complete) 지원
 * text·resetKey가 바뀌면 처음부터, speed <= 0이면 바로 전체 표시
 */
export function useTypewriter(text, { speed = TYPING_SPEED_MS, resetKey } = {}) {
  const token = `${resetKey}\u0000${text}`;
  const [progress, setProgress] = useState({ token, count: 0 });

  // 다른 문장의 진행도는 0으로 취급 (바뀐 첫 렌더에 이전 글자가 비치지 않게)
  const count = speed <= 0 ? text.length : progress.token === token ? progress.count : 0;
  const isDone = count >= text.length;

  useEffect(() => {
    if (isDone) return undefined;
    const timerId = setTimeout(() => setProgress({ token, count: count + 1 }), speed);
    return () => clearTimeout(timerId);
  }, [token, count, speed, isDone]);

  const complete = useCallback(() => setProgress({ token, count: text.length }), [token, text]);

  return { visibleText: text.slice(0, count), isDone, complete };
}
