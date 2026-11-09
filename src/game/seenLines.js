/**
 * 본 줄 기록: 스킵 모드에서 이미 본 줄만 건너뛰기 위한 sessionStorage 저장
 * resetProgress와 연결하지 않음 (다시 시작해도 본 줄 유지)
 */

import { logger } from "../utils/logger";

export const SEEN_LINES_KEY = "bagel:game:seenLines";

// 저장된 키 목록 (손상된 JSON·저장소 막힘은 빈 기록)
const readSeenKeys = () => {
  try {
    const parsed = JSON.parse(sessionStorage.getItem(SEEN_LINES_KEY));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const isLineSeen = (key) => readSeenKeys().includes(key);

export const markLineSeen = (key) => {
  const seenKeys = readSeenKeys();
  if (seenKeys.includes(key)) return;
  // 용량 초과·사생활 모드 실패는 기록만 포기 (플레이는 계속)
  try {
    sessionStorage.setItem(SEEN_LINES_KEY, JSON.stringify([...seenKeys, key]));
  } catch (error) {
    logger.warn("[seen lines] write failed :", error);
  }
};

// 테스트용 기록 초기화
export const clearSeenLines = () => {
  try {
    sessionStorage.removeItem(SEEN_LINES_KEY);
  } catch (error) {
    logger.warn("[seen lines] clear failed :", error);
  }
};
