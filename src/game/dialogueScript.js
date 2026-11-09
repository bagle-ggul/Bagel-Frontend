/**
 * 스토리 JSON 변환: 장면·대사·선택지 > SceneScript
 * 화자 id는 JSON에 명시, 표시 이름과 {player}는 여기서 채움
 */
import {
  CHARACTER_ID,
  DEFAULT_PLAYER_NAME,
  fillPlayerName,
  resolveSpeakerName,
} from "./characters";

// 기존 importer 호환용 별칭
export const SPEAKER = CHARACTER_ID;
export { DEFAULT_PLAYER_NAME };

/** JSON 대사 1줄 > Line (sprite는 있을 때만) */
const toDialogueLine = ({ speaker, text, sprite }, playerName) => ({
  speakerId: speaker,
  speakerName: resolveSpeakerName(speaker, playerName),
  text: fillPlayerName(text, playerName),
  ...(sprite ? { sprite } : {}),
});

/** JSON 장면 1개 > SceneScript */
const toSceneScript = (scene, playerName) => ({
  sprite: scene.sprite ?? null,
  lines: scene.lines.map((line) => toDialogueLine(line, playerName)),
  choices: (scene.choices ?? []).map((choice) => ({
    label: fillPlayerName(choice.label, playerName),
    score: choice.score,
    gameOver: Boolean(choice.gameOver),
    followUp: (choice.followUp ?? []).map((line) => toDialogueLine(line, playerName)),
  })),
});

/** 스테이지 JSON > SceneScript[] (장면 순서 유지) */
export const toStageScript = (storyJson, { playerName } = {}) =>
  storyJson.scenes.map((scene) => toSceneScript(scene, playerName));

/** 인트로 JSON > SceneScript[] (장면 1개, 선택지 없음) */
export const toIntroScript = (introJson, { playerName } = {}) =>
  introJson.scenes.map((scene) => toSceneScript(scene, playerName));
