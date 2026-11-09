/**
 * 엔딩 결정·변환: 점수 + 고른 선택 > 엔딩 id, 엔딩 JSON > SceneScript
 * 히든 > 해피 > 미들 > 새드 순서로 판정
 */
import { ROUTES } from "../constants/routes";

import { fillPlayerName, resolveSpeakerName } from "./characters";

export const ENDING = {
  HAPPY: "happy",
  MIDDLE: "middle",
  SAD: "sad",
  HIDDEN: "hidden",
};

export const ENDING_IDS = Object.values(ENDING);

// 엔딩 id > 화면 경로
export const ENDING_ROUTE_BY_ID = {
  [ENDING.HAPPY]: ROUTES.HAPPY,
  [ENDING.MIDDLE]: ROUTES.MIDDLE,
  [ENDING.SAD]: ROUTES.SAD,
  [ENDING.HIDDEN]: ROUTES.HIDDEN,
};

// 점수 임계치: 100 이상 해피(히든 후보), 50 이상 미들, 그 아래 새드
const HAPPY_SCORE_MIN = 100;
const MIDDLE_SCORE_MIN = 50;

// 히든 조건 선택: 스테이지 4 장면 1의 "시간을 되돌릴 수 있다면" 질문
const HIDDEN_KEY_CHOICE = { stage: 4, sceneIndex: 1, choiceIndex: 1 };

/** 이번 회차에 히든 조건 선택을 골랐는지 */
const hasChosenHiddenKey = (choiceHistory = []) =>
  choiceHistory.some(
    (entry) =>
      entry.stage === HIDDEN_KEY_CHOICE.stage &&
      entry.sceneIndex === HIDDEN_KEY_CHOICE.sceneIndex &&
      entry.choiceIndex === HIDDEN_KEY_CHOICE.choiceIndex
  );

/** 점수 + 고른 선택 > 엔딩 id */
export const resolveEnding = ({ score, choiceHistory }) => {
  if (score >= HAPPY_SCORE_MIN) {
    return hasChosenHiddenKey(choiceHistory) ? ENDING.HIDDEN : ENDING.HAPPY;
  }
  if (score >= MIDDLE_SCORE_MIN) return ENDING.MIDDLE;
  return ENDING.SAD;
};

/** 엔딩 대사 1줄 > Line (name 있으면 표시 이름 대체, {player} 치환) */
const toEndingLine = ({ speaker, name, text }, playerName) => ({
  speakerId: speaker,
  speakerName: name ? fillPlayerName(name, playerName) : resolveSpeakerName(speaker, playerName),
  text: fillPlayerName(text, playerName),
});

/** 엔딩 JSON > SceneScript[] (장면 1개, 선택지 없음) */
export const toEndingScript = (endingJson, { playerName } = {}) => [
  {
    sprite: endingJson.sprite ?? null,
    lines: endingJson.lines.map((line) => toEndingLine(line, playerName)),
    choices: [],
  },
];
