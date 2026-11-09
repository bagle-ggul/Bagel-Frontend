# 대사 진행과 선택지 UX 재설계 (#127) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 대사 넘기기와 선택을 분리한 하나의 데이터 기반 장면 플레이어를 만든다(탭·Space·Enter 진행, 이름표, 힌트 없는 같은 모양 선택지 카드, 자동 진행·건너뛰기·지난 대사, 장면 전환·캐릭터 등장·장소별 분위기 효과). 이 플레이어로 `Main1`~`Main5`와 인트로를 대체한다.

**Architecture:** 레거시 텍스트 → 줄 배열 파서(`src/game/dialogueScript.js`, 순수, #128에서 통째로 교체) → 진행 상태 순수 함수(`src/game/dialogueFlow.js`) → 스테이지 설정·장면 종료 판정(`src/game/stages.js`, `src/game/stageProgress.js`, 기존 `storyFlow.js` 위임만) → 훅(타이핑·키 입력·자동/건너뛰기·미리 받기·흐름) → 표시 컴포넌트(`src/components/scene/`) → 조립 `DialoguePlayer` → 화면 `StagePage`(스테이지 1~5)와 `Intro`. 라우트(`/main1`~`/main5`), `RequireProgress` 가드, `stageRules.json`, `storyFlow.js`는 그대로 둔다.

**Tech Stack:** React 18, styled-components 6, framer-motion 11 (`AnimatePresence`, `useReducedMotion`, `MotionConfig`), Recoil, React Router 6 (`React.lazy` + `Suspense`), Jest + React Testing Library (CRA)

**Spec:** `docs/superpowers/specs/2026-11-09-game-experience-redesign-design.md` 3절(#127), 7절(#131 중 장면 플레이어 통합·코드 분할·미리 받기), 8절(순서), 9절(뼈대 유지, 회귀 테스트가 안전망)

## Global Constraints

- `src/data/stageRules.json`, `src/game/storyFlow.js`, `src/game/storyFlow.test.js`(37개)는 수정하지 않고 매 태스크에서 통과해야 한다
- `src/utils/data*.jsx`와 `src/data/stories/intro.json`의 내용은 바꾸지 않는다(구조화는 #128). 이 계획은 파서로 읽기만 한다
- 라우트 경로 `/main1`~`/main5`, `/intro`, `/over`, `/result`와 가드 조합(`stageGuarded`, `authOnly`)은 그대로
- 새로 만들거나 다시 쓴 파일: 하드코딩 색 0개(`semantic.js` 의미 토큰만), styled props는 `$이름`, 파일 300줄 이하, 짧은 한국어 주석
- 테마: `semantic.js` 의미 토큰만 참조. 원시 `palette`·`rgba(`·`#hex` 금지
- 전역 리셋(`src/index.jsx`)이 `em, i`에 `font: inherit`을 걸므로 나레이션 기울임은 styled 요소에 `font-style: italic`을 직접 준다
- 새 의존성 금지. 애니메이션은 framer-motion과 CSS keyframes로만
- `prefers-reduced-motion: reduce`면 분위기 효과·대기 움직임 끔, 전환은 페이드만
- 파일 삭제(`Main1`~`Main5`, `GameUI/*`, `DialogueSystem.jsx`)는 이 계획 승인을 사용자 승인으로 본다
- 커버리지 게이트(`src/game/`, `src/hooks/` 80%) 유지. 새 순수 함수·훅에는 테스트를 함께 쓴다
- 품질 게이트 4종을 매 태스크 끝에서 통과: `npm run format:check`, `npm run lint`, `npm run test:ci`, `CI=false npm run build`
- 브랜치: `origin/main` 최신화 후 `20261109_#127_기능개선_게임진행_대사_진행과_선택지_UX_재설계`
- 커밋 메시지: `대사 진행과 선택지 UX 재설계 : {type} : {설명} https://github.com/bagle-ggul/Bagel-Frontend/issues/127`. AI 서명 금지. `git add -A` 금지, 건드린 경로만 스테이징

## 결정 사항 (이 계획에서 정함)

| 항목                | 결정                                                                                                                                                                                                     | 이유                                                                                                        |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| 건너뛰기 범위       | **이 브라우저 세션에서 이미 본 줄만** 빠르게 넘긴다(`sessionStorage`). 처음 보는 줄이나 선택지에 닿으면 멈추고 수동으로 돌아감                                                                           | 스펙 3절 "이미 본 장면만". 게임오버 후 재도전에 가장 유용                                                   |
| 본 줄 기록의 수명   | `resetProgress()`가 지우지 **않는다**. 탭을 닫으면 사라짐                                                                                                                                                | 새 게임(재도전) 때 써야 하는 기록                                                                           |
| 게임오버 선택지     | 이어지는 대사(`subtext`)를 일반 대사처럼 끝까지 보여 준 뒤 `/over`. 점수는 더하지 않음(기존과 같음)                                                                                                      | 기존에는 즉시 이동해 회귀 연출 대사가 버려졌음. 스펙 3절 "선택 뒤 대사는 일반 대사와 똑같이"                |
| 인트로              | `DialogueSystem.jsx`를 **완전히 대체·삭제**. `Intro.jsx`가 `DialoguePlayer` 사용. 자동 진행 기본 켬, 세션 건너뛰기 버튼 숨김, 기존 "Skip"은 `인트로 건너뛰기` 버튼으로 유지, 배경은 `bg_intro_main` 고정 | 대사창·이름표·넘기기를 한 벌로 통일. `intro.json`의 장면별 `background`(`bg_beach_dark`)는 실제 파일이 없음 |
| 선택 뒤 캐릭터 그림 | 장면 그림(`scene.img`) 유지, 선택지 `img`는 쓰지 않음                                                                                                                                                    | 기존에도 쓰지 않았고 데이터가 어긋나 있음. 표정 전환은 #128·#129 데이터로                                   |
| 캐릭터 그림 표현    | 현재 그림은 흰 배경이라 둥근 액자(`framed`) 유지. #129의 투명 PNG가 오면 `framed={false}`                                                                                                                | 흰 사각형이 떠 보이지 않게                                                                                  |
| 플레이어 이름       | 닉네임(`characterNameAtom`), 비면 `"주인공"`. 이름이 비면 **모든 스테이지**에서 `/api/my-page` 조회(기존은 Main1만)                                                                                      | 2~5 스테이지 새로고침 시 "주인공"으로 보이던 문제 해결                                                      |
| 선택지 표시         | 모든 카드 같은 모양, 왼쪽에 1~4 번호 배지(키보드 안내, 결과 암시 아님). 바깥 따옴표와 `나 :` 접두 제거                                                                                                   | 스펙 3절                                                                                                    |
| 스테이지 끝         | 기존처럼 `다음 장소로` 버튼(`Button as={Link}`), Enter로도 누름                                                                                                                                          | 동작 유지                                                                                                   |
| 대사 로그           | 스테이지 화면이 마운트된 동안만 쌓음. 고른 선택지도 `speakerId: "choice"`로 남김                                                                                                                         | 단순화                                                                                                      |
| 장소별 분위기 효과  | 1 집 `dust`, 2 카페 `petals`, 3 동굴 `rain`, 4 우산 길 `rain`, 5 해변 `sparkle`, 인트로 `none`                                                                                                           | 사용자 요청                                                                                                 |
| 코드 분할           | `StagePage`, `Intro`, `Result`, 엔딩 4종, `GameOver`를 `React.lazy`로. `Home`·보조 화면은 즉시 로드                                                                                                      | 첫 화면(홈) 용량 절감, #131에서 측정                                                                        |

## Review Focus

1. 정답 힌트 잔존 금지: 선택지 버튼은 모두 같은 class, ▶·⚠·점수별 색 없음 → Task 5 `ChoiceList` 테스트, Task 7 통합 테스트
2. 분기 회귀 금지: `storyFlow.test.js` 37개 무수정 통과, 선택 직후 점수가 `resolveNextStep`에 반영(오래된 클로저 금지, `scoreRef`) → Task 3, Task 7
3. `/main2` → `/main3` 이동 시 같은 `StagePage` 인스턴스 재사용 금지: 라우트 요소에 `key={stage}` → Task 8
4. 키 입력 이중 처리 금지: 버튼 포커스 상태의 Enter가 클릭과 진행을 둘 다 일으키지 않음, 로그 모달이 열려 있으면 Space·Enter·숫자키 무시 → Task 4 `useAdvanceKeys` 테스트
5. 모바일 390×844에서 선택지 4개와 대사창이 잘리지 않음(`100dvh`, 선택지 영역 스크롤) → Task 10 캡처
6. 줄임 동작 설정이면 분위기 효과·대기 움직임이 렌더되지 않음 → Task 6 테스트, Task 10 캡처
7. 하드코딩 색 기준치는 줄기만: 지운 파일·다시 쓴 파일의 항목을 같은 커밋에서 삭제 → Task 8, Task 9

---

## 공용 타입 (모든 태스크가 이 모양을 따른다)

```js
/** Line: 대사 한 줄 */
{ speakerId: "player" | "sujung" | "narration" | string, speakerName: string, text: string, sprite?: string }
// narration이면 speakerName은 "". 알 수 없는 화자는 speakerId = speakerName = 원문 이름

/** Choice: 선택지 하나 */
{ label: string, score: number, gameOver: boolean, followUp: Line[] }

/** SceneScript: 장면 하나 */
{ sprite: string | null, lines: Line[], choices: Choice[] }

/** FlowState: 진행 상태 */
{ sceneIndex: number, phase: "lines" | "choices" | "followUp" | "sceneDone" | "ended", lineIndex: number, choiceIndex: number | null }

/** LogEntry: 지난 대사 기록 */
{ id: string, speakerId: string, speakerName: string, text: string } // 고른 선택지는 speakerId "choice"

/** PlayMode */
"manual" | "auto" | "skip"
```

---

### Task 1: 레거시 대사 파서

**Files:**

- Create: `src/game/dialogueScript.js`
- Test: `src/game/dialogueScript.test.js`

**Interfaces:**

- Produces:
  - `SPEAKER = { PLAYER: "player", SUJUNG: "sujung", NARRATION: "narration" }`
  - `DEFAULT_PLAYER_NAME = "주인공"`
  - `parseLines(raw: string, { playerName?: string } = {}) => Line[]`
  - `parseChoiceLabel(ans: string, { playerName?: string } = {}) => string`
  - `toSceneScript(plotScene, { playerName }) => SceneScript` (`sprite` = `plotScene.img ?? null`, `gameOver` = `Boolean(option.error)`, `followUp` = `parseLines(option.subtext)`)
  - `toStageScript(storyData, { playerName }) => SceneScript[]` (`storyData.plot` 순서대로)
  - `fromIntroStory(story, { playerName }) => SceneScript[]` (장면 1개, `choices: []`. 화자 매핑 `mc → player`, `sujung → sujung`, 나머지는 `characters[id].displayName`(예: `???`). 각 줄의 `sprite`는 `characterImage`)

**파서 규칙 (주석에 요약):**

1. `^`와 줄바꿈으로 나누고 각 조각을 trim, 빈 조각은 버린다
2. 화자 접두 `^(이름)\s*[:：]\s*(본문)$`. 별칭 `이수정`·`수정` → `sujung`, `주인공`·`나` → `player`. 별칭에 없는 이름(한글·영문·`?` 1~5자)은 본문이 따옴표로 시작할 때만 화자로 인정(예: `???: “…”`), 아니면 나레이션
3. 대사 본문은 바깥 따옴표(`“ ” " ‘ ’ '`)를 한 겹 벗긴다
4. 나레이션: 줄 전체가 `( … )`면 괄호를 벗긴다. 연속된 나레이션 조각은 `\n`으로 합쳐 한 줄로
5. 모든 본문의 `주인공`을 플레이어 이름으로 치환(기존 `replaceCharacterName`과 같음. 조사 어색함은 #128에서 데이터로 해결)
6. 플레이어 이름 = `playerName?.trim() || DEFAULT_PLAYER_NAME`, 수정 표시 이름 = `"이수정"`

- [ ] **Step 0:** `git fetch origin && git switch -c 20261109_#127_기능개선_게임진행_대사_진행과_선택지_UX_재설계 origin/main`
- [ ] **Step 1:** 테스트 작성 (`describe("parseLines")`)
  - `이수정 : 접두를 화자 sujung으로 분리한다`: `parseLines("이수정 : 내일 여행 갈 준비는 다 했어?")` → `[{ speakerId: "sujung", speakerName: "이수정", text: "내일 여행 갈 준비는 다 했어?" }]`
  - `주인공: 과 곡선 따옴표를 처리하고 닉네임을 화자명으로 쓴다`: `parseLines('주인공: “물론이지.”', { playerName: "민수" })` → `[{ speakerId: "player", speakerName: "민수", text: "물론이지." }]`
  - `공백·전각 콜론 변형을 모두 인식한다`: `"주인공 : \"응\""`, `"수정：“응”"`, `"나 : “응”"` → speakerId 각각 `player`, `sujung`, `player`, text `"응"`
  - `괄호 나레이션은 이름표 없이 괄호를 벗긴다`: `"(수정이로부터 연락이 왔다.)\n\n이수정 : 내일…"` → `[{ speakerId: "narration", speakerName: "", text: "수정이로부터 연락이 왔다." }, { speakerId: "sujung", … }]`
  - `연속 나레이션 여러 줄은 한 줄로 합친다`: data3 1장면 원문 → 길이 1, text에 `"\n"` 포함, 첫 줄 괄호 벗겨짐
  - `^ 로 나뉜 이어지는 대사를 순서대로 만든다`: data.jsx 2장면 "No" subtext → speakerId 순서 `["player","narration","player","narration"]`
  - `본문의 주인공을 닉네임으로 바꾼다`, `닉네임이 비면 주인공으로 둔다`
  - `알 수 없는 화자는 따옴표 본문일 때만 화자로 본다`: `'???: “그녀를 구하고 싶은가?”'` → speakerId `"???"`. `"시간: 세 시"` → narration
  - `빈 문자열은 빈 배열`
- [ ] **Step 2:** 테스트 작성 (`describe("parseChoiceLabel")`): `바깥 따옴표를 벗긴다`, `나 : 접두를 지운다`(`'나 : "저리 가!"'` → `"저리 가!"`), `평문은 그대로`(`"계획을 준비한다"`)
- [ ] **Step 3:** 테스트 작성 (`describe("레거시 데이터 변환")`, `src/utils/data.jsx`~`data5.jsx`의 `storyData` 5개를 `it.each`)
  - `장면 수 = plot 길이, 선택지 수 = options 길이`
  - `모든 장면에 줄 1개 이상, 모든 선택지에 followUp 1개 이상`
  - `어떤 text도 화자 접두나 여는 따옴표로 시작하지 않는다`: `/^(이수정|수정|주인공|나)\s*[:：]/`, `/^[“"‘']/` 불일치
  - `playerName "민수"이면 어떤 text에도 "주인공"이 없다`
  - `게임오버 선택지는 정확히 data/data3/data4/data5의 error 옵션 4개다`(전체 합계 4)
  - `fromIntroStory는 intro.json 12줄을 화자 player·sujung·???로 만든다`
- [ ] **Step 4:** `npx react-scripts test --watchAll=false src/game/dialogueScript.test.js` → FAIL (모듈 없음)
- [ ] **Step 5:** 구현 (200줄 이하)
- [ ] **Step 6:** 같은 명령 → PASS, 게이트 4종 PASS
- [ ] **Step 7:** 커밋 `대사 진행과 선택지 UX 재설계 : feat : 레거시 대사 텍스트를 화자별 줄로 바꾸는 파서 추가 https://github.com/bagle-ggul/Bagel-Frontend/issues/127`

### Task 2: 진행 상태 함수와 본 줄 기록

**Files:**

- Create: `src/game/dialogueFlow.js`, `src/game/seenLines.js`
- Test: `src/game/dialogueFlow.test.js`, `src/game/seenLines.test.js`

**Interfaces:**

- Consumes: Task 1의 `SceneScript[]`
- Produces (`dialogueFlow.js`, 모두 순수):
  - `PHASE = { LINES: "lines", CHOICES: "choices", FOLLOW_UP: "followUp", SCENE_DONE: "sceneDone", ENDED: "ended" }`
  - `createFlowState(script, sceneIndex = 0) => FlowState` (줄이 없으면 `CHOICES`, 선택지도 없으면 `SCENE_DONE`)
  - `advanceFlow(state, script) => FlowState` (`LINES` 마지막 줄 다음 → `CHOICES`(선택지 없으면 `SCENE_DONE`), `FOLLOW_UP` 마지막 줄 다음 → `SCENE_DONE`, 그 밖의 phase는 같은 객체 반환)
  - `chooseFlow(state, script, choiceIndex) => FlowState` (`CHOICES`이고 범위 안일 때만 `FOLLOW_UP`·`lineIndex: 0`·`choiceIndex`. followUp이 비면 `SCENE_DONE`. 아니면 같은 객체)
  - `endFlow(state) => FlowState` (phase `ENDED`)
  - `selectLine(state, script) => Line | null`
  - `selectChoices(state, script) => Choice[]` (`CHOICES`일 때만 배열, 아니면 `[]`)
  - `selectLineKey(state, scopeId) => string | null` (`${scopeId}:${sceneIndex}:${choiceIndex ?? "s"}:${lineIndex}`, 줄이 없는 phase면 `null`)
- Produces (`seenLines.js`, sessionStorage 키 `bagel:game:seenLines`, JSON 배열):

  - `markLineSeen(key: string) => void`, `isLineSeen(key: string) => boolean`, `clearSeenLines() => void`(테스트용)
  - 손상된 JSON은 빈 기록으로 본다. `resetProgress`와 연결하지 않는다(결정 사항)

- [ ] **Step 1:** `dialogueFlow.test.js` (가짜 script: 2줄 + 선택지 2개(followUp 2줄/0줄) 장면 하나, 선택지 없는 장면 하나)
  - `대사를 끝까지 넘기면 선택지 단계가 된다`
  - `선택지 단계에서 advance는 상태를 바꾸지 않는다`(`toBe(state)`)
  - `대사 단계에서 choose는 무시된다`, `범위 밖 선택은 무시된다`
  - `선택하면 이어지는 대사 0번 줄부터 진행한다`
  - `이어지는 대사를 다 넘기면 sceneDone`, `followUp이 비면 선택 즉시 sceneDone`
  - `선택지 없는 장면은 마지막 줄 다음이 sceneDone`
  - `줄이 없는 장면은 선택지로 시작한다`
  - `selectLineKey는 장면·선택·줄 번호로 고유하다`(`"s1:0:s:1"`, `"s1:0:1:0"`), `선택지 단계의 키는 null`
- [ ] **Step 2:** `seenLines.test.js`: `기록한 줄은 본 줄이다`, `기록 안 한 줄은 아니다`, `손상된 저장값이면 false`, `clearSeenLines 후 false`, `resetProgress 뒤에도 남는다`
- [ ] **Step 3:** `npx react-scripts test --watchAll=false src/game/dialogueFlow.test.js src/game/seenLines.test.js` → FAIL
- [ ] **Step 4:** 구현
- [ ] **Step 5:** 같은 명령 → PASS, 게이트 4종 PASS
- [ ] **Step 6:** 커밋 `… : feat : 대사·선택·이어지는 대사 진행 상태 함수와 본 줄 기록 추가 …`

### Task 3: 스테이지 설정과 장면 종료 판정

**Files:**

- Create: `src/game/stages.js`, `src/game/stageProgress.js`
- Test: `src/game/stages.test.js`, `src/game/stageProgress.test.js`

**Interfaces:**

- Consumes: `resolveNextStep`(storyFlow, 무수정), `ROUTES`, `src/utils/data*.jsx`의 `storyData`
- Produces (`stages.js`):
  - `STAGE_CONFIGS: { [stage: 1..5]: { stage, place, storyData, background, music, defaultExit, ambient } }`
    - 1: `"/img/bg_house_main.webp"`, `"/audio/1.m4a"`, `"/main2"`, `"dust"`
    - 2: `bg_cafe_main`, `2.m4a`, `"/main3"`, `"petals"`
    - 3: `bg_cave_main`, `34.m4a`, `"/main5"`, `"rain"`
    - 4: `bg_road_main`, `34.m4a`, `"/main5"`, `"rain"`
    - 5: `bg_beach_main`, `5.m4a`, `null`, `"sparkle"`
    - 값은 기존 `Main1`~`Main5` props와 동일하게 옮긴다(경로는 `/img/` 절대)
  - `NEXT_STAGES = { 1: [2], 2: [3, 4], 3: [5], 4: [5], 5: [] }`
  - `getStageConfig(stage) => config | null`
  - `getPreloadImages(stage) => string[]` (현재 스테이지 장면 그림 전부 + 다음 후보 스테이지의 배경과 첫 장면 그림, 중복 제거)
- Produces (`stageProgress.js`):

  - `resolveAfterScene({ stage, sceneIndex, sceneCount, score, gameOver }) => { type: "navigate", to: string, completed: boolean } | { type: "scene", index: number } | { type: "stageEnd" }`
  - `gameOver` → `{ navigate, to: ROUTES.GAME_OVER, completed: false }`. 그 밖에는 `resolveNextStep` 호출 → `navigate`면 `completed: true`, `index >= sceneCount`면 `stageEnd`

- [ ] **Step 1:** `stages.test.js`
  - `스테이지 1~5 설정이 기존 Main 페이지 값과 같다`(배경·음악·defaultExit 표)
  - `NEXT_STAGES는 stageRules의 stageExit 목적지와 일치한다`(스테이지 2의 `byChoice`·`default` 경로가 `/main4`·`/main3`)
  - `getPreloadImages(2)는 동굴·우산 배경을 포함하고 중복이 없다`
  - `알 수 없는 스테이지는 null`
- [ ] **Step 2:** `stageProgress.test.js`
  - `게임오버 선택은 점수와 무관하게 /over, completed false`
  - `스테이지 2 첫 장면 20점이면 장면 1`(storyFlow 위임)
  - `스테이지 5 장면 2를 마치면 /result, completed true`
  - `스테이지 1 마지막 장면을 마치면 stageEnd`(sceneCount 3)
  - 회귀 표 `선택 경로별 최종 목적지`: `toStageScript` + `resolveAfterScene` + `resolveStageExit`로 가짜 플레이어(선택 인덱스 배열 입력, 점수 누적 헬퍼 15줄)를 돌려 ① 스테이지 1 전부 0번 선택 → `stageEnd`, 점수 25 ② 카페 마지막 장면 0번 → 다음 스테이지 `/main4` ③ 해변 장면 2 종료 → `/result`
- [ ] **Step 3:** 테스트 → FAIL, 구현, → PASS. `src/game/storyFlow.test.js`도 PASS 확인
- [ ] **Step 4:** 게이트 4종 PASS
- [ ] **Step 5:** 커밋 `… : feat : 스테이지 설정 표와 장면 종료 판정 추가 (storyFlow 위임) …`

### Task 4: 입력·타이핑·자동 진행·미리 받기 훅

**Files:**

- Create: `src/hooks/useTypewriter.js`, `src/hooks/useAdvanceKeys.js`, `src/hooks/useAutoPlay.js`, `src/hooks/useImagePreload.js`
- Test: 각 `*.test.js` (`renderHook`, `jest.useFakeTimers()`)

**Interfaces:**

- `TYPING_SPEED_MS = 35`
- `useTypewriter(text: string, { speed = TYPING_SPEED_MS, resetKey }) => { visibleText: string, isDone: boolean, complete: () => void }` (`resetKey`나 `text`가 바뀌면 처음부터, `speed <= 0`이면 즉시 완성, 글자 단위 `setTimeout`)
- `useAdvanceKeys({ enabled: boolean, onAdvance: () => void, onChoose: (index) => void, choiceCount: number }) => void`
  - `window` keydown. Space·`Enter` → `preventDefault` 후 `onAdvance`, `"1"`~`"4"` → `index < choiceCount`일 때 `onChoose(index)`
  - 무시: `enabled === false`, `event.repeat`, `event.target.closest("button, a, input, textarea, [role='dialog']")`
- `AUTO_DELAY_MS = 1600`, `SKIP_INTERVAL_MS = 90`
- `useAutoPlay({ mode: PlayMode, lineKey: string | null, isTypingDone: boolean, isSeen: boolean, onComplete: () => void, onAdvance: () => void, onStop: () => void }) => void`
  - `auto`: `lineKey`가 있고 `isTypingDone`이면 `AUTO_DELAY_MS` 뒤 `onAdvance`
  - `skip`: `lineKey`가 없거나 `!isSeen`이면 즉시 `onStop`, 아니면 `SKIP_INTERVAL_MS` 뒤 `onComplete()` + `onAdvance()`
  - `manual`: 아무것도 안 함. 언마운트·의존값 변경 시 타이머 해제
- `useImagePreload(urls: string[]) => void` (모듈 수준 `Set`으로 같은 주소는 한 번만 `new Image().src = url`)

- [ ] **Step 1:** 테스트 작성
  - useTypewriter: `시간이 지나면 한 글자씩 늘어난다`, `complete는 즉시 전체 문장과 isDone`, `resetKey가 바뀌면 처음부터`, `speed 0이면 즉시 완료`
  - useAdvanceKeys: `Space·Enter는 onAdvance`, `숫자 2는 onChoose(1)`, `choiceCount 밖의 숫자는 무시`, `버튼에 포커스된 Enter는 무시`(target `<button>`), `dialog 안의 키는 무시`, `enabled false면 무시`, `repeat 키는 무시`, `언마운트 후 리스너 제거`
  - useAutoPlay: `auto는 타이핑 완료 뒤 지연 후 진행`, `auto는 타이핑 중이면 기다린다`, `skip은 본 줄이면 완성 후 진행`, `skip은 처음 보는 줄에서 onStop`, `skip은 선택지(lineKey null)에서 onStop`, `manual은 아무것도 하지 않는다`, `줄이 바뀌면 이전 타이머를 지운다`
  - useImagePreload: `global.Image` 모의로 `주소마다 한 번만 src를 건다`, `빈 배열이면 아무것도 하지 않는다`
- [ ] **Step 2:** FAIL 확인 → 구현 → PASS. `npm run test:ci`에서 hooks 커버리지 80% 이상
- [ ] **Step 3:** 게이트 4종 PASS
- [ ] **Step 4:** 커밋 `… : feat : 타이핑·키 입력·자동 진행/건너뛰기·이미지 미리 받기 훅 추가 …`

### Task 5: 대사창·선택지·조작 버튼·로그 모달

**Files:**

- Modify: `src/styles/semantic.js`(의미 토큰 그룹 `effect`, `dialogue` 추가), `src/styles/semantic.test.js`(검사 groups에 `effect`, `dialogue` 추가)
- Create: `src/components/scene/DialogueBox.jsx`, `ChoiceList.jsx`, `PlayerControls.jsx`, `DialogueLogModal.jsx`, `src/components/scene/index.js`
- Test: `src/components/scene/DialogueBox.test.jsx`, `ChoiceList.test.jsx`, `PlayerControls.test.jsx`, `DialogueLogModal.test.jsx`

**Interfaces:**

- 토큰(기존 palette 값만 참조): `dialogue = { box: palette.black70, narration: palette.white80, choice: palette.black60, choiceHover: palette.lilac30 }`, `effect = { rain: palette.white30, dust: palette.white60, petal: palette.lilac50, sparkle: palette.white90, veil: palette.black80 }`
- `DialogueBox({ line: Line, visibleText: string, isDone: boolean })`: 나레이션이 아니면 대사창 위에 `NameTag name={line.speakerName}`, 나레이션이면 이름표 없이 `$narration` 기울임·`dialogue.narration` 색. 본문 `white-space: pre-line`, `aria-live="polite"`. `isDone`이면 작은 진행 표시(깜빡이는 점, `aria-hidden`)
- `ChoiceList({ choices: Choice[], onChoose: (index) => void })`: `role="group"`, `aria-label="선택지"`. 각 항목은 같은 styled `ChoiceCard`(button) + 번호 배지 `1`~`4` + `label`, 순차 등장(stagger). `onClick`에서 `stopPropagation` 후 `onChoose(i)`. `score`·`gameOver`는 **렌더에 쓰지 않는다**
- `PlayerControls({ mode: PlayMode, onModeChange: (mode) => void, canSkip: boolean, showSkip = true, onOpenLog: () => void })`: 오른쪽 위 `Button variant="ghost"` 3개 — `자동`(`aria-pressed`), `건너뛰기`(`aria-pressed`, `!canSkip && mode !== "skip"`이면 `disabled`), `지난 대사`. 같은 모드를 다시 누르면 `manual`. 컨테이너 `onClick`에서 `stopPropagation`
- `DialogueLogModal({ entries: LogEntry[], onClose: () => void })`: 공용 `Modal title="지난 대사"`. 항목은 이름(나레이션이면 생략) + 본문, `choice` 항목은 `"선택 · " + text`에 `text.accent` 색. 비면 `"아직 지난 대사가 없어요."`. 열리면 목록 끝으로 스크롤(`scrollIntoView` 있을 때만)

- [ ] **Step 1:** 테스트 작성
  - DialogueBox: `화자 이름표와 본문을 분리해 보여 준다`(`"이수정"` 텍스트, 본문에 `"이수정 :"` 없음), `나레이션은 이름표가 없다`
  - ChoiceList: `모든 선택지 버튼이 같은 class를 쓴다`(`new Set(buttons.map((b) => b.className)).size === 1`, gameOver·고득점 섞인 입력), `▶·⚠ 문자가 없다`(`container.textContent`), `누르면 onChoose(index)`, `클릭이 부모로 전파되지 않는다`
  - PlayerControls: `자동을 누르면 onModeChange("auto")`, `켜진 자동을 다시 누르면 manual`, `canSkip false면 건너뛰기 비활성`, `showSkip false면 건너뛰기 없음`, `지난 대사를 누르면 onOpenLog`
  - DialogueLogModal: `항목을 순서대로 보여 준다`, `선택 항목은 "선택 ·"으로 표시`, `비면 안내 문구`, `닫기 버튼으로 onClose`
  - semantic.test: groups에 `effect`, `dialogue` 추가
- [ ] **Step 2:** FAIL → 구현 → PASS. 하드코딩 색 규칙 테스트 PASS(새 파일 0개)
- [ ] **Step 3:** 게이트 4종 PASS
- [ ] **Step 4:** 커밋 `… : feat : 이름표 대사창·같은 모양 선택지 카드·조작 버튼·지난 대사 모달 추가 …`

### Task 6: 장면 연출 (배경 전환, 캐릭터 등장, 분위기 효과)

**Files:**

- Create: `src/components/scene/SceneBackdrop.jsx`, `CharacterSprite.jsx`, `AmbientEffect.jsx`, `src/components/scene/ambientParticles.js`(입자 위치 계산, 순수)
- Modify: `src/components/scene/index.js`
- Test: `src/components/scene/AmbientEffect.test.jsx`, `SceneBackdrop.test.jsx`, `CharacterSprite.test.jsx`

**Interfaces:**

- `SceneBackdrop({ src: string, sceneKey: string | number, reduced: boolean, children })`: 전체 화면(`min-height: 100dvh`). `AnimatePresence`로 `src`를 key로 배경을 겹쳐 0.8초 크로스페이드. 위에 `overlay.faint`→`overlay.light` 그라데이션(아래쪽 대사창 가독성). `sceneKey`가 바뀌면 `effect.veil` 막을 0.5초 걷어 장면 전환 표시(`reduced`면 0.2초). 첫 진입은 검은 막에서 페이드 인
- `CharacterSprite({ src: string | null, alt: string, framed = true, reduced: boolean })`: `src`를 key로 `AnimatePresence mode="sync"`. 등장 `y: 24 → 0`, `opacity 0 → 1`(0.5초), 교체는 크로스페이드. 대기 움직임 `y: [0, -4, 0]` 6초 반복(`reduced`면 끔). 크기 `height: min(52dvh, 27rem)`, 모바일 `min(38dvh, 16rem)`. `framed`면 둥근 모서리·그림자(`shadow` 토큰). `src` null이면 렌더하지 않음
- `buildParticles(kind, count) => { left: string, delay: string, duration: string, size: string, drift: string }[]` (인덱스 기반 결정적 의사난수)
- `AmbientEffect({ kind: "rain" | "dust" | "petals" | "sparkle" | "none", reduced: boolean })`: `none`이거나 `reduced`면 `null`. 아니면 `aria-hidden`·`pointer-events: none` 층에 CSS keyframes 입자 — `rain` 48개(사선 낙하, `effect.rain`), `dust` 24개(느린 부유, `effect.dust`), `petals` 18개(회전 낙하, `effect.petal`), `sparkle` 20개(아래 1/3 반짝임, `effect.sparkle`). `@media (max-width: 480px)`에서는 짝수 번째만(절반). `@media (prefers-reduced-motion: reduce) { display: none }` 이중 안전장치. `transform`·`opacity`만 애니메이트

- [ ] **Step 1:** 테스트 작성 (파일 머리에서 `MotionGlobalConfig.skipAnimations = true`)
  - AmbientEffect: `rain은 입자 48개를 그린다`(`data-testid="ambient-particle"`), `none이면 아무것도 그리지 않는다`, `reduced면 아무것도 그리지 않는다`, `효과 층은 aria-hidden이다`
  - buildParticles: `같은 입력이면 같은 결과`
  - CharacterSprite: `src가 바뀌면 새 그림을 alt로 찾을 수 있다`, `src가 null이면 img 없음`
  - SceneBackdrop: `children을 그린다`, `배경 주소를 style로 건다`
- [ ] **Step 2:** FAIL → 구현 → PASS
- [ ] **Step 3:** 게이트 4종 PASS
- [ ] **Step 4:** 커밋 `… : feat : 배경 크로스페이드·캐릭터 등장·장소별 분위기 효과 추가 (줄임 동작 설정 존중) …`

### Task 7: DialoguePlayer 조립과 흐름 훅

**Files:**

- Create: `src/hooks/useDialogueFlow.js`, `src/components/scene/DialoguePlayer.jsx`, `src/components/scene/DialoguePlayer.styled.js`
- Modify: `src/components/scene/index.js`
- Test: `src/hooks/useDialogueFlow.test.js`, `src/components/scene/DialoguePlayer.test.jsx`

**Interfaces:**

- `useDialogueFlow({ script: SceneScript[], scopeId: string, playerName: string, onChoose?: ({ sceneIndex, choiceIndex, choice }) => void, onSceneDone: ({ sceneIndex, choiceIndex, choice }) => ({ type: "scene", index } | { type: "end" } | void) }) => { flow: FlowState, line: Line | null, lineKey: string | null, isLineSeenBefore: boolean, choices: Choice[], sprite: string | null, advance: () => void, choose: (index) => void, log: LogEntry[] }`
  - phase가 `sceneDone`이 되면 effect에서 `onSceneDone`을 한 번만 호출(ref로 중복 방지). 반환이 `scene`이면 `createFlowState(script, index)`, `end`면 `endFlow`, `void`면 호출자가 이동한 것으로 봄
  - `lineKey`가 바뀔 때마다 기록 전 본 줄 여부를 `isLineSeenBefore`로 계산한 뒤 `markLineSeen`, `log`에 추가. `choose`는 `{ speakerId: "choice", speakerName: playerName }` 항목을 남김
  - `sprite = line?.sprite ?? script[sceneIndex]?.sprite ?? null`
- `DialoguePlayer({ script, scopeId, background, ambient = "none", initialMode = "manual", allowSkip = true, playerName, onChoose, onSceneDone, endSlot })`

  - `useReducedMotion()`으로 `reduced`, 전체를 `<MotionConfig reducedMotion="user">`로 감싼다
  - 화면 전체 `onClick` = `requestAdvance`: 로그가 열려 있거나 선택지 단계면 무시. 타이핑 중이면 `typing.complete()`, 아니면 `advance()`. `manual` 외 모드에서 직접 탭하면 `manual`로
  - `useTypewriter(line?.text ?? "", { speed: TYPING_SPEED_MS, resetKey: lineKey })`
  - `useAdvanceKeys({ enabled: !isLogOpen && phase !== "ended", onAdvance: requestAdvance, onChoose: choose, choiceCount })`
  - `useAutoPlay({ mode, lineKey, isTypingDone, isSeen: isLineSeenBefore, … , onStop: () => setMode("manual") })`
  - 렌더 순서: `SceneBackdrop` > `AmbientEffect` > `CharacterSprite` > (phase `choices`면 `ChoiceList`) > `DialogueBox`(선택지 단계에서는 마지막 줄 유지) > `PlayerControls` > (로그 열림이면 `AnimatePresence` 안 `DialogueLogModal`) > (phase `ended`면 `endSlot`)
  - 레이아웃(`DialoguePlayer.styled.js`): 세로 flex, `100dvh`, 대사창 아래 고정(`max-width: 800px`), 선택지 영역은 대사창 위 `max-height: 50dvh; overflow-y: auto`, 모바일 여백 `spacing.sm`

- [ ] **Step 1:** `useDialogueFlow.test.js`: `advance로 줄을 넘긴다`, `선택하면 onChoose 후 followUp`, `sceneDone이면 onSceneDone을 한 번 부르고 반환한 장면으로 이동`, `end를 반환하면 ended`, `줄마다 log에 쌓이고 선택도 기록된다`, `본 줄로 기록한다`
- [ ] **Step 2:** `DialoguePlayer.test.jsx` (`MemoryRouter`·`RecoilRoot`, 가짜 script: 장면 0 = 나레이션 1줄 + sujung 1줄 + 선택지 2개(followUp 각 2줄), `jest.useFakeTimers()`, `clearSeenLines()` beforeEach)
  - `화면을 누르면 타이핑 중인 줄을 즉시 완성한다`
  - `완성된 줄에서 누르면 다음 줄로 간다`
  - `대사가 끝나기 전에는 선택지가 없다`(`queryByRole("group", { name: "선택지" })` null)
  - `대사가 끝나면 같은 모양의 선택지가 나온다`
  - `키보드 2로 두 번째 선택지를 고른다`
  - `이어지는 대사는 버튼이 아니라 대사창에 나온다`(followUp 본문이 `getByRole("button", { name })`으로 안 잡힘)
  - `Space로 이어지는 대사를 넘기고 끝나면 onSceneDone`
  - `자동 진행을 켜면 시간이 지나 다음 줄로 간다`
  - `처음 보는 줄에서는 건너뛰기가 비활성이다`
  - `본 줄은 건너뛰기로 선택지까지 빠르게 넘어가고 멈춘다`(같은 script를 두 번 렌더)
  - `지난 대사 모달에 본 줄과 고른 선택지가 있다`
  - `로그가 열려 있으면 Space가 진행하지 않는다`
  - `ended면 endSlot을 보여 준다`
- [ ] **Step 3:** FAIL → 구현(`DialoguePlayer.jsx` 300줄 이하, 스타일은 `.styled.js`) → PASS
- [ ] **Step 4:** 게이트 4종 PASS
- [ ] **Step 5:** 커밋 `… : feat : 탭 진행·선택 분리·자동/건너뛰기·로그를 조립한 DialoguePlayer 추가 …`

### Task 8: StagePage로 Main1~5 통합, 라우트 코드 분할

**Files:**

- Create: `src/pages/StagePage.jsx`, `src/components/RouteFallback.jsx`
- Modify: `src/Route.jsx`
- Delete: `src/pages/Main1.jsx`~`Main5.jsx`, `src/components/GameUI/BagelSelectPageComponent.jsx`, `BagelDialogBox.jsx`, `BagelChoiceButton.jsx`, `TypewriterText.jsx`(`GameUI/` 폴더 비움)
- Modify: `src/designTokens.baseline.json`(GameUI 4개 항목 삭제)
- Test: `src/pages/StagePage.test.jsx`

**Interfaces:**

- Consumes: `getStageConfig`, `getPreloadImages`, `toStageScript`, `resolveAfterScene`, `resolveStageExit`, `markStageReached`, `markGameCompleted`, `scoreAtom`, `characterNameAtom`, `useBackgroundMusic`, `useImagePreload`, `DialoguePlayer`, `Button`
- Produces: `StagePage({ stage: 1..5 })` (default export)
  - mount 시 `markStageReached(stage)`. `characterName`이 비어 있으면 `axios.get("/api/my-page")`로 채움(실패는 `logger.error`만)
  - `script = useMemo(() => toStageScript(config.storyData, { playerName }), [config, playerName])`
  - `scoreRef`를 recoil 점수로 초기화. `onChoose`: gameOver가 아니면 `scoreRef.current += choice.score`·`setScore(scoreRef.current)`, 매 선택마다 `exitRef.current = resolveStageExit(stage, choiceIndex, config.defaultExit)`(기존 `setBase`와 동일)
  - `onSceneDone`: `resolveAfterScene({ stage, sceneIndex, sceneCount: script.length, score: scoreRef.current, gameOver: choice?.gameOver })` → `navigate`면 `completed`일 때 `markGameCompleted()` 후 `navigate(to)`, `scene`이면 그대로 반환, `stageEnd`면 `{ type: "end" }`
  - `endSlot`: `<Button as={Link} to={exitRef.current} size="lg">다음 장소로</Button>`(가운데, 등장 페이드). `defaultExit`가 null인데 도달하면 `ROUTES.RESULT`(방어)
  - `<audio ref={audioRef} src={config.music} loop />`, `useImagePreload(getPreloadImages(stage))`
- `RouteFallback()`: `surface.strong` 전체 화면 `aria-busy="true"`
- `Route.jsx`: `const StagePage = lazy(() => import("./pages/StagePage"))`, `Intro`·`Result`·`Happy`·`Middle`·`Sad`·`Hidden`·`GameOver`도 lazy. `withSuspense(element)` 헬퍼로 `<Suspense fallback={<RouteFallback />}>`. `{ path: "main1", element: stageGuarded(withSuspense(<StagePage key={1} stage={1} />), 1) }` … main5. **`key` 필수**

- [ ] **Step 1:** `StagePage.test.jsx` (`jest.mock("../utils/axios")`, `MemoryRouter initialEntries={["/main1"]}` + `Routes`, `RecoilRoot`, `HTMLMediaElement.prototype.play` 모의)
  - `스테이지 1 첫 줄을 나레이션으로 보여 준다`(`"수정이로부터 연락이 왔다."`)
  - `진입하면 진행도를 기록한다`(`getMaxStage() >= 1`)
  - `닉네임이 비어 있으면 프로필을 조회해 이름표에 쓴다`(axios.get resolve `{ data: { characterName: "민수" } }` 후 선택 → followUp 이름표 `"민수"`)
  - `선택하면 점수가 즉시 반영된다`(sessionStorage 점수 10)
  - `게임오버 선택은 이어지는 대사 뒤 /over로 간다`(스테이지 1 장면 1 "No")
  - `스테이지를 마치면 다음 장소로 버튼이 기본 목적지를 가리킨다`(`href="/main2"`)
- [ ] **Step 2:** FAIL → 구현 → PASS
- [ ] **Step 3:** `Route.jsx` 수정, Main1~5와 GameUI 4개 파일 삭제. `grep -rn "Main[1-5]\|GameUI\|BagelSelect" src` → 0
- [ ] **Step 4:** 기준치 JSON에서 GameUI 4개 항목 삭제. `npx react-scripts test --watchAll=false src/designTokens.rules.test.js src/imageAssets.rules.test.js src/game` → PASS(storyFlow 37개 포함)
- [ ] **Step 5:** 게이트 4종 PASS. `build/static/js`에 StagePage 청크 분리 확인(`ls build/static/js | wc -l` 증가)
- [ ] **Step 6:** 커밋 `… : refactor : Main1~5를 데이터 기반 StagePage로 통합하고 게임 화면을 지연 로드 …`

### Task 9: 인트로를 DialoguePlayer로 교체

**Files:**

- Modify: `src/pages/Intro.jsx`(다시 쓰기)
- Delete: `src/components/DialogueSystem.jsx`
- Modify: `src/designTokens.baseline.json`(`DialogueSystem.jsx`, `Intro.jsx` 항목 삭제)
- Modify: `src/imageAssets.rules.test.js`(예외 목록 설명 주석만 "intro.json의 avatar는 화면에서 쓰지 않음"으로. 목록은 유지)
- Test: `src/pages/Intro.test.jsx`

**Interfaces:**

- Consumes: `fromIntroStory`, `DialoguePlayer`, `Button`, `resetProgress`, `scoreAtom`, `characterNameAtom`
- Produces: `Intro()`

  - `/api/my-page`로 이름 조회해 `characterNameAtom`에(기존 유지). `script = fromIntroStory(introStory.story, { playerName })`
  - `<DialoguePlayer scopeId="intro" background="/img/bg_intro_main.webp" ambient="none" initialMode="auto" allowSkip={false} onSceneDone={() => { startNewGame(); }} />`
  - `startNewGame` = 기존과 같음: `resetProgress()`, `setScore(0)`, `navigate(ROUTES.MAIN1)`
  - 왼쪽 위 `<Button variant="ghost">인트로 건너뛰기</Button>`(`stopPropagation` 후 `startNewGame`, 오른쪽 위 조작 버튼과 겹치지 않게). `<audio src="/audio/intro.m4a" loop>`는 `useBackgroundMusic`으로

- [ ] **Step 1:** 테스트: `첫 줄의 화자 이름표를 닉네임으로 보여 준다`, `인트로 건너뛰기는 진행도를 초기화하고 /main1로 간다`, `마지막 줄을 넘기면 /main1로 간다`, `건너뛰기(세션) 버튼은 없다`
- [ ] **Step 2:** FAIL → 구현, `DialogueSystem.jsx` 삭제(`grep -rn DialogueSystem src` → 0), 기준치 갱신 → PASS
- [ ] **Step 3:** 게이트 4종 PASS. 기준치 JSON에는 `index.jsx`, `Happy`, `Hidden`, `Middle`, `Result`, `Sad`만 남음
- [ ] **Step 4:** 커밋 `… : refactor : 인트로를 공용 DialoguePlayer로 교체하고 DialogueSystem 제거 …`

### Task 10: 문서 갱신과 실제 화면 점검 (컨트롤러 수행)

**Files:**

- Modify: `docs/GAME-FLOW.md`(스테이지 표의 페이지를 `StagePage` + `src/game/stages.js`로, 인트로 형식, 게임오버 시 이어지는 대사를 보여 준다는 변경)
- Modify: `docs/ARCHITECTURE.md`(`GameUI/` → `components/scene/`, 라우트 표, `characterNameAtom` 조회 위치, lazy 라우트)
- Modify: `docs/DESIGN-SYSTEM.md`(진행 현황의 게임 플레이 행 완료, `dialogue`·`effect` 토큰, 장면 컴포넌트 목록, 줄임 동작 규칙)

- [ ] **Step 1:** 문서 갱신 후 `npm run format:check` PASS
- [ ] **Step 2 (컨트롤러, 실제 브라우저):** `npm start` 후 데스크톱·태블릿 768×1024·모바일 390×844에서 캡처·점검
  1. 인트로: 자동 진행, 이름표(닉네임·`???`), `인트로 건너뛰기`
  2. 스테이지 1 집: 첫 줄 나레이션(기울임, 이름표 없음), `dust` 효과, 캐릭터 등장 슬라이드, 장면 전환 막
  3. 탭·Space·Enter 진행, 타이핑 중 탭은 즉시 완성
  4. 선택지: 대사 뒤에만, 모두 같은 카드, ▶·⚠·금색·빨강 없음, 키보드 1~4
  5. 이어지는 대사가 대사창에서 탭으로 넘어감(카드 아님)
  6. 게임오버 선택(스테이지 1 알람 "No"): 이어지는 대사 4줄 뒤 `/over`
  7. 재도전 후 스테이지 1에서 `건너뛰기`가 본 줄만 넘기고 선택지에서 멈춤
  8. `자동` 켜기/끄기, 직접 탭하면 수동 복귀
  9. `지난 대사` 모달: 본 줄과 `선택 ·` 항목, Esc·바깥 클릭·닫기, 열린 동안 Space 무시
  10. 카페 `petals`, 돈 줍기 0번 → `/main4` `rain`, 다른 선택 → `/main3` 동굴 `rain`
  11. 해변 `sparkle`, 마지막 → `/result`
  12. 각 스테이지 끝 `다음 장소로` 버튼
  13. 모바일에서 선택지 3개 이상 + 대사창 + 조작 버튼이 잘리거나 겹치지 않음
  14. `prefers-reduced-motion: reduce`면 효과·대기 움직임 없음, 페이드만
  15. 다음 스테이지 배경 미리 받기, StagePage 청크 지연 로드, 콘솔 오류 0
  16. `/main3` 새로고침 시(가드 통과) 이름표에 닉네임(조회)
- [ ] **Step 3:** 발견한 문제는 해당 태스크 범위에서 고치고 게이트 4종 PASS
- [ ] **Step 4:** 커밋 `… : docs : 장면 플레이어 구조와 게임 흐름 문서 갱신, 화면 점검 기록 …`
