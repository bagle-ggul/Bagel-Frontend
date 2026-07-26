/**
 * UI 설정 영속화 유틸리티
 *
 * 인증 토큰은 auth.js가 담당한다. 이 모듈은 사용자 환경설정만 다룬다.
 * 둘을 분리한 이유: 토큰은 보안·만료 정책이 걸리는 값이고, 설정은 그렇지 않다.
 * 같은 저장소를 쓴다고 같은 모듈에 두면 정책이 뒤섞인다.
 */

export const STORAGE_KEYS = {
  MUSIC_MUTED: "musicMuted",
};

/**
 * 배경음 음소거 여부 조회
 * @returns {boolean}
 */
export const isMusicMuted = () => {
  return localStorage.getItem(STORAGE_KEYS.MUSIC_MUTED) === "true";
};

/**
 * 배경음 음소거 여부 저장
 * @param {boolean} muted
 */
export const setMusicMuted = (muted) => {
  localStorage.setItem(STORAGE_KEYS.MUSIC_MUTED, String(muted));
};

const storage = {
  STORAGE_KEYS,
  isMusicMuted,
  setMusicMuted,
};

export default storage;
