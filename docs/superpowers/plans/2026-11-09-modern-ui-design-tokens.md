# 모던 UI와 디자인 토큰 정립 (#130) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 화면 코드의 하드코딩 색을 의미 토큰으로 옮기고, 공용 UI 컴포넌트(버튼, 카드, 모달, 이름표)를 만들어 홈·랭킹·프로필·보조 화면이 이것만 조합하게 한다.

**Architecture:** 원시 토큰(`src/styles/tokens.js`) → 의미 토큰(`src/styles/semantic.js`) → 공용 컴포넌트(`src/components/ui/`) → 화면. 하드코딩 색은 파일별 기준치 JSON으로 고정하고 규칙 테스트가 "줄이기만" 허용한다.

**Tech Stack:** React 18, styled-components 6, framer-motion 11, Jest + React Testing Library (CRA)

**Spec:** `docs/superpowers/specs/2026-11-09-game-experience-redesign-design.md` 6절

## Global Constraints

- 표지(홈 배경 `bg_home_v4.webp`, 홈 캐릭터 `her_home_v1*.webp`)는 바꾸지 않는다
- 게스트 시작, 랭킹, 프로필의 동작과 API 호출은 바꾸지 않는다 (스타일·구조만)
- 컴포넌트는 `semantic.js` 의미 토큰만 참조한다. `palette`·`rgba(`·`#hex`를 화면/컴포넌트 코드에 쓰지 않는다
- 게임 플레이 UI(`src/components/GameUI/*`, `DialogueSystem.jsx`, `Intro.jsx`)와 엔딩 4종(`Happy`, `Middle`, `Sad`, `Hidden`)은 #127, #128에서 새로 만들므로 이 계획에서 수정하지 않는다 (기준치로만 고정)
- 품질 게이트 4종(`format:check`, `lint`, `test:ci`, `CI=false npm run build`) 통과
- 새 파일 300줄 이하, 수정한 `.styled.js`는 500줄 이하로 분리
- 커밋은 `/pro-commit`, 이슈 #130, 브랜치 `20261109_#130_...`

## Review Focus

1. 모바일 390×844에서 홈 메뉴·모달·랭킹 카드가 잘리거나 겹치지 않는다 → Task 7 캡처 점검
2. 모달은 Esc, 바깥 클릭, 닫기 버튼 셋 다로 닫히고 포커스가 모달 안에서 시작한다 → Task 3 테스트
3. 링크형 버튼(`as={Link}`)과 버튼형이 같은 모양이고 키보드 포커스가 보인다 → Task 3 테스트(`:focus-visible` 스타일 존재)
4. 토큰 치환 뒤 투명도가 바뀌어 대비가 떨어지는 곳이 없다 → Task 4~6에서 값 동일 매핑만 허용(표 1)
5. 기준치 JSON이 늘어나는 커밋은 테스트가 막는다 → Task 2 테스트

---

## 표 1: 반복 값 → 토큰 매핑 (값 동일, 치환 기준)

| 하드코딩 값                       | 원시 토큰 (추가 여부)                            | 의미 토큰 (용도)                                                            |
| --------------------------------- | ------------------------------------------------ | --------------------------------------------------------------------------- |
| `rgba(255,255,255,0.1)`           | `white10`                                        | `surface.raised`                                                            |
| `rgba(255,255,255,0.15)`          | `white15`                                        | `border.subtle` / `action.secondary`                                        |
| `rgba(255,255,255,0.2)`           | `white20` (추가)                                 | `border.default` (추가)                                                     |
| `rgba(255,255,255,0.3)`           | `white30`                                        | `border.strong` (추가)                                                      |
| `rgba(255,255,255,0.7)`           | `white70`                                        | `text.secondary`                                                            |
| `rgba(255,255,255,0.8)` / `0.9`   | `white80`, `white90` (추가)                      | `text.muted` / `text.emphasis` (추가)                                       |
| `rgba(0,0,0,0.2)` / `0.3`         | `black20` (추가), `black30`                      | `shadow`용 → `overlay.faint` / `overlay.light` (추가)                       |
| `rgba(0,0,0,0.4)` / `0.5`         | `black40`, `black50`                             | `surface.glass` / `surface.glassHover`                                      |
| `rgba(0,0,0,0.6)` / `0.7` / `0.8` | `black60`, `black70`(추가), `black80`(추가)      | `overlay.modal` (0.7), `surface.strong` (0.8) (추가)                        |
| `rgba(200,182,226,0.2)`~`0.5`     | `lilac20`, `lilac30`, `lilac40`(추가), `lilac50` | `border.accent`(0.3), `action.secondaryHover`(0.3), `focus.ring`(0.4, 추가) |
| `rgba(200,182,226,0.8)`~`1`       | `lilac80`(추가), `lilac90`, `lilac100`           | `action.primary`(0.9), `text.accent`(0.9), `action.primaryHover`(1)         |

표에 없는 일회성 값은 가장 가까운 의미 토큰으로 옮기되, 시각 차이가 생기면 새 의미 토큰을 추가하고 이유를 한 줄 주석으로 남긴다.

---

### Task 1: 토큰 보강

**Files:**

- Modify: `src/styles/tokens.js` (palette에 표 1의 "추가" 값)
- Modify: `src/styles/semantic.js` (`border.default`, `border.strong`, `text.muted`, `text.emphasis`, `overlay.{faint,light,modal}`, `surface.strong`, `focus.ring` 추가)
- Test: `src/styles/semantic.test.js`

**Interfaces:**

- Produces: `semantic.js`의 `surface`, `text`, `border`, `action`, `feedback`, `overlay`, `focus` (모든 값은 `palette` 참조, 문자열)

- [ ] **Step 1:** `semantic.test.js` 작성 — "모든 의미 토큰 값은 palette 값 중 하나다", "overlay.modal은 rgba(0, 0, 0, 0.7)이다"
- [ ] **Step 2:** `npx react-scripts test --watchAll=false src/styles/semantic.test.js` → FAIL (overlay 없음)
- [ ] **Step 3:** 토큰 추가
- [ ] **Step 4:** 같은 명령 → PASS
- [ ] **Step 5:** 커밋

### Task 2: 하드코딩 색 규칙 테스트 (줄이기만 허용)

**Files:**

- Create: `src/designTokens.rules.test.js`
- Create: `src/designTokens.baseline.json` (파일 경로 → 현재 개수, 지금 293개/22파일)

**Interfaces:**

- Produces: 기준치 JSON 형식 `{ "src/pages/Home.styled.js": 76, ... }`

- [ ] **Step 1:** 테스트 작성. 스캔 대상 `src/**/*.{js,jsx}`(테스트·`src/styles/` 제외), 패턴 `rgba?\(` 와 `#[0-9a-fA-F]{3,8}\b`(단 `#\d{1,3}` 이슈 번호 제외). 단언:
  - `기준치에 없는 파일은 하드코딩 색 0개`
  - `기준치에 있는 파일은 개수가 기준치 이하`
  - `기준치보다 줄어든 파일이 있으면 기준치를 갱신하라는 실패 메시지` (기준치가 실제보다 크면 실패 → 줄인 뒤 JSON도 함께 낮추게 강제)
- [ ] **Step 2:** 현재 개수로 기준치 JSON 생성 → 테스트 PASS 확인
- [ ] **Step 3:** 임시로 `Home.jsx`에 `rgba(1,1,1,1)` 추가 → FAIL 확인 → 원복
- [ ] **Step 4:** 커밋

### Task 3: 공용 UI 컴포넌트

**Files:**

- Create: `src/components/ui/Button.jsx` — `Button({ variant = "primary" | "secondary" | "ghost", size = "md" | "lg", as, ...rest })`, `as={Link}` 지원, `:focus-visible`에 `focus.ring`
- Create: `src/components/ui/Card.jsx` — `Card({ as, padding = "md" | "lg", ...rest })` 글래스 표면
- Create: `src/components/ui/Modal.jsx` — `Modal({ title, onClose, children, maxWidth })`: 오버레이(`overlay.modal`), `role="dialog"`, `aria-modal`, `aria-labelledby`, Esc·바깥 클릭·닫기 버튼으로 닫힘, 열릴 때 대화상자에 포커스
- Create: `src/components/ui/NameTag.jsx` — `NameTag({ name })` (#127 대사창이 사용)
- Create: `src/components/ui/index.js` (재수출)
- Test: `src/components/ui/Button.test.jsx`, `Modal.test.jsx`

**Interfaces:**

- Produces: `import { Button, Card, Modal, NameTag } from "../components/ui"`

- [ ] **Step 1:** 테스트 작성 — Button: `variant별로 렌더`, `as={Link}이면 a 태그`, `disabled면 클릭 무시`. Modal: `Esc로 onClose`, `오버레이 클릭으로 onClose`, `내용 클릭은 닫지 않음`, `닫기 버튼 aria-label`, `열리면 dialog에 포커스`
- [ ] **Step 2:** 테스트 실행 → FAIL
- [ ] **Step 3:** 구현 (토큰만 사용, framer-motion 등장/퇴장)
- [ ] **Step 4:** 테스트 → PASS, 규칙 테스트 PASS (새 파일 하드코딩 0)
- [ ] **Step 5:** 커밋

### Task 4: 홈 화면 이관

**Files:**

- Modify: `src/pages/Home.styled.js` (76개 → 0, 810줄 → 500줄 이하로 분리: 레이아웃 / 메뉴 버튼 / 모달 계열)
- Modify: `src/pages/Home/HomeMenu.jsx`, `GuestStartModal.jsx`, `GuestStartModal.styled.js`, `CreditsModal.jsx` — 버튼은 `Button`, 모달은 `Modal` 사용
- Modify: `src/designTokens.baseline.json` (Home.styled.js 항목 제거)

**Interfaces:**

- Consumes: Task 1 토큰, Task 3 `Button`, `Modal`

- [ ] **Step 1:** 표 1 기준으로 값 치환, 중복 버튼·모달 스타일 삭제 후 공용 컴포넌트로 교체
- [ ] **Step 2:** 게이트 4종 + 기존 `useGuestStartForm` 테스트 PASS
- [ ] **Step 3:** 개발 서버에서 홈, 시작 모달, 크레딧 모달을 데스크톱·모바일로 캡처해 이전 캡처(`docs/projectops/launch/20261108_001_guest_start_ux_check`)와 비교 — 레이아웃 동일, 버튼·모달 모양만 통일
- [ ] **Step 4:** 커밋

### Task 5: 랭킹 화면 이관

**Files:**

- Modify: `src/pages/Board.styled.js` (68개 → 0, 552줄 → 500줄 이하), `src/pages/Board.jsx` (인라인 스타일 16개 → styled 또는 공용 컴포넌트), `src/pages/Board/BoardEmptyState.jsx` (`Button` 사용)
- Modify: `src/designTokens.baseline.json`

- [ ] **Step 1:** 치환과 공용 컴포넌트 교체 (상단 홈/내정보/다시하기 버튼 → `Button variant="ghost"`, 상세 모달 → `Modal`)
- [ ] **Step 2:** 게이트 4종 PASS
- [ ] **Step 3:** 랭킹 빈 상태·목록 상태를 데스크톱·모바일 캡처로 확인
- [ ] **Step 4:** 커밋

### Task 6: 프로필과 보조 화면 이관

**Files:**

- Modify: `src/pages/Profile.jsx`(20), `src/components/ProfileContent.jsx`(5), `StatsContent.jsx`(2), `DetailRow.styled.js`(2), `GlassCard.jsx` → `Card`로 대체 후 삭제, `src/components/ImageGallery.jsx`(33, 616줄 → 300줄 이하로 분리), `src/pages/GameOver.jsx`(13), `NotFound.jsx`(1), `Help.jsx`(1)
- Modify: `src/designTokens.baseline.json`

- [ ] **Step 1:** 치환, `GlassCard` 사용처를 `Card`로 교체(파일 삭제는 사용처 0 확인 후)
- [ ] **Step 2:** `ImageGallery.jsx`를 목록 / 뷰어 / 스타일로 분리
- [ ] **Step 3:** 게이트 4종 PASS
- [ ] **Step 4:** 프로필, 갤러리, 게임오버, 404를 데스크톱·모바일 캡처로 확인
- [ ] **Step 5:** 커밋

### Task 7: 3해상도 점검과 문서

**Files:**

- Modify: `docs/DESIGN-SYSTEM.md` (진행 현황 표, 공용 컴포넌트 목록, 규칙 테스트 설명)

- [ ] **Step 1:** 데스크톱 1440×900, 태블릿 768×1024, 모바일 390×844에서 홈·시작 모달·크레딧·갤러리·랭킹(빈/목록)·프로필·게임오버·404 캡처, 잘림·겹침 없음 확인 (`/pro-launch`)
- [ ] **Step 2:** 기준치 JSON 합계가 293 → 게임 UI·엔딩 몫(약 60개)만 남았는지 확인
- [ ] **Step 3:** 문서 갱신, 게이트 4종 PASS
- [ ] **Step 4:** 커밋, 푸시, PR (배포는 #127과 함께 판단)
