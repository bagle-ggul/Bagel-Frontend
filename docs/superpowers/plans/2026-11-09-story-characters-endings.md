# 스토리·캐릭터·엔딩 재설계 구현 계획 (#128)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development. Steps use checkbox (`- [ ]`) syntax.

**Goal:** 스토리 데이터를 화자 ID가 명시된 JSON 하나의 형식으로 통합하고, 대사를 다시 쓰고, 엔딩 4종을 공용 플레이어 위의 데이터로 바꾼다.

**Architecture:** 스테이지·인트로·엔딩 대사는 `src/data/stories/*.json`(화자 ID + 본문)이 단일 원본이다. 화자 ID → 표시 이름은 `src/game/characters.js` 한 곳에서 정한다. 엔딩 결정은 순수 함수 `resolveEnding`이 하고, 엔딩 화면은 `DialoguePlayer`를 재사용하는 `EndingPage` 하나다. 분기 규칙(`stageRules.json`·`storyFlow.js`)은 그대로 둔다.

**Tech Stack:** React 18 CRA, Recoil, styled-components, framer-motion, Jest + RTL

**Spec:** `docs/superpowers/specs/2026-11-09-game-experience-redesign-design.md` 4절

## Global Constraints

- 스테이지별 장면 수·장면 순서·장면별 선택지 수와 순서·점수·게임오버 여부는 바꾸지 않는다 (`stageRules.json`의 씬 인덱스와 `storyFlow.test.js` 기대값 유지)
- 히로인 표시 이름 `이수정`, 본문 호칭 `수정`. 플레이어는 닉네임(없으면 `주인공`). 낯선 존재는 `???`
- 본문 안 플레이어 이름 자리는 `{player}` 표기 하나만 쓴다
- 색·간격은 토큰만. `console.*` 금지. 품질 게이트 4종 통과
- 엔딩 결정: `score >= 100` 이고 이번 회차에 스테이지 4의 "시간을 되돌릴 수 있다면" 질문을 골랐으면 `hidden`, 아니면 `score >= 100` happy / `50 <= score < 100` middle / 그 외 sad

## Review Focus

- 닉네임이 비었거나 공백일 때 `{player}`가 `주인공`으로 바뀌는가
- 새로고침 뒤에도 회귀 횟수·고른 선택 기록이 남는가 (sessionStorage), 새 게임 시작 시 초기화되는가
- 엔딩 화면에서 대사를 끝까지 넘기면 요약(고른 선택, 회귀 횟수)과 버튼이 보이는가
- 게임오버 선택은 점수 없이 회귀 횟수만 1 늘리는가
- 히든 조건을 만족하지 않는 100점 이상은 happy로 가는가

---

### Task 1: 스토리 데이터 JSON 통합

**Files:** Create `src/data/stories/stage1.json`~`stage5.json`, `src/game/characters.js`. Modify `src/data/stories/intro.json`, `src/game/dialogueScript.js`, `src/game/stages.js`, `src/pages/Intro.jsx`, 관련 테스트. Delete `src/utils/data.jsx`~`data5.jsx`.

- JSON 형식: `{ "place", "scenes": [ { "sprite", "lines": [{ "speaker", "text" }], "choices": [{ "label", "score", "gameOver"?, "followUp": [{ "speaker", "text" }] }] } ] }`. intro는 같은 형식, 장면 1개, 줄마다 `sprite` 허용
- `characters.js`: `CHARACTER_ID = { PLAYER, SUJUNG, STRANGER, NARRATION, CHOICE }`, `resolveSpeakerName(speakerId, playerName)`
- `dialogueScript.js`: 문자열 파서 제거, `toStageScript(storyJson, { playerName })` → 기존 `SceneScript` 모양(`sprite, lines[{speakerId, speakerName, text}], choices[{label, score, gameOver, followUp}]`) 유지
- 기존 원문은 이 작업에서 바꾸지 않고 옮기기만 한다 (재작성은 Task 2)

### Task 2: 대사 재작성 (컨트롤러 직접)

stage1~5·intro JSON의 `text`·`label`만 다시 쓴다. 회귀·낯선 존재 복선, 호칭 통일, 말투 정리.

### Task 3: 엔딩 데이터화와 회차 요약

**Files:** Create `src/data/stories/endings.json`, `src/game/ending.js`(+test), `src/pages/EndingPage.jsx`(+test). Modify `src/game/progress.js`(선택 기록·회귀 횟수), `src/pages/StagePage.jsx`, `src/pages/GameOver.jsx`, `src/pages/Result.jsx`, 라우터. Delete `Happy.jsx`·`Middle.jsx`·`Sad.jsx`·`Hidden.jsx`.

- `resolveEnding({ score, choiceHistory }) -> "happy" | "middle" | "sad" | "hidden"`
- `progress.js`: `recordChoice({ stage, label })`, `getChoiceHistory()`, `incrementRegressionCount()`, `getRegressionCount()`, 새 게임 초기화에 포함
- `EndingPage`: `DialoguePlayer`로 엔딩 대사 재생 → 종료 슬롯에 엔딩 이름, 고른 선택 목록, 회귀 횟수, 홈·랭킹 버튼
- 문서: `docs/GAME-FLOW.md` 엔딩 분기·게임오버·데이터 위치 갱신
