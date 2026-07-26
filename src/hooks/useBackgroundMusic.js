import { useEffect, useRef } from "react";

import { logger } from "../utils/logger";

/**
 * 배경음 재생 훅.
 *
 * Main1~5와 엔딩 화면들이 같은 재생 코드를 각자 복사해 갖고 있어 하나로 모았다.
 *
 * 반환한 ref를 <audio> 요소에 연결하면 마운트 시 자동 재생을 시도한다.
 * 브라우저 자동재생 정책으로 실패할 수 있으나 게임 진행에는 지장이 없으므로
 * 경고만 남기고 넘어간다.
 *
 * @returns {React.RefObject} audio 요소에 연결할 ref
 */
export const useBackgroundMusic = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (!audioRef.current) return;

    audioRef.current.play().catch((error) => {
      logger.warn("배경음 재생 실패:", error);
    });
  }, []);

  return audioRef;
};

export default useBackgroundMusic;
