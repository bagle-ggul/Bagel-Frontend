/**
 * 캐릭터 정의: 화자 id, 표시 이름, 주인공 이름 치환
 * 스토리 JSON의 speaker 값이 CHARACTER_ID를 가리킴
 */

export const CHARACTER_ID = {
  PLAYER: "player",
  SUJUNG: "sujung",
  STRANGER: "stranger",
  NARRATION: "narration",
  // 지난 대사 기록의 고른 선택지 (DialogueLogModal이 "선택 · " 접두로 표시)
  CHOICE: "choice",
};

export const DEFAULT_PLAYER_NAME = "주인공";

// 대본 안 주인공 이름 자리표시자
const PLAYER_NAME_PLACEHOLDER = /\{player\}/g;

// 고정 이름 화자 id > 표시 이름 (player는 입력 이름을 쓰므로 제외)
const DISPLAY_NAME_BY_CHARACTER_ID = {
  [CHARACTER_ID.SUJUNG]: "이수정",
  [CHARACTER_ID.STRANGER]: "???",
  [CHARACTER_ID.NARRATION]: "",
};

/** 입력 이름 > 사용할 이름 (공백뿐이면 기본 이름) */
const resolvePlayerName = (playerName) => playerName?.trim() || DEFAULT_PLAYER_NAME;

/** 화자 id > 표시 이름 (player는 입력 이름, 모르는 id는 id 그대로) */
export const resolveSpeakerName = (speakerId, playerName) => {
  if (speakerId === CHARACTER_ID.PLAYER) return resolvePlayerName(playerName);
  return DISPLAY_NAME_BY_CHARACTER_ID[speakerId] ?? speakerId;
};

/** 대본 문구의 {player} > 주인공 이름 */
export const fillPlayerName = (text, playerName) =>
  text.replace(PLAYER_NAME_PLACEHOLDER, resolvePlayerName(playerName));
