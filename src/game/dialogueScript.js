/**
 * 레거시 대사 변환: 원문 텍스트 > 화자별 줄(Line), 장면·선택지 > SceneScript
 * 파서 규칙: ^·줄바꿈 분할 > 화자 접두 판별 > 따옴표·괄호 벗기기 > 주인공 이름 치환
 */

export const SPEAKER = {
  PLAYER: "player",
  SUJUNG: "sujung",
  NARRATION: "narration",
};

export const DEFAULT_PLAYER_NAME = "주인공";
const SUJUNG_DISPLAY_NAME = "이수정";

// 화자 별칭 > 화자 id (본문 따옴표 없이도 화자로 인정)
const SPEAKER_ID_BY_ALIAS = {
  이수정: SPEAKER.SUJUNG,
  수정: SPEAKER.SUJUNG,
  주인공: SPEAKER.PLAYER,
  나: SPEAKER.PLAYER,
};

// intro.json 캐릭터 id > 화자 id
const INTRO_SPEAKER_ID_BY_CHARACTER_ID = { mc: SPEAKER.PLAYER, sujung: SPEAKER.SUJUNG };

const PIECE_SEPARATOR = /\^|\r?\n/;
// 이름(한글·영문·? 1~5자) + 콜론(반각·전각) + 본문
const SPEAKER_PREFIX = /^([가-힣A-Za-z?]{1,5})\s*[:：]\s*([\s\S]+)$/;
const QUOTE_CHARACTERS = "“”\"‘’'";
const PLAYER_PLACEHOLDER = /주인공/g;

const resolvePlayerName = (playerName) => playerName?.trim() || DEFAULT_PLAYER_NAME;

const replacePlayerName = (text, playerName) => text.replace(PLAYER_PLACEHOLDER, playerName);

const startsWithQuote = (text) => QUOTE_CHARACTERS.includes(text[0]);

/** 바깥 따옴표 한 겹 제거 (여는 따옴표는 항상, 닫는 따옴표는 있을 때만) */
const stripOuterQuotes = (text) => {
  if (!startsWithQuote(text)) return text;
  const withoutOpening = text.slice(1);
  const hasClosing =
    withoutOpening.length > 0 && QUOTE_CHARACTERS.includes(withoutOpening.slice(-1));
  return (hasClosing ? withoutOpening.slice(0, -1) : withoutOpening).trim();
};

/** 줄 전체가 ( … ) 또는 ( … ). 형태면 괄호 제거 (뒤 문장부호는 유지) */
const stripWrappingParentheses = (text) => {
  const matched = text.match(/^\(([^()]*)\)\s*([.。!?]*)$/);
  return matched ? `${matched[1].trim()}${matched[2]}` : text;
};

/** 조각 1개 > 화자 판별 결과 (speakerKey: 별칭 또는 원문 이름, null이면 나레이션) */
const classifyPiece = (piece) => {
  const matched = piece.match(SPEAKER_PREFIX);
  if (!matched) return { speakerKey: null, body: piece };
  const [, name, body] = matched;
  const isKnownAlias = name in SPEAKER_ID_BY_ALIAS;
  if (isKnownAlias || startsWithQuote(body)) return { speakerKey: name, body };
  return { speakerKey: null, body: piece };
};

const toDialogueLine = (speakerKey, body, playerName) => {
  const text = replacePlayerName(stripOuterQuotes(body), playerName);
  const speakerId = SPEAKER_ID_BY_ALIAS[speakerKey] ?? speakerKey;
  if (speakerId === SPEAKER.PLAYER) return { speakerId, speakerName: playerName, text };
  if (speakerId === SPEAKER.SUJUNG) return { speakerId, speakerName: SUJUNG_DISPLAY_NAME, text };
  return { speakerId, speakerName: speakerKey, text };
};

/**
 * 원문 > Line[] (연속 나레이션은 \n으로 합쳐 한 줄)
 * @param {string} raw
 * @param {{ playerName?: string }} [options]
 */
export const parseLines = (raw, { playerName } = {}) => {
  const resolvedName = resolvePlayerName(playerName);
  const lines = [];
  let pendingNarrations = [];

  // 쌓인 나레이션 조각을 한 줄로 비움 (화자 대사 직전·종료 시)
  const flushNarration = () => {
    if (pendingNarrations.length === 0) return;
    lines.push({
      speakerId: SPEAKER.NARRATION,
      speakerName: "",
      text: replacePlayerName(pendingNarrations.join("\n"), resolvedName),
    });
    pendingNarrations = [];
  };

  (raw ?? "")
    .split(PIECE_SEPARATOR)
    .map((piece) => piece.trim())
    .filter(Boolean)
    .forEach((piece) => {
      const { speakerKey, body } = classifyPiece(piece);
      if (speakerKey === null) {
        pendingNarrations.push(stripWrappingParentheses(body));
        return;
      }
      flushNarration();
      lines.push(toDialogueLine(speakerKey, body, resolvedName));
    });
  flushNarration();

  return lines;
};

/** 선택지 문구 > 화면 표시용 (화자 접두·바깥 따옴표 제거, 주인공 치환) */
export const parseChoiceLabel = (ans, { playerName } = {}) => {
  const trimmed = (ans ?? "").trim();
  const matched = trimmed.match(SPEAKER_PREFIX);
  const body = matched && matched[1] in SPEAKER_ID_BY_ALIAS ? matched[2] : trimmed;
  return replacePlayerName(stripOuterQuotes(body), resolvePlayerName(playerName));
};

/** plot 장면 1개 > SceneScript (error 옵션은 gameOver) */
export const toSceneScript = (plotScene, { playerName } = {}) => ({
  sprite: plotScene.img ?? null,
  lines: parseLines(plotScene.text, { playerName }),
  choices: (plotScene.options ?? []).map((option) => ({
    label: parseChoiceLabel(option.ans, { playerName }),
    score: option.score,
    gameOver: Boolean(option.error),
    followUp: parseLines(option.subtext, { playerName }),
  })),
});

/** storyData > plot 순서대로 SceneScript[] */
export const toStageScript = (storyData, { playerName } = {}) =>
  storyData.plot.map((plotScene) => toSceneScript(plotScene, { playerName }));

/** intro.json story > 장면 1개짜리 SceneScript[] (화자: mc > player, sujung > sujung, 그 외 displayName) */
export const fromIntroStory = (story, { playerName } = {}) => {
  const resolvedName = resolvePlayerName(playerName);
  const lines = story.scenes.map((introScene) => {
    const speakerId = INTRO_SPEAKER_ID_BY_CHARACTER_ID[introScene.speaker];
    const displayName = story.characters[introScene.speaker]?.displayName ?? introScene.speaker;
    const baseLine = {
      speakerId: speakerId ?? displayName,
      speakerName: displayName,
      text: replacePlayerName(introScene.text, resolvedName),
      sprite: introScene.characterImage,
    };
    if (speakerId === SPEAKER.PLAYER) return { ...baseLine, speakerName: resolvedName };
    if (speakerId === SPEAKER.SUJUNG) return { ...baseLine, speakerName: SUJUNG_DISPLAY_NAME };
    return baseLine;
  });
  return [{ sprite: null, lines, choices: [] }];
};
