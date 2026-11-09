/**
 * 본 줄 기록: 스킵 모드에서 이미 본 줄만 건너뛰기 위한 sessionStorage 저장
 * resetProgress와 연결하지 않음 (다시 시작해도 본 줄 유지)
 */

export const SEEN_LINES_KEY = "bagel:game:seenLines";

// 저장된 키 목록 (손상된 JSON은 빈 기록)
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
  sessionStorage.setItem(SEEN_LINES_KEY, JSON.stringify([...seenKeys, key]));
};

// 테스트용 기록 초기화
export const clearSeenLines = () => {
  sessionStorage.removeItem(SEEN_LINES_KEY);
};
