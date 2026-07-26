# 코드베이스 전면 표준화 설계

- **작성일**: 2026-07-27
- **대상**: Bagel-Frontend (v1.4.3)
- **상태**: 승인됨

---

## 1. 배경

이 프로젝트는 전면 리팩토링이 시도되었다가 중단된 상태다. 새 구조를 만들어 두고 기존
코드를 옮기지 않아, 신구 구현이 병존하며 **어느 쪽이 정답인지 코드만 봐서는 판단할 수
없는** 상태가 되었다.

### 1.1 중단 지점 — 신구 병존 현황

| 항목 | 새로 만든 것 | 실제 상태 |
|---|---|---|
| 인증 유틸 | `src/utils/auth.js` (127줄, 완성) | **1개 파일만 사용**. 나머지 9개 파일이 `localStorage` 직접 접근 (16곳) |
| 라우트 가드 | `src/components/RequireAuth.jsx` | **참조 0회**. `Route.jsx`에 인라인 `ProtectedRoute`가 중복 구현 |
| 게임 UI | `src/components/GameUI/BagelSelectPageComponent.jsx` | 신규 사용 중. 구버전 `SelectPageComponent.jsx`(253줄) 방치 |
| 스토리 데이터 | `src/data/stories/intro.json` (스키마·캐릭터·연출 정의) | Intro만 사용. Main1~5는 여전히 `utils/data.jsx`~`data5.jsx` |
| 테마 | `src/styles/theme.js` (194줄) | **4개 파일만 import**. 나머지는 rgba 하드코딩 |
| 로거 | `auth.js`의 `logger` | 미사용. `console.*` 27곳 |

### 1.2 확인된 결함

**치명적**

1. **`src/utils/axios.jsx` 파일 인코딩 손상** — BOM + 잘못된 인코딩으로 한글 주석이 전부
   모지바케(`// API 0� $`). 파일 자체가 정상적으로 읽히지 않는 상태.
2. **axios 요청 인터셉터가 죽어 있음** — 인터셉터는 `localStorage.getItem('authToken')`을
   읽는데, `authToken` 키는 프로젝트 어디에서도 저장되지 않는다. 실제 저장 키는
   `refreshToken`. 결과적으로 인터셉터는 항상 토큰 없이 통과하고, 모든 호출부가
   `Authorization: Bearer ${refreshToken}` 헤더를 수동으로 다시 붙이고 있다.
3. **401 응답 시 `/login`으로 리다이렉트** — 그런 라우트가 존재하지 않는다. 로그인은
   Home의 모달로 처리된다. 토큰 만료 시 존재하지 않는 경로로 이동한다.

**구조적 모순**

4. **컴포넌트가 스토리 구조를 하드코딩으로 알고 있음** — `BagelSelectPageComponent`의
   `onSubClicked()`에 씬 전이 규칙이 `scene`/`index` 숫자 조건문 약 60줄로 박혀 있다.
   씬을 추가하려면 데이터가 아니라 컴포넌트를 수정해야 한다. 데이터/로직 분리 붕괴.

   ```js
   } else if (scene === 3) {
     if (index === 1) {
       if (score >= 60) setIndex(2);
       else if (score >= 20 && score < 60) setIndex(3);
       else setIndex(4);
     } else if (index === 2 || index === 3 || index === 4) setIndex(5);
     else setIndex((prev) => prev + 1);
   }
   ```

5. **우연히 동작하는 분기** — `onClicked()`의 다음 코드는 씬 인덱스를 구분하지 않고
   **scene 2의 모든 씬**의 선택지 인덱스에 반응한다.

   ```js
   if (scene === 2) {
     if (i === 0) setBase("/main4");
     else setBase("/main3");
   }
   ```

   씬1에서 "카페 라떼"(i=0)를 골라도 `base`가 `/main4`가 된다. 분기 판단의 근거가 되어야
   할 "돈 줍기" 씬이 scene 2의 마지막 씬이라 **마지막 선택이 이겨서** 결과적으로만 올바르게
   동작한다. 중간에 씬을 추가하거나 순서를 바꾸면 즉시 깨진다.

6. **데이터와 로직 불일치** — `data4.jsx`의 4번째 씬에 조건 필드 `love: 60`이 선언되어
   있으나 컴포넌트는 이 필드를 읽지 않고 `score >= 70`으로 하드코딩한다. `love` 필드는
   읽히지 않는 죽은 값이며, 실제 임계치(70)와 선언값(60)이 다르다.

7. **거짓 prop** — `Main5.jsx`의 `url={"/happy"}`는 절대 사용되지 않는다. scene 5는
   `navigate("/result")`로 탈출하기 때문이다. 코드를 읽는 사람에게 잘못된 정보를 준다.

8. **변수명이 실제 값과 다름** — `const accessToken = localStorage.getItem("refreshToken")`
   패턴이 4곳(`useRankingData.js`, `MyGameResult.jsx`, `Intro.jsx`, 외).

**게임 진행 정합성**

9. **점수 영속화 없음** — `scoreAtom`이 Recoil 메모리에만 존재. 게임 도중 새로고침하면
   점수가 0으로 초기화된다.
10. **진행도 가드 없음** — `/main5`, `/happy` 등 URL 직접 입력으로 진입 가능. 스토리를
    건너뛰고 엔딩에 도달할 수 있다.
11. **`errorElement` 없음** — 존재하지 않는 URL 접근 시 빈 흰 화면.
12. **`ProtectedRoute`가 토큰 존재 여부만 확인** — 만료·유효성 검증이 없어 만료된 토큰으로
    진입한 뒤 API 401을 맞는다.
13. **`/ranking` → `/board` 레거시 리다이렉트** 잔재.

**툴링**

14. **`npm run lint` 스크립트가 없어 CI의 린트 단계가 항상 스킵된다.** CI는 스크립트
    존재 여부를 확인하고 없으면 "건너뛰기"를 출력한다.
15. **테스트 파일 0개인데 CI는 테스트를 실행하고 `continue-on-error: true`로 실패를
    무시한다.** 품질 게이트가 사실상 없다.
16. Prettier·EditorConfig 없음. API URL 하드코딩, `.env` 없음.

**구조**

17. `Home.jsx` **2193줄** — styled 정의 1130줄 + 컴포넌트 본문 1050줄. 로그인·회원가입·
    MBTI 폼·성별 선택·생년월일·크레딧 모달·음악 컨트롤·갤러리 진입이 한 파일에 있다.
18. `Board.jsx` 1043줄, `ImageGallery.jsx` 611줄, `Profile.jsx` 513줄.
19. 인라인 `style={{}}` 36곳이 styled-components와 혼용.
20. `Main1~5` 오디오 재생 보일러플레이트 5회 중복. Main1만 `characterName`을 fetch하는
    비대칭 구조.

**문서**

21. `docs/` 디렉토리 부재. 문서가 `README.md` + `claude.md`(소문자) +
    `agent-prompts/result/`(보고서 8개) + `.cursor/commands/`(14개)로 산재.
22. **`claude.md`가 실제 코드와 불일치** — `/login`, `/signup` 페이지가 있다고 기술되어
    있으나 해당 라우트는 존재하지 않는다(Home 모달로 처리). 구조도에 `pages/`, `hooks/`,
    `atom/`, `data/`가 누락되어 있다.
23. README에 "전체적인 코드 리팩토링 진행 예정"이 향후 계획으로 남아 있다.

### 1.3 정정 사항 (조사 과정에서 바로잡은 오판)

초기 조사에서 "Main4가 도달 불가능한 데드 페이지"라고 판단했으나 **오류였다.**
`BagelSelectPageComponent.jsx:171-177`에 분기가 구현되어 있고, `url` prop은 기본값일 뿐
런타임에 `setBase()`로 덮어쓰인다. 실제 게임 흐름은 다음과 같다.

```
Main1(집) → Main2(카페) ─┬─ "돈을 줍는다"        → Main4(우산: 산 우산으로 비를 피함) ─┐
                          └─ "카운터에"/"그냥 간다" → Main3(동굴: 우산 없이 동굴로 대피) ─┴→ Main5(해변) → /result
```

`data3`(Cave)와 `data4`(Umbrella)는 **둘 다 "갑자기 비가 온다"로 시작해 "해변으로 이동"으로
끝나는 대안 씬**이며, `data4`의 도입부 "얻은 돈으로 편의점에서 우산을 사올 수 있었다"가
Main2의 돈 줍기 선택과 정확히 연결된다. **의도된 분기이며 정상 동작한다. Main4와
`data4.jsx`는 유지한다.**

---

## 2. 목표와 비목표

### 2.1 목표

1. 코드 품질 기준을 **문서가 아니라 도구로 강제**한다.
2. 신구 병존을 해소해 각 관심사마다 **정답이 하나만** 존재하게 한다.
3. 구조적 모순(데이터/로직 결합, 우연히 동작하는 분기)을 제거한다.
4. 게임 진행 정합성을 확보한다(점수 영속화, 진행도 가드).
5. 전 화면을 3해상도에서 검증하고 시각적 결함을 수정한다.
6. 문서를 실제 코드와 일치시키고, 이후 어긋나지 않을 구조로 만든다.

### 2.2 비목표

- 게임 스토리·엔딩 내용 자체의 변경 (분기 구조는 유지, 표현 방식만 데이터화)
- 백엔드 API 스펙 변경
- TypeScript 도입 (별도 과제로 분리)
- CRA → Vite 마이그레이션 (별도 과제로 분리)
- 신규 기능 추가

---

## 3. 설계 원칙

> **기준을 먼저 세우고 → 기준으로 코드를 자동 판정 → 판정 결과를 순서대로 갚는다**

지금 상태가 어지러운 근본 원인은 "좋은 코드"의 기준이 **문서에만 있고 강제되지 않는다**는
점이다. `claude.md`에 "console.log 금지"라고 적혀 있으나 27곳이 존재하고, "theme.js를
사용하라"고 적혀 있으나 4곳만 사용한다.

따라서 **Phase 0에서 ESLint 룰을 먼저 켠다.** 룰을 켜면 린트 에러 목록이 그대로 Phase
1~4의 작업 목록이 되고, "이것도 고칠까요"를 묻지 않아도 된다. 또한 Phase 1~4에서 새로
작성하는 코드가 처음부터 새 기준을 따르게 된다. 나중에 켜면 새로 작성한 코드까지 두 번
고쳐야 한다.

---

## 4. Phase 상세

각 Phase는 **1 이슈 = 1 브랜치 = 1 PR**에 대응한다.

### Phase 0 — 코드 품질 체계 및 문서 구조 확립

**목적**: 이후 모든 Phase의 판정 기준을 만든다.

#### 4.0.1 린트·포맷 설정

`package.json`의 `eslintConfig`를 `.eslintrc.json`으로 분리하고 다음 룰을 추가한다.

| 규칙 | 설정 | 막는 것 |
|---|---|---|
| `no-console` | `error` (단, `logger` 정의부 예외) | `console.*` → `logger` 강제 |
| `no-restricted-properties` | `localStorage.getItem/setItem/removeItem` 금지 | 토큰 직접 접근 → `auth.js` 강제. `src/utils/auth.js`만 `overrides`로 예외 |
| `no-restricted-imports` | `axios` 패키지 직접 import 금지 | `src/utils/axios` 인스턴스 강제. `src/utils/axios.js`만 예외 |
| `react-hooks/exhaustive-deps` | `warn` → `error` | 의존성 배열 누락 |
| `no-unused-vars` | `error` | 데드코드 재발 방지 |
| `import/order` | 그룹 순서 + 개행 강제 | import 정렬 통일 |

Prettier(`.prettierrc`)와 EditorConfig(`.editorconfig`)를 추가한다. 설정값:

```
printWidth: 100, tabWidth: 2, semi: true, singleQuote: false,
trailingComma: "es5", endOfLine: "lf", charset: utf-8
```

`endOfLine`/`charset` 고정은 `axios.jsx` 인코딩 손상 같은 사고의 재발을 막는다.

#### 4.0.2 npm 스크립트

```json
"lint":        "eslint src --ext .js,.jsx --max-warnings=0",
"lint:fix":    "eslint src --ext .js,.jsx --fix",
"format":      "prettier --write \"src/**/*.{js,jsx,json,css}\"",
"format:check":"prettier --check \"src/**/*.{js,jsx,json,css}\"",
"test:ci":     "CI=true react-scripts test --coverage --watchAll=false"
```

#### 4.0.3 테스트 3계층 체계

| 계층 | 대상 | 도구 | 기준 |
|---|---|---|---|
| **유닛** | `src/utils/`, `src/hooks/` 순수 로직 | Jest | 커버리지 **80% 강제** |
| **컴포넌트** | 상호작용(선택지 클릭 → 점수 반영, 폼 검증, 모달 개폐) | RTL | 핵심 컴포넌트 필수 |
| **스모크** | 전 페이지 크래시 없이 렌더 + 라우트 가드 동작 | RTL + MemoryRouter | 전 라우트 필수 |

- **파일 위치**: co-located (`auth.js` 옆에 `auth.test.js`). CRA 기본 규약을 따른다.
- **커버리지 임계치는 `src/utils/`와 `src/hooks/`에만 적용한다.** 전역에 80%를 걸면
  첫날부터 CI가 실패해 아무도 지키지 않게 된다. 범위는 Phase가 진행되며 확대한다.

`package.json`의 `jest.coverageThreshold` 설정:

```json
{
  "./src/utils/": { "branches": 80, "functions": 80, "lines": 80, "statements": 80 },
  "./src/hooks/": { "branches": 80, "functions": 80, "lines": 80, "statements": 80 }
}
```

- **모킹 방침**: axios는 `jest.mock("../utils/axios")`로 모듈 모킹. 실제 네트워크 호출
  금지. `localStorage`는 jsdom 기본 구현을 사용하고 각 테스트에서 초기화한다.

#### 4.0.4 CI 게이트 강화

`.github/workflows/PROJECT-CI.yaml`을 **2단계로 나눠** 수정한다. Phase 0 시점에 즉시
전면 강제하면 아직 고치지 않은 린트 에러 때문에 Phase 0 PR 자체가 CI 실패로 막힌다.

**Phase 0에서 하는 것**
- 린트 단계의 조건부 스킵 로직을 제거하고 `npm run lint`를 실제로 실행한다.
  단, 이 시점에는 `continue-on-error: true`를 붙여 **결과만 보고 차단하지 않는다.**
  (에러 목록을 CI 로그에 남기는 것이 목적 — 이것이 Phase 1~4의 작업 목록이다)
- 테스트 단계도 동일하게 `continue-on-error: true`를 유지한다.
- 실행 순서를 `lint` → `test:ci` → `build`로 정리한다.
- 커버리지 리포트 아티팩트 업로드는 유지한다.

**Phase 1에서 하는 것**
- 린트 에러를 0으로 만든 뒤, 린트·테스트 단계의 `continue-on-error`를 **제거**한다.
- 이 시점부터 CI가 실제 품질 게이트로 동작한다.

#### 4.0.5 문서 체계 신설

```
docs/
├── README.md                  # 문서 인덱스 — 어떤 문서가 어디 있는지
├── ARCHITECTURE.md            # 디렉토리 구조, 데이터 흐름, 상태 관리
├── CONVENTIONS.md             # 코딩 컨벤션 (린트로 강제 못 하는 규칙만)
├── TESTING.md                 # 테스트 3계층 작성 가이드
├── DESIGN-SYSTEM.md           # 디자인 토큰·컴포넌트 규격 (Phase 3에서 확정)
├── GAME-FLOW.md               # 스토리 분기 구조·점수 체계 (Phase 4에서 확정)
└── superpowers/specs/         # 설계 스펙 문서
```

**문서 중복 방지 규칙**: 같은 내용을 두 곳에 쓰지 않는다.

| 문서 | 역할 |
|---|---|
| `README.md` (루트) | 프로젝트 소개·기술 스택·실행 방법. 상세는 `docs/`로 링크만 |
| `claude.md` | AI 에이전트 작업 규칙 + 작업 파이프라인. 설계 내용은 `docs/`로 링크 |
| `docs/*.md` | 실제 내용의 단일 출처 |

`claude.md`는 다음을 포함하도록 재작성한다.

- 현재 실제 구조와 일치하는 프로젝트 개요 (존재하지 않는 `/login`, `/signup` 기술 제거)
- **작업 파이프라인**: 설계 → 이슈(`/pro-github`) → 구현 → 검증 → 커밋(`/pro-commit`)
  → 푸시 → main 최신화 → 배포(`/pro-changelog-deploy`) → 보고서(`/pro-report`) → 라벨 완료
- 품질 게이트: 커밋 전 `npm run lint && npm run test:ci` 통과 필수
- 상세 규칙은 `docs/` 링크로 위임

`agent-prompts/result/`의 기존 보고서 8개는 이력이므로 보존한다.

#### 4.0.6 Phase 0 완료 기준

- `npm run lint`가 실행되고 에러 목록이 출력된다 (에러가 있는 상태가 정상 — 그것이 Phase
  1~4의 작업 목록이다)
- `npm run format:check` 통과
- `docs/` 7개 문서 작성 완료, `claude.md` 재작성 완료
- CI 워크플로우 수정 완료

**주의**: Phase 0에서는 린트 에러를 고치지 않는다. 규칙을 세우는 단계다. CI 강제는
4.0.4에 기술한 대로 Phase 1에서 활성화한다.

---

### Phase 1 — 인증/API 레이어 통일 및 레거시 제거

**목적**: 인증·통신 경로를 하나로 만들고, 죽은 코드를 걷어낸다.

#### 4.1.1 axios 레이어 정상화

1. `src/utils/axios.jsx` → **`src/utils/axios.js`로 이름 변경** (JSX를 포함하지 않는 파일이
   `.jsx` 확장자를 쓰는 것은 규약 위반). UTF-8로 재작성하여 인코딩 손상 복구.
2. `API_BASE_URL` 하드코딩 제거 → `process.env.REACT_APP_API_BASE_URL`.
   `.env.example`을 추가하고 기본값으로 기존 URL을 둔다(값 누락 시 폴백).
3. **요청 인터셉터를 `auth.js`의 `getAuthToken()`을 쓰도록 수정.** `authToken` 키
   참조를 제거한다. 이로써 모든 호출부의 수동 `Authorization` 헤더가 불필요해진다.
4. **401 응답 처리 수정**: 존재하지 않는 `/login`으로의 리다이렉트를 제거하고,
   `clearTokens()` 후 `/`(Home)로 이동한다.

#### 4.1.2 인증 경로 단일화

- `localStorage` 직접 접근 16곳(9개 파일)을 `src/utils/auth.js` 함수로 교체한다.
- 각 호출부의 수동 `Authorization` 헤더를 제거한다(인터셉터가 처리).
- 변수명 정정: `const accessToken = localStorage.getItem("refreshToken")` 형태 4곳을
  실제 값과 일치하는 이름으로 변경.
- `Route.jsx`의 인라인 `ProtectedRoute`를 제거하고 `components/RequireAuth.jsx`로
  일원화한다. `RequireAuth`는 현재 `accessToken`을 읽고 있으므로 `auth.js`의
  `isAuthenticated()`를 쓰도록 수정한다.

#### 4.1.3 로깅 통일

- `console.*` 27곳을 `auth.js`의 `logger`로 교체한다.
- **`logger`를 `src/utils/logger.js`로 분리한다.** 로깅은 인증의 책임이 아니다.
  `auth.js`에서 재export하지 않고 import 경로를 모두 갱신한다.

#### 4.1.4 데드코드 제거

| 파일 | 근거 | 처리 |
|---|---|---|
| `src/components/SelectPageComponent.jsx` (253줄) | import 0회. `BagelSelectPageComponent`로 대체됨 | **삭제 (사용자 확인 후)** |
| `src/pages/MyGameResult.jsx` (164줄) | `Route.jsx`에서 주석 처리됨 | **삭제 (사용자 확인 후)** |

> 파일 삭제는 사용자 승인 없이 수행하지 않는다. Phase 1 작업 중 해당 시점에 확인한다.

`RequireAuth.jsx`는 4.1.2에서 되살리므로 삭제 대상이 아니다.

#### 4.1.5 테스트

- `auth.test.js` — 토큰 저장/조회/삭제, `isAuthenticated`, `createApiHeaders`
- `axios.test.js` — 요청 인터셉터가 토큰을 주입하는가, 401 시 토큰 정리 + `/`로 이동하는가
- `logger.test.js` — 개발/프로덕션 환경별 동작

#### 4.1.6 완료 기준

- `npm run lint` **에러 0** (`no-console`, `no-restricted-properties`,
  `no-restricted-imports` 룰 전부 통과)
- 신규 테스트 통과, `src/utils/` 커버리지 80% 이상
- CI에서 `continue-on-error` 제거 후 통과
- 게임 1회 플레이 수동 검증 (로그인 → 인트로 → Main1~5 → 엔딩)

---

### Phase 2 — 게임 라우팅 및 진행 상태 정합성 수정

**목적**: 진행 상태를 신뢰할 수 있게 만들고, 라우팅의 거짓 정보를 제거한다.

#### 4.2.1 라우트 상수화

`src/constants/routes.js`를 신설해 경로 문자열을 상수로 관리한다. 현재 `/main3`,
`/result` 등이 컴포넌트 곳곳에 문자열 리터럴로 흩어져 있어 오타 시 런타임에야 발견된다.

#### 4.2.2 점수 영속화

`scoreAtom`에 Recoil `effects`를 추가해 `sessionStorage`에 동기화한다.

- **`sessionStorage`를 쓰는 이유**: 탭을 닫으면 초기화되어야 자연스럽다. `localStorage`는
  다음 방문 시 이전 점수가 남아 혼란을 준다.
- 저장 키: `bagel:game:score`
- 게임 시작(Intro 진입) 시 명시적으로 초기화한다.

#### 4.2.3 진행도 가드

`sessionStorage`에 도달한 최대 씬 번호(`bagel:game:progress`)를 기록하고, 라우트 진입 시
검사한다.

- `/main{N}` 진입 시 `progress >= N-1`이 아니면 `/intro`로 리다이렉트
- 엔딩 라우트(`/happy`, `/middle`, `/sad`, `/hidden`, `/over`, `/result`)는 게임 완료
  플래그가 없으면 `/intro`로 리다이렉트
- 구현은 `RequireProgress` 컴포넌트로 분리하고 `RequireAuth`와 조합한다

> **범위 한정**: 클라이언트 사이드 가드이므로 우회 자체를 막지는 못한다. 목적은 보안이
> 아니라 **정상 사용자가 새로고침·뒤로가기로 깨진 상태에 빠지지 않게 하는 것**이다.
> 점수 위변조 방지는 서버 검증 영역이며 이번 범위 밖이다.

#### 4.2.4 404 처리

라우터 최상위에 `errorElement`를 추가하고 `src/pages/NotFound.jsx`를 신설한다. 현재는
존재하지 않는 URL 접근 시 빈 흰 화면이 뜬다.

#### 4.2.5 거짓 정보 제거

- `Main5.jsx`의 사용되지 않는 `url={"/happy"}` prop 제거
- `/ranking` → `/board` 레거시 리다이렉트 제거. 코드베이스 내에 `/ranking`을 가리키는
  링크는 없다(전수 확인함). 외부에서의 유입 여부는 확인할 방법이 없으므로, 제거 후
  4.2.4의 404 페이지가 이를 처리하도록 한다.
- `Main1~5`의 오디오 재생 보일러플레이트 5회 중복을 `useBackgroundMusic(src)` 훅으로 추출
- `Main1`만 `characterName`을 fetch하는 비대칭 해소 → 인트로 진입 시 1회 조회 후 Recoil에
  보관

#### 4.2.6 테스트

- 라우팅 스모크: 전 라우트가 크래시 없이 렌더되는가
- 가드: 미인증 시 `/`로, 진행도 미달 시 `/intro`로 리다이렉트되는가
- 점수 영속화: 저장 후 복원되는가, 게임 시작 시 초기화되는가

#### 4.2.7 완료 기준

- `npm run lint` 에러 0, 전 테스트 통과
- 게임 도중 새로고침 후 점수가 유지되는지 수동 검증
- `/main5` 직접 진입 시 `/intro`로 리다이렉트되는지 수동 검증
- 없는 URL 접근 시 404 페이지가 뜨는지 수동 검증

---

### Phase 3 — 디자인 시스템 재확립 및 대형 화면 분해

**목적**: 시각적 일관성을 확보하고, 유지보수 불가능한 크기의 파일을 분해한다.

#### 4.3.1 현황 전수 점검 (선행)

dev 서버를 띄우고 gstack `/browse`로 전 화면을 **3해상도**에서 캡처한다.

- 해상도: 데스크톱 1440×900 / 태블릿 768×1024 / 모바일 390×844
- 대상: Home(로그인 전/후) · 로그인 모달 · 회원가입 모달 · 크레딧 모달 · ImageGallery ·
  Intro · Main1~5 · Result · Happy/Middle/Sad/Hidden · GameOver · Board · Profile · 404
- 산출물: `docs/DESIGN-SYSTEM.md`에 문제 목록(화면·해상도·증상·스크린샷)

이 목록이 4.3.2~4.3.4의 작업 지시서가 된다. 캡처 없이 추측으로 고치지 않는다.

#### 4.3.2 디자인 토큰 재설계

현재 `theme.js`는 값의 나열이라 "이 색을 언제 쓰는가"가 없다. 토큰 체계로 재설계한다.

- **원시 토큰**: 팔레트 원색, 간격 스케일, 폰트 크기 스케일, 반경, 그림자, z-index
- **의미 토큰**: `surface.glass`, `text.primary`, `border.subtle`, `action.primary` 등
  용도 기반 이름
- 컴포넌트는 **의미 토큰만** 참조한다
- `media` 헬퍼를 사용해 브레이크포인트 하드코딩을 제거한다

#### 4.3.3 대형 파일 분해

**`Home.jsx` (2193줄)** → 다음으로 분리:

```
src/pages/Home/
├── index.jsx              # 조립만 (목표 200줄 이하)
├── Home.styled.js         # 페이지 레벨 styled 정의
└── components/
    ├── AuthModal/         # 로그인 + 회원가입 (탭 전환)
    │   ├── LoginForm.jsx
    │   ├── SignupForm.jsx
    │   ├── GenderSelect.jsx
    │   ├── MbtiSelect.jsx
    │   └── BirthDateSelect.jsx
    ├── CreditsModal.jsx
    ├── MusicControl.jsx
    └── VersionInfo.jsx
```

**`Board.jsx` (1043줄)** → 랭킹 리스트 / 랭킹 아이템 / 페이지네이션·무한스크롤 / 헤더로 분리.

**`ImageGallery.jsx` (611줄)**, **`Profile.jsx` (513줄)** → 동일 원칙으로 분리.

**분해 기준**: 파일 300줄 초과 시 분리를 검토한다. styled 정의는 `*.styled.js`로 분리해
컴포넌트 본문과 섞지 않는다.

#### 4.3.4 스타일 통일

- 인라인 `style={{}}` 36곳을 styled-components 또는 토큰으로 흡수한다.
  단, **동적 계산값**(예: 애니메이션 진행률)은 인라인 유지를 허용하고 그 예외를
  `docs/CONVENTIONS.md`에 명시한다.
- 하드코딩된 rgba 값을 의미 토큰 참조로 교체한다.

#### 4.3.5 반응형 결함 수정

4.3.1에서 수집한 문제 목록을 순서대로 수정하고, **수정 후 동일 해상도에서 재캡처해
before/after를 이슈에 첨부**한다.

#### 4.3.6 테스트

- 컴포넌트 테스트: AuthModal 개폐·폼 검증·탭 전환, MusicControl 토글, 랭킹 아이템 렌더
- 스모크: 분해된 페이지들이 여전히 크래시 없이 렌더되는가

#### 4.3.7 완료 기준

- 3해상도 전 화면 캡처에서 레이아웃 깨짐 0
- `Home.jsx`·`Board.jsx` 각 300줄 이하
- 인라인 스타일이 문서화된 예외만 남음
- `docs/DESIGN-SYSTEM.md` 확정

---

### Phase 4 — 스토리 분기 엔진 데이터화

**목적**: 1.2절 4·5·6번 구조적 모순을 제거한다. 컴포넌트에서 스토리 지식을 제거한다.

#### 4.4.1 스키마 설계

씬 전이 규칙을 데이터로 표현한다. 각 씬은 `next`에 전이 규칙 배열을 갖고, 위에서부터
평가해 첫 번째로 조건을 만족하는 대상으로 이동한다.

```json
{
  "id": "cave",
  "place": "Cave",
  "background": "/img/bg_cave_main.png",
  "bgm": "/audio/34.mp3",
  "scenes": [
    {
      "id": "cave-3",
      "text": "이수정: \"좀 추운 것 같아...\"",
      "img": "/img/bg_cave_low.png",
      "options": [
        {
          "text": "내 겉옷 줄게. 이거라도 입어.",
          "score": 0,
          "subtext": ["이수정: \"어.. 고마워…\""],
          "img": "/img/bg_cave_scene1.png"
        }
      ],
      "next": [
        { "when": { "score": { "gte": 60 } }, "goto": "cave-special" },
        { "when": { "score": { "gte": 20, "lt": 60 } }, "goto": "cave-mid" },
        { "goto": "cave-low" }
      ]
    }
  ],
  "exit": [
    { "when": { "choseOption": "money.take" }, "goto": "/main4" },
    { "goto": "/main3" }
  ]
}
```

핵심 변경점:

- **씬 식별을 배열 인덱스가 아닌 문자열 `id`로 한다.** 인덱스 기반이라 순서를 바꾸면
  분기가 깨지는 문제(1.2절 5번)가 사라진다.
- **분기 조건을 `when` 객체로 선언한다.** `love: 60`처럼 선언만 되고 읽히지 않는 필드
  (1.2절 6번)가 사라진다 — 스키마에 정의된 필드만 존재할 수 있다.
- **`exit` 규칙으로 다음 스테이지를 결정한다.** `setBase()`를 선택지 클릭 시점에
  덮어쓰는 방식(1.2절 5번)을 대체하며, 특정 선택지 ID를 명시적으로 참조하므로 씬 순서와
  무관해진다.
- `subtext`를 `^` 구분 문자열이 아닌 **배열**로 저장한다. 구분자 파싱이 사라진다.

#### 4.4.2 엔진 분리

`src/game/storyEngine.js` — 순수 함수 모듈. React 의존성 없음.

```
resolveNext(scene, state) → nextSceneId | null   // 전이 규칙 평가
resolveExit(chapter, state) → route              // 스테이지 종료 시 목적지
applyChoice(state, option) → newState            // 점수·선택 이력 반영
```

`BagelSelectPageComponent`는 **현재 씬 렌더 + 엔진 호출**만 담당한다. `scene`/`index`
숫자 조건문 약 60줄이 전부 사라진다.

#### 4.4.3 데이터 마이그레이션

`data.jsx`~`data5.jsx` 5개 파일을 `src/data/stories/{home,cafe,cave,umbrella,beach}.json`
으로 변환한다. **기존 분기 동작을 그대로 재현하는 것이 목표이며, 스토리 내용·점수·분기
결과를 바꾸지 않는다.**

기존 하드코딩 로직의 변환 대응표:

| 기존 (컴포넌트 하드코딩) | 신규 (데이터) |
|---|---|
| `scene===2, index===0`: score 15~40 → 1, <15 → 2, else → 3 | cafe 1번 씬의 `next` 규칙 3개 |
| `scene===2, i===0` → `/main4` | cafe `exit`: `choseOption: "money.take"` → `/main4` |
| `scene===3, index===1`: score>=60 → 2, 20~60 → 3, else → 4 | cave 2번 씬의 `next` 규칙 3개 |
| `scene===4, index===2`: score>=70 → 3, else → 종료 | umbrella 3번 씬의 `next` 규칙. **임계치는 기존 동작 유지를 위해 70을 사용하고, 데이터의 `love: 60`은 폐기한다** |
| `scene===5, index===2` → `navigate("/result")` | beach `exit`: `/result` |
| `option.error` → `/over` | 옵션의 `"outcome": "gameover"` |

> **주의**: `data4.jsx`의 `love: 60`과 실제 동작 임계치 70이 불일치하는 것은 1.2절 6번의
> 결함이다. 이번에는 **회귀를 막기 위해 실제 동작(70)을 유지**하고, 어느 쪽이 의도인지는
> Phase 4 진행 중 사용자에게 확인한다.

#### 4.4.4 `DialogueSystem` 통합 검토

`intro.json`은 이미 유사한 스키마를 갖고 있다. 새 스키마와 정합하도록 조정하고,
`DialogueSystem`(자동 진행 연출)과 `BagelSelectPageComponent`(선택지)의 공통부를 추출한다.

> **범위 판단**: 두 컴포넌트의 역할이 실제로 다르다면(연출 재생 vs 선택 분기) 무리하게
> 합치지 않고 스키마만 통일한다. 통합 여부는 Phase 4 착수 시 코드를 다시 읽고 판단한다.

#### 4.4.5 테스트 (이 Phase에서 가장 중요)

`storyEngine`은 순수 함수이므로 테스트하기 쉽고, 회귀를 잡을 수 있는 유일한 안전망이다.

- 전이 규칙 평가: 각 점수 구간별로 올바른 씬으로 가는가
- `exit` 규칙: 카페에서 돈을 주우면 `/main4`, 아니면 `/main3`으로 가는가
- 게임오버: `outcome: "gameover"` 선택 시 `/over`로 가는가
- **전 경로 회귀 테스트**: 가능한 선택 조합을 순회해 최종 도달 엔딩이 마이그레이션
  전후로 동일한지 검증한다. 마이그레이션 직전에 기존 로직으로 기대값 표를 생성해 둔다.

#### 4.4.6 완료 기준

- `BagelSelectPageComponent`에 `scene ===` / `index ===` 조건문이 남아 있지 않음
- 전 경로 회귀 테스트 통과 (마이그레이션 전후 엔딩 동일)
- 5개 스토리 전체 수동 플레이 검증
- `docs/GAME-FLOW.md` 확정

---

### Phase 5 — 문서 최종 동기화 및 배포

1. `docs/` 전 문서를 실제 코드와 대조해 갱신한다. 특히 Phase 3·4에서 확정된
   `DESIGN-SYSTEM.md`·`GAME-FLOW.md`.
2. `README.md` 갱신 — "전체적인 코드 리팩토링 진행 예정" 항목 정리, 실제 구조 반영.
3. `claude.md` 최종 검증 — 기술된 모든 경로·파일이 실제로 존재하는지 확인.
4. `CHANGELOG` 정리 후 `/pro-changelog-deploy`로 `deploy` 브랜치 반영.

---

## 5. 작업 워크플로우

각 Phase마다 다음을 반복한다.

```
1. /pro-github    이슈 생성 (템플릿 규격), 라벨 '작업중'
2.                브랜치 생성 (이슈 번호 기반), git pull --rebase
3.                구현
4.                검증 — npm run lint && npm run test:ci && npm run build
                  Phase 3은 3해상도 캡처 before/after 포함
5. /pro-commit    커밋 (건드린 경로만 명시 스테이징, git add -A 금지)
6.                push → PR
7. /pro-report    구현 보고서를 이슈/PR에 댓글로 등록
8. /pro-github    라벨 '작업완료'로 교체 (이슈는 닫지 않음)
```

전체 Phase 완료 후: `git fetch origin` → `origin/main` 병합 → `/pro-changelog-deploy`.

**금지 사항**
- `main` 브랜치 직접 커밋
- `git add -A` (다른 세션의 동시 작업이 섞일 수 있음)
- force push
- 검증 통과 확인 전 "완료" 보고
- 사용자 승인 없는 파일 삭제

---

## 6. 리스크와 완화

| 리스크 | 영향 | 완화 |
|---|---|---|
| Phase 4 마이그레이션 중 스토리 분기 회귀 | 게임이 잘못된 엔딩으로 감 — 사용자가 즉시 알아채기 어려움 | 마이그레이션 **전에** 기존 로직으로 전 경로 기대값 표를 생성하고, 이를 회귀 테스트의 기준으로 삼는다 |
| Phase 3 파일 분해 중 UI 깨짐 | 시각적 결함 | 분해 전후 동일 해상도 캡처 비교를 필수화 |
| 린트 룰이 과도해 작업이 막힘 | 진행 정체 | Phase 1에서 실제 에러 수를 확인한 뒤, 자동 수정 불가능하고 가치가 낮은 룰은 조정한다 |
| `.env` 도입 후 배포 환경 변수 누락 | 프로덕션 API 호출 실패 | 값 누락 시 기존 URL로 폴백하도록 구현하고, `.env.example`과 CI/Dockerfile 반영을 Phase 1 체크리스트에 포함 |
| Phase가 길어져 main과 분기 | 병합 충돌 | Phase 단위로 PR을 짧게 유지하고, 각 Phase 시작 시 `git pull --rebase` |

---

## 7. 미결 사항

Phase 진행 중 해당 시점에 사용자에게 확인한다.

1. **데드코드 삭제 승인** (Phase 1) — `SelectPageComponent.jsx`, `MyGameResult.jsx`
2. **`love` 임계치 확정** (Phase 4) — 데이터 선언값 60 vs 실제 동작 70 중 무엇이 의도인가
3. **`DialogueSystem` 통합 범위** (Phase 4) — 스키마만 통일할지, 컴포넌트까지 합칠지
