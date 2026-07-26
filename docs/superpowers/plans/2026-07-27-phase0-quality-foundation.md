# Phase 0 — 코드 품질 체계 및 문서 구조 확립 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 이후 모든 리팩토링 Phase의 판정 기준이 될 린트·포맷·테스트·CI 게이트와 문서 체계를 구축한다.

**Architecture:** 코드 품질 기준을 문서가 아닌 **도구로 강제**한다. ESLint 룰을 먼저 켜서 위반 목록을 만들고, 그 목록이 Phase 1~4의 작업 지시서가 되게 한다. Phase 0에서는 위반을 고치지 않는다 — 기준만 세운다. CI는 2단계로 도입하여, Phase 0에서는 결과만 보고(`continue-on-error`), Phase 1에서 차단 게이트로 전환한다.

**Tech Stack:** React 18.3 / CRA(react-scripts 5.0.1) / ESLint 8 (eslintrc 형식) / Prettier 3 / Jest + React Testing Library (CRA 내장) / GitHub Actions

## Global Constraints

- 대상 스펙: `docs/superpowers/specs/2026-07-27-codebase-standardization-design.md`
- **Phase 0에서 `src/` 하위의 기존 소스 로직을 수정하지 않는다.** 설정·문서·테스트 추가만 한다. 유일한 예외는 Task 3의 전체 포맷 적용(공백/따옴표만 변경, 로직 불변).
- **`src/utils/axios.jsx`는 이 Phase에서 건드리지 않는다.** 파일 인코딩이 손상(BOM + 모지바케)되어 있어 포맷터를 통과시키면 추가 손상 위험이 있다. Phase 1에서 UTF-8로 재작성한다. 따라서 `.prettierignore`에 등록한다.
- **`main` 브랜치에 직접 커밋하지 않는다.** 이슈 번호 기반 브랜치에서 작업한다.
- 커밋은 `/pro-commit`(projectops) 스킬로 수행한다. 직접 `git commit`하지 않는다.
- `git add -A` 금지. 건드린 경로만 명시적으로 스테이징한다.
- 파일 삭제는 사용자 승인 없이 하지 않는다. (Phase 0에는 삭제 대상 없음)
- 코드 주석은 한국어로, WHY 중심으로 간결하게 작성한다.
- Prettier 설정값: `printWidth: 100`, `tabWidth: 2`, `semi: true`, `singleQuote: false`, `trailingComma: "es5"`, `endOfLine: "lf"`
- 커버리지 임계치 적용 범위: `src/utils/`, `src/hooks/` 각 80% (branches/functions/lines/statements)

---

## File Structure

**생성**

| 경로                         | 책임                                                               |
| ---------------------------- | ------------------------------------------------------------------ |
| `.editorconfig`              | 에디터 레벨 기본 규약(인코딩·개행·들여쓰기). 인코딩 손상 재발 방지 |
| `.prettierrc.json`           | 포맷 규칙 단일 출처                                                |
| `.prettierignore`            | 포맷 제외 대상(빌드 산출물, 손상된 `axios.jsx`)                    |
| `.eslintrc.json`             | 린트 규칙 단일 출처. `package.json`의 `eslintConfig`에서 이전      |
| `.eslintignore`              | 린트 제외 대상(빌드 산출물, 자동 생성 `version.js`)                |
| `.git-blame-ignore-revs`     | 전체 포맷 커밋을 blame에서 제외                                    |
| `.env.example`               | 환경 변수 문서화(Phase 1의 `.env` 도입 준비)                       |
| `src/setupTests.js`          | 테스트 전역 설정(jest-dom matcher 등록)                            |
| `src/utils/TimeUtil.test.js` | 테스트 인프라 동작 검증 겸 첫 유닛 테스트                          |
| `docs/README.md`             | 문서 인덱스                                                        |
| `docs/ARCHITECTURE.md`       | 디렉토리 구조·데이터 흐름·상태 관리                                |
| `docs/CONVENTIONS.md`        | 린트로 강제 못 하는 규칙                                           |
| `docs/TESTING.md`            | 테스트 3계층 작성 가이드                                           |
| `docs/DESIGN-SYSTEM.md`      | 디자인 토큰 규격 (Phase 3에서 확정, Phase 0에서는 골격)            |
| `docs/GAME-FLOW.md`          | 스토리 분기 구조 (Phase 4에서 확정, Phase 0에서는 현행 기록)       |

**수정**

| 경로                                | 변경 내용                                                                              |
| ----------------------------------- | -------------------------------------------------------------------------------------- |
| `package.json`                      | `eslintConfig` 제거, devDependencies 추가, scripts 추가, `jest.coverageThreshold` 추가 |
| `.github/workflows/PROJECT-CI.yaml` | 린트 실제 실행, 순서 정리, 커버리지 리포트                                             |
| `claude.md`                         | 실제 코드와 일치하도록 전면 재작성 + 작업 파이프라인 명문화                            |
| `.gitignore`                        | `.env` 항목 보강                                                                       |

---

### Task 1: 개발 환경 부트스트랩 및 포맷터 도입

**Files:**

- Create: `.editorconfig`
- Create: `.prettierrc.json`
- Create: `.prettierignore`
- Modify: `package.json` (devDependencies, scripts)
- Modify: `.gitignore`

**Interfaces:**

- Consumes: 없음 (첫 작업)
- Produces: `npm run format`, `npm run format:check` 스크립트. Task 3이 이를 사용한다.

- [ ] **Step 1: 의존성 설치 (node_modules 부재 상태)**

현재 `node_modules`가 없다. 먼저 기존 의존성을 복원한다.

```bash
npm ci
```

Expected: `added NNNN packages` 출력. 에러 없이 종료.

> `npm ci`가 `package-lock.json`과 `package.json` 불일치로 실패하면 `npm install`을 사용한다.

- [ ] **Step 2: 포맷터 관련 devDependency 설치**

```bash
npm install --save-dev --save-exact prettier@3.3.3 eslint-config-prettier@9.1.0 eslint-plugin-import@2.29.1
```

Expected: `added 3 packages` 내외. `package.json`의 `devDependencies`에 3개 항목 추가됨.

> `eslint-plugin-import`는 `eslint-config-react-app`에 이미 포함되어 있을 수 있으나, Task 2에서 `import/order` 룰을 직접 참조하므로 **버전을 고정해 명시적으로 설치**한다. 전이 의존성에 기대면 CRA 업데이트 시 조용히 깨진다.

- [ ] **Step 3: `.editorconfig` 작성**

인코딩 손상(`axios.jsx`)의 재발을 막는 것이 이 파일의 존재 이유다.

```ini
# 에디터 레벨 기본 규약 — axios.jsx 인코딩 손상 재발 방지가 목적
root = true

[*]
charset = utf-8
end_of_line = lf
insert_final_newline = true
trim_trailing_whitespace = true
indent_style = space
indent_size = 2

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2
```

- [ ] **Step 4: `.prettierrc.json` 작성**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": false,
  "trailingComma": "es5",
  "endOfLine": "lf",
  "arrowParens": "always",
  "bracketSpacing": true
}
```

> `singleQuote: false`(큰따옴표)를 고른 이유: 기존 코드 다수가 큰따옴표를 쓰고 있어 전체 포맷 시 diff가 최소화된다.

- [ ] **Step 5: `.prettierignore` 작성**

```
node_modules
build
coverage
package-lock.json

# 자동 생성 파일 (scripts/sync-version.js)
src/constants/version.js

# 인코딩 손상 상태 — Phase 1에서 UTF-8 재작성 후 이 항목을 제거한다
src/utils/axios.jsx
```

- [ ] **Step 6: `package.json`에 포맷 스크립트 추가**

`scripts` 객체에 다음 2개를 추가한다. 기존 스크립트는 그대로 둔다.

```json
"format": "prettier --write \"src/**/*.{js,jsx,json,css}\" \"docs/**/*.md\" \"*.{json,md}\"",
"format:check": "prettier --check \"src/**/*.{js,jsx,json,css}\" \"docs/**/*.md\" \"*.{json,md}\""
```

- [ ] **Step 7: `.gitignore`에 `.env` 보강**

현재 `.gitignore`에는 `.env.local` 계열만 있고 `.env` 자체가 없다. Phase 1에서 `.env`를 도입하므로 미리 막는다. `# misc` 섹션의 `.env.local` 위에 다음을 추가한다.

```
.env
```

`.env.example`은 커밋 대상이므로 무시 목록에 넣지 않는다.

- [ ] **Step 8: 포맷 검사가 실행되는지 확인 (아직 통과하지 않아도 됨)**

Run: `npm run format:check`

Expected: 포맷이 맞지 않는 파일 목록이 출력되고 **exit code 1로 실패한다.** 이는 정상이다 — 아직 포맷을 적용하지 않았다. 명령이 실행된다는 것 자체가 이 단계의 확인 대상이다.

출력에 `src/utils/axios.jsx`가 **포함되지 않는지** 확인한다. 포함되어 있다면 `.prettierignore` 경로가 잘못된 것이다.

- [ ] **Step 9: 커밋**

`/pro-commit`으로 커밋한다. 스테이징 대상:

```
.editorconfig .prettierrc.json .prettierignore .gitignore package.json package-lock.json
```

커밋 메시지 취지: `chore: Prettier·EditorConfig 도입 및 포맷 스크립트 추가`

---

### Task 2: ESLint 설정 분리 및 lint 스크립트 도입

**Files:**

- Create: `.eslintrc.json`
- Create: `.eslintignore`
- Modify: `package.json` (`eslintConfig` 제거, scripts 추가)

**Interfaces:**

- Consumes: Task 1의 `eslint-config-prettier`, `eslint-plugin-import`
- Produces: `npm run lint`, `npm run lint:fix` 스크립트. Task 3·5·6이 사용한다.

- [ ] **Step 1: `.eslintrc.json` 작성 (기본 골격만, 강제 룰은 Task 3)**

이 단계에서는 **설정을 옮기기만** 한다. 룰 추가는 다음 Task에서 한다. 한 번에 하면 "설정 분리 때문에 깨진 것"과 "새 룰 때문에 걸린 것"을 구분할 수 없다.

```json
{
  "root": true,
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["import"],
  "rules": {}
}
```

> `"prettier"`(eslint-config-prettier)는 **반드시 extends 배열의 마지막**에 온다. 포맷 관련 ESLint 룰을 꺼서 Prettier와 충돌하지 않게 하는 역할이며, 뒤에 오는 설정이 이긴다.

- [ ] **Step 2: `package.json`에서 `eslintConfig` 키 제거**

`.eslintrc.json`과 `package.json`의 `eslintConfig`가 동시에 존재하면 ESLint가 설정 중복으로 경고하거나 예측 불가능하게 동작한다. 다음 블록을 통째로 삭제한다.

```json
"eslintConfig": {
  "extends": [
    "react-app",
    "react-app/jest"
  ]
},
```

- [ ] **Step 3: `.eslintignore` 작성**

```
node_modules
build
coverage

# 자동 생성 파일 (scripts/sync-version.js)
src/constants/version.js
```

- [ ] **Step 4: `package.json`에 lint 스크립트 추가**

```json
"lint": "eslint src --ext .js,.jsx --max-warnings=0",
"lint:fix": "eslint src --ext .js,.jsx --fix"
```

> `--max-warnings=0`을 두는 이유: 경고는 아무도 안 본다. 경고로 남길 거면 룰을 끄는 게 정직하다.

- [ ] **Step 5: 린트가 실행되는지 확인**

Run: `npm run lint`

Expected: 실행되며 결과가 출력된다. `react-app` 프리셋의 기존 경고(주로 `react-hooks/exhaustive-deps`, `no-unused-vars`)가 검출되어 `--max-warnings=0` 때문에 **exit code 1로 실패할 가능성이 높다.** 이는 정상이다.

**확인할 것**: `Cannot find module` / `Failed to load config` 류의 **설정 오류가 없어야 한다.** 룰 위반은 괜찮고, 설정 로딩 실패는 안 된다.

- [ ] **Step 6: 개발 서버가 여전히 뜨는지 확인**

CRA는 webpack ESLintPlugin으로 린트를 통합하므로, 설정을 옮긴 뒤 dev 서버가 깨지지 않는지 확인해야 한다.

Run: `npm start`

Expected: 컴파일 성공. 브라우저에서 앱이 뜬다. 터미널에 린트 경고가 출력될 수 있으나 컴파일은 성공해야 한다.

확인 후 `Ctrl+C`로 종료한다.

> 린트 오버레이가 개발을 방해하면 `DISABLE_ESLINT_PLUGIN=true npm start`로 우회할 수 있다. 단, 이는 임시 방편이며 커밋 전에는 반드시 `npm run lint`를 통과시켜야 한다.

- [ ] **Step 7: 커밋**

`/pro-commit`. 스테이징 대상:

```
.eslintrc.json .eslintignore package.json
```

커밋 메시지 취지: `chore: ESLint 설정을 .eslintrc.json으로 분리하고 lint 스크립트 추가`

---

### Task 3: 전체 포맷 적용 및 blame 보호

**Files:**

- Create: `.git-blame-ignore-revs`
- Modify: `src/**/*` (공백·따옴표만 — 로직 불변)

**Interfaces:**

- Consumes: Task 1의 `npm run format`
- Produces: 포맷이 통일된 코드베이스. 이후 모든 Phase의 diff가 로직 변경만 담게 된다.

> **이 Task를 독립 커밋으로 분리하는 이유**: 포맷 변경은 diff가 거대하다. 로직 변경과 섞이면 리뷰가 불가능해진다. 포맷만 담은 커밋을 만들고 blame에서 제외하면, 이후 `git blame`이 여전히 원래 작성자·의도를 가리킨다.

- [ ] **Step 1: 포맷 적용 전 현재 상태 기록**

Run: `git status --short | wc -l`
Expected: `0` (작업 트리가 깨끗해야 한다. Task 2까지 커밋 완료 상태)

작업 트리가 깨끗하지 않으면 먼저 정리한다. 포맷 커밋에 다른 변경이 섞이면 안 된다.

- [ ] **Step 2: 전체 포맷 적용**

Run: `npm run format`

Expected: 변경된 파일 목록이 출력된다. `src/utils/axios.jsx`는 **목록에 없어야 한다**(`.prettierignore` 등록됨).

- [ ] **Step 3: 로직이 변경되지 않았는지 검증**

포맷터가 로직을 바꾸지 않았음을 확인한다. 공백을 무시한 diff가 비어 있어야 한다.

Run: `git diff --ignore-all-space --ignore-blank-lines --stat`

Expected: 따옴표 변경(`'` → `"`)이 있는 파일만 나타난다. 제어 흐름이나 식별자가 바뀐 파일이 있으면 **중단하고 원인을 조사한다.**

추가 확인:

Run: `npm run build`
Expected: `Compiled successfully` 또는 경고를 동반한 빌드 성공. 빌드가 깨지면 포맷터가 무언가를 손상시킨 것이므로 `git checkout -- .`로 되돌리고 조사한다.

- [ ] **Step 4: 포맷 검사 통과 확인**

Run: `npm run format:check`
Expected: `All matched files use Prettier code style!` — exit code 0

- [ ] **Step 5: 커밋 (포맷 전용)**

`/pro-commit`. 스테이징 대상: 포맷으로 변경된 `src/` 파일 전체.

커밋 메시지 취지: `style: Prettier 전체 적용 (포맷 전용 — 로직 변경 없음)`

- [ ] **Step 6: `.git-blame-ignore-revs` 생성 및 등록**

Step 5의 커밋 해시를 확인한다.

Run: `git rev-parse HEAD`

그 해시로 파일을 만든다.

```
# 이 파일에 나열된 커밋은 git blame에서 건너뛴다.
# 포맷 전용 커밋이 코드의 원 작성 이력을 가리지 않게 한다.
#
# 로컬 적용:
#   git config blame.ignoreRevsFile .git-blame-ignore-revs

# style: Prettier 전체 적용 (포맷 전용 — 로직 변경 없음)
```

마지막 줄에는 이 Step 시작 시 `git rev-parse HEAD`로 확인한 40자리 커밋 해시를 그대로
붙여 넣는다. 다음 명령으로 자동 추가할 수 있다.

```bash
git rev-parse HEAD >> .git-blame-ignore-revs
```

- [ ] **Step 7: blame 설정 적용 및 동작 확인**

Run:

```bash
git config blame.ignoreRevsFile .git-blame-ignore-revs
git blame -L 1,5 src/utils/auth.js
```

Expected: 포맷 커밋이 아니라 원래 작성 커밋이 표시된다.

- [ ] **Step 8: 커밋**

`/pro-commit`. 스테이징 대상: `.git-blame-ignore-revs`

커밋 메시지 취지: `chore: 포맷 커밋을 blame에서 제외하도록 .git-blame-ignore-revs 추가`

---

### Task 4: 프로젝트 강제 룰 활성화

**Files:**

- Modify: `.eslintrc.json`

**Interfaces:**

- Consumes: Task 2의 `.eslintrc.json` 골격, `npm run lint`
- Produces: 위반 목록. 이 목록이 Phase 1~4의 작업 지시서가 된다.

> **이 Task의 성공 기준은 "린트 통과"가 아니라 "위반이 정확히 검출됨"이다.** 스펙 1.2절에 기록된 결함들이 룰에 걸려야 한다.

- [ ] **Step 1: `.eslintrc.json`에 강제 룰 추가**

Task 2에서 만든 파일의 `rules`와 `overrides`를 다음으로 교체한다.

```json
{
  "root": true,
  "extends": ["react-app", "react-app/jest", "prettier"],
  "plugins": ["import"],
  "rules": {
    "no-console": "error",
    "no-unused-vars": "error",
    "react-hooks/exhaustive-deps": "error",
    "no-restricted-properties": [
      "error",
      {
        "object": "localStorage",
        "property": "getItem",
        "message": "localStorage에 직접 접근하지 마세요. src/utils/auth.js의 함수를 사용하세요."
      },
      {
        "object": "localStorage",
        "property": "setItem",
        "message": "localStorage에 직접 접근하지 마세요. src/utils/auth.js의 함수를 사용하세요."
      },
      {
        "object": "localStorage",
        "property": "removeItem",
        "message": "localStorage에 직접 접근하지 마세요. src/utils/auth.js의 함수를 사용하세요."
      },
      {
        "object": "localStorage",
        "property": "clear",
        "message": "localStorage에 직접 접근하지 마세요. src/utils/auth.js의 clearTokens()를 사용하세요."
      }
    ],
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "axios",
            "message": "axios를 직접 import하지 마세요. src/utils/axios 인스턴스를 사용하세요."
          }
        ]
      }
    ],
    "import/order": [
      "error",
      {
        "groups": ["builtin", "external", "internal", "parent", "sibling", "index"],
        "newlines-between": "always",
        "alphabetize": { "order": "asc", "caseInsensitive": true }
      }
    ]
  },
  "overrides": [
    {
      "files": ["src/utils/auth.js"],
      "rules": {
        "no-restricted-properties": "off"
      }
    },
    {
      "files": ["src/utils/axios.jsx", "src/utils/axios.js"],
      "rules": {
        "no-restricted-imports": "off",
        "no-restricted-properties": "off"
      }
    },
    {
      "files": ["src/utils/logger.js"],
      "rules": {
        "no-console": "off"
      }
    },
    {
      "files": ["**/*.test.js", "**/*.test.jsx", "src/setupTests.js"],
      "rules": {
        "no-restricted-properties": "off"
      }
    }
  ]
}
```

**`no-restricted-globals`가 아니라 `no-restricted-properties`를 쓰는 이유 (중요)**

`eslint-config-react-app` 프리셋은 `no-restricted-globals`에 `confusing-browser-globals`
목록(`event`, `name`, `length`, `location` 등 실수하기 쉬운 브라우저 전역)을 이미 설정해
두었다. 같은 룰 이름을 `rules`에서 재정의하면 **프리셋 설정이 병합되지 않고 통째로
대체되어, 기존 보호가 조용히 사라진다.**

`no-restricted-properties`는 프리셋이 사용하지 않는 룰이므로 충돌이 없다. 이 프로젝트의
`localStorage` 사용은 전부 `localStorage.getItem("...")` 형태(스펙 조사에서 16곳 전수
확인)이므로 프로퍼티 기반 제한으로 충분히 잡힌다.

**overrides 각 항목의 근거**

- `auth.js` — 토큰 저장소 접근의 **유일한 정당한 위치**다. 여기서까지 막으면 규칙이 성립하지 않는다.
- `axios.jsx`/`axios.js` — axios 인스턴스를 만드는 곳이므로 원본 패키지 import가 필요하다. Phase 1에서 `.js`로 이름이 바뀌므로 두 경로를 모두 등록해 둔다.
- `logger.js` — Phase 1에서 생성될 파일. 로거 내부에서는 `console`을 써야 한다. 파일이 아직 없어도 override는 무해하다.
- 테스트 파일 — `localStorage` 상태를 직접 조작해 검증해야 한다.

- [ ] **Step 2: 위반이 검출되는지 확인**

Run: `npm run lint`

Expected: **실패한다(exit 1).** 그것이 이 단계의 목적이다.

- [ ] **Step 3: 검출된 위반이 스펙의 진단과 일치하는지 대조**

각 룰별 위반 건수를 세어 스펙 1.2절과 대조한다.

Run:

```bash
npx eslint src --ext .js,.jsx --format json --output-file .lint-report.json || true
node -e "
const r = require('./.lint-report.json');
const c = {};
r.forEach(f => f.messages.forEach(m => { c[m.ruleId] = (c[m.ruleId]||0)+1; }));
Object.entries(c).sort((a,b)=>b[1]-a[1]).forEach(([k,v]) => console.log(String(v).padStart(4), k));
"
rm .lint-report.json
```

Expected: 대략 다음 수준의 위반이 나타난다. 스펙 조사 시점의 실측값이다.

| 룰                                        | 예상 건수 | 근거 (스펙 1.2절)                      |
| ----------------------------------------- | --------- | -------------------------------------- |
| `no-console`                              | 약 27     | console 사용 27곳                      |
| `no-restricted-properties` (localStorage) | 약 16     | localStorage 직접 접근 16곳 / 9개 파일 |
| `import/order`                            | 다수      | 정렬 규칙 미적용 상태                  |
| `react-hooks/exhaustive-deps`             | 소수      | 기존 경고가 error로 승격               |
| `no-unused-vars`                          | 소수      | 기존 경고가 error로 승격               |

`no-restricted-imports`(axios)는 **0건이 정상**이다. 모든 호출부가 이미 `../utils/axios` 인스턴스를 import하고 있다(스펙 조사에서 확인). 이 룰은 **회귀 방지용**이다.

건수가 예상과 크게 다르면 룰 설정이 의도대로 동작하지 않는 것이므로 조사한다.

- [ ] **Step 4: 위반 목록을 Phase 1 작업 지시서로 저장**

```bash
npm run lint > docs/superpowers/plans/phase0-lint-baseline.txt 2>&1 || true
```

이 파일은 Phase 1의 작업 목록이자 진척 측정 기준이 된다.

> 이 파일은 Phase 1 완료 시 삭제 대상이다. 삭제 시점에 사용자 승인을 받는다.

- [ ] **Step 5: 개발 서버가 여전히 뜨는지 확인**

`no-console`을 error로 올렸으므로 CRA 오버레이가 에러를 띄울 수 있다. 컴파일 자체는 성공해야 한다.

Run: `npm start`

Expected: 컴파일 성공(경고/에러 오버레이는 뜰 수 있음). 앱이 렌더된다.

만약 컴파일이 **실패**하면 CRA가 ESLint error를 빌드 실패로 처리하는 것이므로, Phase 1을 마칠 때까지 개발 시 `DISABLE_ESLINT_PLUGIN=true npm start`를 사용한다. 이 사실을 `docs/CONVENTIONS.md`(Task 7)에 기록한다.

확인 후 `Ctrl+C`.

- [ ] **Step 6: 빌드와 린트의 책임 분리 (실행 중 발견 — 계획 수정)**

**실측 결과, 강제 룰을 켜면 `CI=false npm run build`가 `Failed to compile`로 실패한다.**
CRA는 webpack ESLintPlugin을 통합해 **ESLint `error`를 컴파일 실패로 처리**한다.
`CI=false`는 warning을 error로 승격시키지 않을 뿐, 진짜 error는 여전히 빌드를 막는다.

이 상태를 방치하면 Phase 1이 끝날 때까지 **빌드도 배포도 불가능**해진다.

따라서 빌드와 린트의 책임을 분리한다. `package.json`의 두 스크립트를 수정한다.

```json
"start": "DISABLE_ESLINT_PLUGIN=true react-scripts start",
"build": "DISABLE_ESLINT_PLUGIN=true react-scripts build",
```

**영구 조치로 두는 이유** (Phase 1까지의 임시 우회가 아니다)

- 빌드 도구가 린트를 겸하는 것은 관심사 혼합이다. 린트는 `npm run lint`가 전담하고
  CI의 독립된 lint 단계가 게이트한다 — 품질 게이트는 그대로 유지된다.
- 린트 실패가 곧 배포 불가가 되는 결합은 위험하다. 긴급 핫픽스가 무관한 린트 위반
  하나에 막힌다.
- `npm start`의 ESLint 오버레이가 화면을 덮으면 Phase 3의 3해상도 전수 캡처가 불가능해진다.

> **Windows 주의**: `VAR=value cmd`는 유닉스 셸 문법이다. Windows에서 개발해야 할 경우
> `cross-env`를 devDependency로 추가해 `cross-env DISABLE_ESLINT_PLUGIN=true ...` 형태로
> 바꿔야 한다. 현재 개발 환경(macOS)과 CI(ubuntu)에서는 그대로 동작한다.

Run: `CI=false npm run build`
Expected: `Compiled successfully`

Run: `npm run lint`
Expected: 위반이 **여전히 검출된다**(exit 1). 빌드에서 분리했을 뿐 린트를 끈 것이 아님을
반드시 확인한다.

- [ ] **Step 7: 커밋**

`/pro-commit`. 스테이징 대상:

```
.eslintrc.json docs/superpowers/plans/phase0-lint-baseline.txt
```

커밋 메시지 취지: `chore: 프로젝트 강제 린트 룰 활성화 및 위반 베이스라인 기록`

---

### Task 5: 테스트 인프라 구축 및 커버리지 게이트

**Files:**

- Create: `src/setupTests.js`
- Create: `src/utils/TimeUtil.test.js`
- Modify: `package.json` (`jest` 설정, `test:ci` 스크립트)

**Interfaces:**

- Consumes: Task 2의 `.eslintrc.json`(`react-app/jest` 프리셋)
- Produces: `npm run test:ci` 스크립트, 커버리지 임계치 설정. Task 6(CI)이 사용한다.

> `TimeUtil`을 첫 테스트 대상으로 고른 이유: `formatPlayTime`이 시간·네트워크·DOM에 의존하지 않는 순수 함수라, 테스트가 실패하면 원인이 **인프라 문제임이 확실**하다. 인프라 검증에 적합하다.

- [ ] **Step 1: `src/setupTests.js` 생성**

CRA는 이 경로의 파일을 각 테스트 실행 전에 자동으로 로드한다. 현재 프로젝트에는 존재하지 않아 `@testing-library/jest-dom`의 matcher가 등록되지 않은 상태다.

```js
// CRA가 모든 테스트 실행 전 자동으로 로드하는 파일
// toBeInTheDocument 같은 DOM matcher를 전역 등록한다
import "@testing-library/jest-dom";
```

- [ ] **Step 2: 실패하는 테스트 작성**

`src/utils/TimeUtil.test.js`:

```js
import TimeUtil from "./TimeUtil";

describe("TimeUtil.formatPlayTime", () => {
  it("60초 미만은 초만 표시한다", () => {
    expect(TimeUtil.formatPlayTime(45)).toBe("45초");
  });

  it("60초 이상은 분과 초로 나눠 표시한다", () => {
    expect(TimeUtil.formatPlayTime(125)).toBe("2분 5초");
  });

  it("정확히 분 단위면 나머지 초는 0으로 표시한다", () => {
    expect(TimeUtil.formatPlayTime(120)).toBe("2분 0초");
  });

  it("음수는 0초로 처리한다", () => {
    expect(TimeUtil.formatPlayTime(-10)).toBe("0초");
  });

  it("숫자가 아니면 0초로 처리한다", () => {
    expect(TimeUtil.formatPlayTime("abc")).toBe("0초");
  });
});

describe("TimeUtil.formatKoreanDate", () => {
  it("ISO 문자열을 한국어 날짜로 변환한다", () => {
    expect(TimeUtil.formatKoreanDate("2026-07-27T10:30:00Z")).toMatch(
      /^\d{4}년 \d{1,2}월 \d{1,2}일$/
    );
  });

  it("유효하지 않은 날짜는 '알 수 없음'을 반환한다", () => {
    expect(TimeUtil.formatKoreanDate("not-a-date")).toBe("알 수 없음");
  });
});
```

> `formatKoreanDate`를 정규식으로 검증하는 이유: 실행 환경의 타임존에 따라 날짜가 하루 달라질 수 있다. 값을 고정하면 CI(UTC)와 로컬(KST)에서 결과가 갈린다. **형식**만 검증한다.

- [ ] **Step 3: 테스트 실행 — 인프라가 동작하는지 확인**

Run: `CI=true npx react-scripts test --watchAll=false --testPathPattern=TimeUtil`

Expected: **7개 테스트 전부 PASS.**

> 이 테스트들은 이미 존재하는 정상 동작을 검증하므로 처음부터 통과한다. 여기서의 검증 대상은 프로덕션 코드가 아니라 **테스트 인프라**다. 실패한다면 인프라 문제이거나 `TimeUtil`에 실제 결함이 있는 것이므로, 어느 쪽인지 판별한 뒤 진행한다.

- [ ] **Step 4: 인프라가 실제로 실패를 잡는지 확인 (역검증)**

통과만 확인하면 "테스트가 실행되긴 하는지" 알 수 없다. 일부러 깨뜨려 본다.

`TimeUtil.test.js`의 첫 테스트를 임시로 다음과 같이 바꾼다.

```js
it("60초 미만은 초만 표시한다", () => {
  expect(TimeUtil.formatPlayTime(45)).toBe("46초");
});
```

Run: `CI=true npx react-scripts test --watchAll=false --testPathPattern=TimeUtil`

Expected: **FAIL** — `Expected: "46초" / Received: "45초"`

확인 후 `"45초"`로 되돌린다. 되돌린 뒤 다시 실행해 PASS를 확인한다.

- [ ] **Step 5: `package.json`에 jest 설정과 test:ci 스크립트 추가**

`scripts`에 추가:

```json
"test:ci": "CI=true react-scripts test --coverage --watchAll=false"
```

최상위에 `jest` 키를 추가한다(CRA가 허용하는 키만 사용):

```json
"jest": {
  "collectCoverageFrom": [
    "src/utils/**/*.{js,jsx}",
    "src/hooks/**/*.{js,jsx}",
    "!src/constants/version.js"
  ],
  "coverageThreshold": {
    "./src/utils/": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    },
    "./src/hooks/": {
      "branches": 80,
      "functions": 80,
      "lines": 80,
      "statements": 80
    }
  }
}
```

> `collectCoverageFrom`을 `utils`/`hooks`로 좁힌 이유: 전역 수집 시 아직 테스트가 없는 컴포넌트가 커버리지를 0%로 끌어내려 임계치가 무의미해진다. 범위는 Phase가 진행되며 넓힌다.

- [ ] **Step 6: 커버리지 게이트가 실제로 차단하는지 확인**

Run: `npm run test:ci`

Expected: **실패한다.** `TimeUtil.js` 외의 `src/utils/`, `src/hooks/` 파일들에 테스트가 없어 임계치 80%에 미달한다. 출력에 다음 형태의 메시지가 있어야 한다.

```
Jest: "./src/utils/" coverage threshold for statements (80%) not met: NN%
```

**이 실패는 의도된 것이다.** 게이트가 실제로 동작함을 증명한다. Phase 1에서 `auth.js`·`axios.js`·`logger.js` 테스트를 추가하며 이 임계치를 충족시킨다.

- [ ] **Step 7: 새 파일이 린트를 통과하는지 확인**

Run: `npm run lint`

Expected: Task 4에서 기록한 베이스라인 대비 **새로운 위반이 추가되지 않아야 한다.** `setupTests.js`와 `TimeUtil.test.js`가 위반을 만들면 수정한다.

Run: `npm run format:check`
Expected: 통과(exit 0). 실패하면 `npm run format`을 실행한다.

- [ ] **Step 8: 커밋**

`/pro-commit`. 스테이징 대상:

```
src/setupTests.js src/utils/TimeUtil.test.js package.json
```

커밋 메시지 취지: `test: 테스트 인프라 구축 및 utils/hooks 커버리지 게이트 도입`

---

### Task 6: CI 워크플로우 개편

**Files:**

- Modify: `.github/workflows/PROJECT-CI.yaml`

**Interfaces:**

- Consumes: Task 2의 `npm run lint`, Task 5의 `npm run test:ci`
- Produces: 린트·테스트 결과를 보고하는 CI. Phase 1에서 차단 게이트로 전환된다.

> **Phase 0에서는 차단하지 않는다.** 현재 린트 위반이 다수 존재하므로(Task 4), 지금 차단하면 이 PR 자체가 머지되지 못한다. 결과를 로그에 남기는 것이 목적이다.

- [ ] **Step 1: 린트 단계 교체**

현재 린트 단계는 스크립트 존재 여부를 확인하고 없으면 건너뛴다. 이제 스크립트가 존재하므로 조건부 로직을 제거한다.

**제거할 블록:**

```yaml
- name: 린트 체크
  run: |
    if npm run lint --silent 2>/dev/null; then
      echo "✅ 린트 체크 실행"
      npm run lint
    else
      echo "ℹ️  린트 스크립트가 없습니다. 건너뛰기"
    fi
```

**교체할 내용:**

```yaml
- name: 포맷 체크
  run: npm run format:check
  continue-on-error: true

- name: 린트 체크
  id: lint
  run: npm run lint
  # Phase 0: 위반이 다수 남아 있어 결과만 보고한다.
  # Phase 1에서 위반을 0으로 만든 뒤 이 줄을 제거해 차단 게이트로 전환한다.
  continue-on-error: true
```

- [ ] **Step 2: 테스트 단계 교체**

기존 테스트 단계는 존재하지 않는 `jest-sonar-reporter`를 참조한다. 이 패키지는 설치되어 있지 않아 명령이 실패하며, `continue-on-error` 때문에 조용히 넘어가고 있었다.

**제거할 블록:**

```yaml
- name: 테스트 실행
  id: test-run
  run: |
    echo "🧪 테스트 실행 중..."
    if CI=true npm test -- --coverage --testResultsProcessor=jest-sonar-reporter --watchAll=false; then
      echo "test_status=success" >> $GITHUB_OUTPUT
      echo "✅ 모든 테스트가 통과했습니다."
    else
      echo "test_status=failed" >> $GITHUB_OUTPUT
      echo "❌ 일부 테스트가 실패했습니다."
      exit 1
    fi
  env:
    CI: true
  continue-on-error: true
```

**교체할 내용:**

```yaml
- name: 테스트 실행
  id: test-run
  run: npm run test:ci
  env:
    CI: true
  # Phase 0: utils/hooks 커버리지 임계치 미달 상태.
  # Phase 1에서 테스트를 채운 뒤 이 줄을 제거한다.
  continue-on-error: true
```

- [ ] **Step 3: 후속 단계의 출력 참조 정리**

기존 "실패 정보 수집" 단계가 `steps.test-run.outputs.test_status`를 참조한다. Step 2에서 해당 output을 더 이상 설정하지 않으므로 참조를 수정한다.

**변경 전:**

```yaml
if [ "${{ steps.test-run.outputs.test_status }}" = "failed" ]; then
```

**변경 후:**

```yaml
if [ "${{ steps.test-run.outcome }}" = "failure" ]; then
```

> `outcome`은 `continue-on-error`가 적용되기 **전**의 실제 결과를 담는 GitHub Actions 내장 값이다. 별도 output 설정이 필요 없다.

- [ ] **Step 4: PR 성공 댓글의 거짓 문구 수정**

현재 성공 댓글은 무조건 다음을 출력한다.

```
            ### ✅ 모든 검사 통과
            - 린트 체크 ✅
            - 테스트 실행 ✅
            - 빌드 생성 ✅
```

`continue-on-error` 상태에서는 린트·테스트가 실패해도 이 문구가 나가 **거짓 보고**가 된다. 실제 결과를 반영하도록 수정한다.

```yaml
            const lintOutcome = '${{ steps.lint.outcome }}' === 'success' ? '✅' : '⚠️';
            const testOutcome = '${{ steps.test-run.outcome }}' === 'success' ? '✅' : '⚠️';
```

그리고 댓글 본문의 해당 블록을 다음으로 교체한다.

```
            ### 검사 결과
            - 린트 체크 ${lintOutcome}
            - 테스트 실행 ${testOutcome}
            - 빌드 생성 ✅

            > ⚠️ 표시는 Phase 0 기준으로 아직 정리되지 않은 항목입니다 (차단하지 않음).
```

- [ ] **Step 5: YAML 문법 검증**

Run:

```bash
node -e "
const fs=require('fs');
const s=fs.readFileSync('.github/workflows/PROJECT-CI.yaml','utf8');
if (s.includes('\t')) { console.error('탭 문자 발견 — YAML에서 금지'); process.exit(1); }
console.log('탭 없음 OK');
"
```

Expected: `탭 없음 OK`

추가로 필수 단계가 모두 존재하는지 확인한다.

Run: `grep -n "name:" .github/workflows/PROJECT-CI.yaml | head -20`

Expected: `포맷 체크`, `린트 체크`, `테스트 실행`, `프로젝트 빌드`가 이 순서로 존재한다.

- [ ] **Step 6: 로컬에서 CI와 동일한 명령 실행**

CI가 실행할 명령을 로컬에서 동일하게 돌려 결과를 예측한다.

```bash
npm run format:check; echo "format exit: $?"
npm run lint;         echo "lint exit: $?"
npm run test:ci;      echo "test exit: $?"
CI=false npm run build; echo "build exit: $?"
```

Expected:

- `format exit: 0` (Task 3에서 전체 포맷 적용됨)
- `lint exit: 1` (위반 잔존 — Phase 1에서 해소)
- `test exit: 1` (커버리지 미달 — Phase 1에서 해소)
- `build exit: 0` (빌드는 반드시 성공해야 한다)

**`build exit`가 0이 아니면 중단하고 조사한다.** 빌드 실패는 Phase 0에서 허용되지 않는다.

- [ ] **Step 7: 커밋**

`/pro-commit`. 스테이징 대상:

```
.github/workflows/PROJECT-CI.yaml
```

커밋 메시지 취지: `ci: 린트·테스트를 실제 실행하도록 CI 개편 (Phase 0 — 보고 전용)`

---

### Task 7: 문서 체계 신설

**Files:**

- Create: `docs/README.md`
- Create: `docs/ARCHITECTURE.md`
- Create: `docs/CONVENTIONS.md`
- Create: `docs/TESTING.md`
- Create: `docs/DESIGN-SYSTEM.md`
- Create: `docs/GAME-FLOW.md`

**Interfaces:**

- Consumes: 스펙 문서의 진단 내용, Task 1~6에서 확정된 설정값
- Produces: `claude.md`(Task 8)가 링크할 대상 문서들

> **문서 중복 방지 원칙**: 같은 내용을 두 곳에 쓰지 않는다. `docs/*.md`가 내용의 단일 출처이고, `README.md`(루트)와 `claude.md`는 링크만 한다.

- [ ] **Step 1: `docs/README.md` — 문서 인덱스**

각 문서가 무엇을 담고 무엇을 담지 않는지 한 줄로 밝힌다. 포함할 항목:

- 문서 목록과 각각의 역할 (아래 5개 문서 + `superpowers/specs/`, `superpowers/plans/`)
- **어디에 무엇을 쓸지 판단하는 규칙** — 예: "설계 결정은 `specs/`, 확정된 규칙은 해당 주제 문서, AI 작업 절차는 루트 `claude.md`"
- 루트 `README.md`와의 역할 구분 (루트는 프로젝트 소개·실행 방법, `docs/`는 상세)

- [ ] **Step 2: `docs/ARCHITECTURE.md` — 구조와 데이터 흐름**

**반드시 실제 코드와 일치해야 한다.** 기존 `claude.md`가 신뢰를 잃은 원인이 존재하지 않는 `/login`·`/signup` 기술이었다. 포함할 항목:

- 디렉토리 구조 — `src/` 하위 전체(`atom`, `components`, `data`, `hooks`, `pages`, `styles`, `utils`). 각 디렉토리의 책임 한 줄
- 라우팅 표 — `src/Route.jsx`의 실제 라우트 전체와 인증 보호 여부. **모달로 처리되는 로그인·회원가입은 "라우트 없음"으로 명시**
- 게임 진행 흐름 — 스펙 1.3절의 분기 다이어그램을 그대로 옮긴다 (Main2 돈 선택 → Main3/Main4 분기 → Main5 → `/result`)
- 상태 관리 — Recoil atom 2개(`scoreAtom`, `characterNameAtom`)의 용도와 **현재 영속화되지 않는다는 한계**(Phase 2에서 해소 예정)
- API 통신 — `src/utils/axios` 인스턴스 경유. **현재 인터셉터가 동작하지 않는 상태임을 명시**(Phase 1에서 해소 예정)

작성 후 기술된 모든 파일 경로가 실존하는지 확인한다.

- [ ] **Step 3: `docs/CONVENTIONS.md` — 린트로 강제 못 하는 규칙만**

ESLint가 잡는 규칙은 여기 쓰지 않는다. 중복이고, 둘이 어긋나면 어느 쪽이 정답인지 알 수 없어진다. 포함할 항목:

- **네이밍** — Boolean은 `is` 접두사(`isLoading`), 이벤트 핸들러는 `handle` 접두사, 상수는 `UPPER_SNAKE_CASE`
- **파일 확장자** — JSX를 포함하면 `.jsx`, 아니면 `.js`. 현재 `utils/data*.jsx`, `utils/axios.jsx`가 위반 상태이며 Phase 1·4에서 정리 예정임을 명시
- **파일 크기** — 300줄 초과 시 분리 검토. styled 정의는 `*.styled.js`로 분리
- **인라인 스타일 허용 예외** — 동적 계산값(애니메이션 진행률 등)만 허용. 정적 스타일은 styled-components 또는 테마 토큰
- **주석** — 한국어, WHY 중심. 코드를 그대로 옮겨 적는 주석 금지
- **개발 시 린트 오버레이 우회** — Phase 1 완료 전까지 `DISABLE_ESLINT_PLUGIN=true npm start` 사용 가능. 단 커밋 전 `npm run lint` 통과 필수 (Task 4 Step 5에서 확인한 내용)

- [ ] **Step 4: `docs/TESTING.md` — 테스트 3계층 가이드**

포함할 항목:

- 3계층 정의 표 (유닛 / 컴포넌트 / 스모크) — 대상, 도구, 기준
- 파일 위치 규약 — co-located (`auth.js` 옆 `auth.test.js`)
- 커버리지 임계치 — 현재 `src/utils/`, `src/hooks/` 각 80%. 범위 확대 계획
- 모킹 방침 — axios는 `jest.mock("../utils/axios")` 모듈 모킹, 실제 네트워크 호출 금지. `localStorage`는 jsdom 기본 구현 사용 후 각 테스트에서 초기화
- **타임존 의존 테스트 주의** — 날짜 관련 테스트는 값이 아닌 형식을 검증한다 (Task 5의 `formatKoreanDate` 사례를 근거로 제시)
- 실행 명령 — `npm test`(watch), `npm run test:ci`(CI 모드 + 커버리지)

- [ ] **Step 5: `docs/DESIGN-SYSTEM.md` — Phase 3 준비용 골격**

Phase 3에서 확정되므로 지금은 골격과 현황만 기록한다. 포함할 항목:

- 문서 상단에 **"Phase 3에서 확정 예정. 현재는 현황 기록"** 명시
- 현재 `src/styles/theme.js`의 토큰 목록과 **실제 사용 현황(4개 파일만 import)**
- 현재 상태의 문제 — 하드코딩된 rgba, 인라인 스타일 36곳, "이 색을 언제 쓰는가"가 정의되지 않음
- Phase 3 계획 — 원시 토큰 / 의미 토큰 2계층 구조, 3해상도(1440·768·390) 전수 점검
- 반응형 브레이크포인트 — `theme.js`의 `breakpoints`·`media` 헬퍼 실제 값

- [ ] **Step 6: `docs/GAME-FLOW.md` — 현행 스토리 구조 기록**

Phase 4의 마이그레이션 기준이 되는 문서다. **현재 동작을 정확히 기록하는 것이 목적**이며, 이것이 Phase 4 회귀 테스트의 기대값 근거가 된다. 포함할 항목:

- 스테이지 구성 표 — Main1(집/`data.jsx`), Main2(카페/`data2.jsx`), Main3(동굴/`data3.jsx`), Main4(우산/`data4.jsx`), Main5(해변/`data5.jsx`)
- 분기 다이어그램 (스펙 1.3절)
- **점수 임계치 표** — 스펙 4.4.3의 변환 대응표를 그대로 기록:
  - scene 2, index 0: score 15~40 → index 1, <15 → index 2, else → index 3
  - scene 2: 선택지 i===0 → `/main4`, 그 외 → `/main3`
  - scene 3, index 1: score>=60 → 2, 20~60 → 3, else → 4
  - scene 4, index 2: score>=70 → 3, else → 종료
  - scene 5, index 2 → `navigate("/result")`
  - `option.error` → `/over`
- 엔딩 분기 — `Result.jsx`의 점수 기준 happy/middle/sad 분기
- **알려진 결함 목록** — 스펙 1.2절 4·5·6·7번(하드코딩 분기, 우연히 동작하는 base 설정, `love: 60`과 실제 임계치 70의 불일치, `Main5`의 미사용 `url` prop). 각 항목에 "Phase 4에서 해소" 표기

- [ ] **Step 7: 문서 검증 — 기술된 경로가 실존하는지 확인**

문서가 코드와 어긋나는 것이 이번 작업의 원인이었다. 자동으로 검사한다.

```bash
node -e "
const fs=require('fs');
const files=['docs/README.md','docs/ARCHITECTURE.md','docs/CONVENTIONS.md','docs/TESTING.md','docs/DESIGN-SYSTEM.md','docs/GAME-FLOW.md'];
let bad=0;
for (const f of files) {
  const txt=fs.readFileSync(f,'utf8');
  // 백틱으로 감싼 src/ 경로를 추출해 실존 확인
  const paths=[...txt.matchAll(/\`(src\/[A-Za-z0-9_\/.-]+)\`/g)].map(m=>m[1]);
  for (const p of new Set(paths)) {
    if (!fs.existsSync(p)) { console.error('❌ ' + f + ' → 존재하지 않는 경로: ' + p); bad++; }
  }
}
console.log(bad===0 ? '✅ 모든 src 경로 실존 확인' : '❌ ' + bad + '건 불일치');
process.exit(bad===0?0:1);
"
```

Expected: `✅ 모든 src 경로 실존 확인`

실패하면 해당 문서의 경로를 수정한다. **경로를 지우지 말고 올바른 경로로 고친다.**

- [ ] **Step 8: 포맷 확인**

Run: `npm run format:check`
Expected: 통과. 실패 시 `npm run format` 실행.

- [ ] **Step 9: 커밋**

`/pro-commit`. 스테이징 대상:

```
docs/README.md docs/ARCHITECTURE.md docs/CONVENTIONS.md docs/TESTING.md docs/DESIGN-SYSTEM.md docs/GAME-FLOW.md
```

커밋 메시지 취지: `docs: docs 디렉토리 문서 체계 신설`

---

### Task 8: claude.md 재작성

**Files:**

- Modify: `claude.md`
- Create: `.env.example`

**Interfaces:**

- Consumes: Task 7의 `docs/*.md` (링크 대상), Task 1~6의 확정 설정
- Produces: AI 에이전트 작업 규칙의 단일 출처

> 기존 `claude.md`는 존재하지 않는 `/login`·`/signup` 라우트를 기술하고, `src/` 구조도에서 `pages/`·`hooks/`·`atom/`·`data/`를 누락하고 있다. 설계 내용과 작업 규칙이 섞여 있어 유지되지 못했다. **작업 규칙만 남기고 설계 내용은 `docs/`로 위임**한다.

- [ ] **Step 1: `.env.example` 생성**

Phase 1에서 `.env`를 도입하므로 문서화를 먼저 한다.

```
# API 서버 주소
# 미설정 시 src/utils/axios.js의 기본값으로 폴백한다
REACT_APP_API_BASE_URL=https://api.bagel.suhsaechan.kr
```

- [ ] **Step 2: `claude.md` 재작성**

기존 파일을 전면 교체한다. 다음 구조로 작성한다.

**포함할 것**

1. **프로젝트 개요** — 3줄 이내. React 기반 인터랙티브 비주얼 노벨. 상세는 `docs/ARCHITECTURE.md` 링크
2. **작업 파이프라인** — 사용자 전역 규칙과 일치시킨다:
   ```
   설계 → 이슈 작성 → 구현 → 검증 → 커밋 → 푸시 → main 최신화 → 배포 → 완료 보고서 → 라벨 완료처리
   ```
   각 단계에 사용할 스킬 명시: 이슈·PR·라벨은 `/pro-github`, 커밋은 `/pro-commit`,
   배포는 `/pro-changelog-deploy`, 보고서는 `/pro-report`
3. **품질 게이트** — 커밋 전 반드시 통과해야 하는 명령:
   ```bash
   npm run format:check
   npm run lint
   npm run test:ci
   ```
   Phase 1 완료 전까지는 `lint`·`test:ci`가 실패할 수 있음을 명시하고, 해당 시점을 밝힌다
4. **금지 사항** — `main` 직접 커밋 금지, `git add -A` 금지, force push 금지,
   사용자 승인 없는 파일 삭제 금지, 검증 전 "완료" 보고 금지
5. **문서 링크 표** — 어떤 주제를 어느 문서에서 찾을지:

   | 주제                             | 문서                      |
   | -------------------------------- | ------------------------- |
   | 디렉토리 구조·라우팅·데이터 흐름 | `docs/ARCHITECTURE.md`    |
   | 코딩 컨벤션                      | `docs/CONVENTIONS.md`     |
   | 테스트 작성법                    | `docs/TESTING.md`         |
   | 디자인 토큰                      | `docs/DESIGN-SYSTEM.md`   |
   | 게임 분기·점수 체계              | `docs/GAME-FLOW.md`       |
   | 진행 중인 리팩토링 설계          | `docs/superpowers/specs/` |

6. **현재 진행 중인 작업** — 전면 표준화 리팩토링이 진행 중이며 Phase 0~5 중 어디까지
   완료되었는지. 스펙 문서 링크

**제외할 것 (docs/로 이전됨)**

- 색상 팔레트·글라스모피즘 CSS → `docs/DESIGN-SYSTEM.md`
- 디렉토리 구조도 → `docs/ARCHITECTURE.md`
- 네이밍·이미지 명명법 → `docs/CONVENTIONS.md`
- API 응답 구조 예시 → `docs/ARCHITECTURE.md`

**반드시 제거할 것 (사실과 다름)**

- `/login`, `/signup` 라우트 기술 — **존재하지 않는다.** Home의 모달로 처리된다
- "새로 생성된 표준 구조" 항목의 불완전한 `src/` 트리

**보존할 것**

- 파일 하단의 다음 문구 2개를 그대로 유지한다:

  ```
  <!- 해당 문구는 절때 삭제하지 마세요 -->
  ```

  이 문구는 원본 파일에 명시적으로 삭제 금지가 표기되어 있다.

- [ ] **Step 3: 사실 검증 — 기술된 라우트가 실존하는지 확인**

`claude.md`에 라우트를 언급했다면 `src/Route.jsx`와 대조한다.

```bash
echo "=== Route.jsx의 실제 path 목록 ==="
grep -oE 'path: "[^"]*"' src/Route.jsx | sort -u
echo "=== claude.md가 언급하는 경로 ==="
grep -oE '`/[a-z0-9-]*`' claude.md | sort -u
```

Expected: `claude.md`가 언급하는 모든 경로가 `Route.jsx`에 존재한다. **`/login`, `/signup`이 `claude.md` 쪽 목록에 나타나면 안 된다.**

- [ ] **Step 4: 문서 링크 유효성 확인**

```bash
node -e "
const fs=require('fs');
const txt=fs.readFileSync('claude.md','utf8');
const links=[...txt.matchAll(/\]\(([^)]+\.md)\)/g)].map(m=>m[1]);
let bad=0;
for (const l of new Set(links)) {
  if (l.startsWith('http')) continue;
  if (!fs.existsSync(l)) { console.error('❌ 깨진 링크: ' + l); bad++; }
}
console.log(bad===0 ? '✅ 모든 문서 링크 유효' : '❌ ' + bad + '건 깨짐');
process.exit(bad===0?0:1);
"
```

Expected: `✅ 모든 문서 링크 유효`

- [ ] **Step 5: 삭제 금지 문구가 보존되었는지 확인**

```bash
grep -c "해당 문구는 절때 삭제하지 마세요" claude.md
```

Expected: `2`

**결과가 2가 아니면 문구를 복원한다.** 원본에 명시적 삭제 금지가 표기된 항목이다.

- [ ] **Step 6: 전체 품질 게이트 최종 확인**

Phase 0의 최종 상태를 확인한다.

```bash
npm run format:check; echo "format: $?"
npm run lint > /dev/null 2>&1; echo "lint: $?"
npm run test:ci > /dev/null 2>&1; echo "test: $?"
CI=false npm run build > /dev/null 2>&1; echo "build: $?"
```

Expected:

- `format: 0` — 통과해야 한다
- `lint: 1` — 위반 잔존(정상, Phase 1 대상)
- `test: 1` — 커버리지 미달(정상, Phase 1 대상)
- `build: 0` — **반드시 통과해야 한다**

`format`이나 `build`가 실패하면 Phase 0을 완료로 보고하지 않는다.

- [ ] **Step 7: 커밋**

`/pro-commit`. 스테이징 대상:

```
claude.md .env.example
```

커밋 메시지 취지: `docs: claude.md를 실제 코드와 일치하도록 재작성하고 작업 파이프라인 명문화`

---

## Phase 0 완료 기준

전부 충족해야 Phase 1로 넘어간다.

- [ ] `npm run format:check` 통과 (exit 0)
- [ ] `npm run lint` 실행되며 위반 목록 출력 (exit 1 정상)
- [ ] `npm run test:ci` 실행되며 커버리지 게이트 동작 확인 (exit 1 정상)
- [ ] `CI=false npm run build` 통과 (exit 0)
- [ ] `docs/` 6개 문서 작성, 기술된 `src/` 경로 전부 실존
- [ ] `claude.md` 재작성, `/login`·`/signup` 기술 제거, 삭제 금지 문구 2개 보존
- [ ] CI 워크플로우가 린트·테스트를 실제 실행 (`continue-on-error`로 보고만)
- [ ] `docs/superpowers/plans/phase0-lint-baseline.txt` 생성 — Phase 1 작업 지시서
- [ ] 게임 1회 수동 플레이 정상 동작 (설정 변경이 런타임에 영향을 주지 않았음을 확인)

---

## 다음 Phase

Phase 1~5 계획은 각 Phase 착수 시점에 작성한다. Phase 3(디자인)은 실제 3해상도 캡처
결과가, Phase 4(스토리 엔진)는 마이그레이션 기대값 표가 입력이므로, 지금 작성하면 추측이
된다.

Phase 1 계획 작성 시 `phase0-lint-baseline.txt`의 실제 위반 목록을 근거로 삼는다.
