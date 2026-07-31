# 코딩 컨벤션

**ESLint가 잡는 규칙은 여기 쓰지 않는다.** 중복이고, 둘이 어긋나면 어느 쪽이 정답인지 알 수
없어진다. 자동 검사 규칙은 `.eslintrc.json`과 `.prettierrc.json`이 단일 출처다.

이 문서는 **도구로 강제할 수 없어 사람이 지켜야 하는 규칙**만 담는다.

## 네이밍

| 대상          | 규칙                | 예시                                        |
| ------------- | ------------------- | ------------------------------------------- |
| Boolean       | `is` / `has` 접두사 | `isLoading`, `isPasswordVisible`, `hasNext` |
| 이벤트 핸들러 | `handle` 접두사     | `handleSubmit`, `handleChoiceClick`         |
| 핸들러 prop   | `on` 접두사         | `onClick`, `onTypeComplete`                 |
| 상수          | `UPPER_SNAKE_CASE`  | `AUTH_TOKENS`, `API_BASE_URL`               |
| 컴포넌트      | `PascalCase`        | `BagelDialogBox`                            |
| 훅            | `use` 접두사        | `useRankingData`, `useInfiniteScroll`       |

**변수명은 실제 담긴 값과 일치해야 한다.** 현재 코드에는
`const accessToken = localStorage.getItem("refreshToken")` 형태가 4곳 있다. 읽는 사람을
속이는 이름이며 Phase 1에서 정리한다.

## 파일 확장자

- **JSX를 포함하면 `.jsx`**, 포함하지 않으면 `.js`

남은 위반은 다음과 같다.

| 파일                                         | 문제                 | 정리 시점 |
| -------------------------------------------- | -------------------- | --------- |
| `src/utils/data.jsx` ~ `src/utils/data5.jsx` | JSX 없는 순수 데이터 | Phase 4   |

## 파일 크기와 분할

- **300줄을 넘으면 분리를 검토한다.** 넘었다는 사실 자체가 여러 책임을 지고 있다는 신호다
- styled-components 정의는 `*.styled.js`로 분리해 컴포넌트 본문과 섞지 않는다
- 페이지가 커지면 `pages/<Name>/index.jsx` + `pages/<Name>/components/` 구조로 분해한다

styled 정의는 `*.styled.js`로 분리하고, 화면 전용 하위 컴포넌트는 `pages/<Name>/` 아래 둔다.
`src/pages/Home.jsx`와 `src/pages/Board.jsx`가 이 구조를 따른다.

현재 초과 파일: `src/pages/Home.jsx`(913줄), `src/components/ImageGallery.jsx`(611줄),
`src/pages/Board.jsx`(531줄), `src/pages/Profile.jsx`(513줄).

## 스타일링

- 정적 스타일은 **styled-components 또는 `src/styles/theme.js` 토큰**을 쓴다
- **인라인 `style={{}}`은 동적 계산값에만 허용한다** — 애니메이션 진행률, 실행 중 계산되는
  좌표 등. 정적 값을 인라인으로 쓰면 재사용도 테마 적용도 불가능해진다
- 색상 리터럴(`rgba(...)`)을 컴포넌트에 직접 쓰지 않는다. 토큰을 참조한다

현재 인라인 스타일 36곳이 혼용 상태이며 Phase 3에서 정리한다.

## 주석

- **한국어**로 쓴다
- **WHY를 쓴다.** 코드를 그대로 옮겨 적는 주석(`// 카운트를 1 증가`)은 쓰지 않는다
- 특히 "왜 이 이상한 코드가 필요한가"를 남긴다. 우회책·워크어라운드는 반드시 이유를 적는다

```js
// 좋음: 왜인지 설명
// CI는 UTC, 로컬은 KST라 날짜가 하루 달라진다. 값이 아닌 형식만 검증한다.

// 나쁨: 코드를 반복
// date를 파싱한다
```

## 개발 환경 주의사항

### 자동 생성 파일은 포맷 대상이 아니다

`CHANGELOG.json`, `CHANGELOG.md`, `README.md`는 GitHub Actions가 자동으로 수정한다.
Prettier를 적용하면 워크플로우가 다시 쓸 때 포맷이 어긋나 **CI 포맷 체크가 실패**한다.
`.prettierignore`에 등록되어 있으니 빼지 않는다.

(Phase 0에서 README를 "라인 단위 치환이라 안전하다"고 판단해 포함했다가, 실제로
배포 후 CI가 깨지는 것을 확인하고 제외했다.)

### 린트와 빌드는 분리되어 있다

`npm run build`와 `npm start`는 `DISABLE_ESLINT_PLUGIN=true`로 실행된다. CRA가 webpack
안에서 린트를 겸하면 **린트 위반 하나가 배포를 막기** 때문이다.

린트는 별도로 돌려야 한다.

```bash
npm run lint          # 검사
npm run lint:fix      # 자동 수정 가능한 것만 수정
npm run format        # 포맷 적용
```

에디터의 ESLint 확장을 켜두면 실시간 피드백을 받을 수 있다.

### Windows에서 개발할 경우

`package.json`의 `start`/`build` 스크립트는 `VAR=value cmd` 형태의 유닉스 셸 문법을 쓴다.
Windows에서는 동작하지 않으므로 `cross-env`를 devDependency로 추가하고 스크립트를
`cross-env DISABLE_ESLINT_PLUGIN=true ...`로 바꿔야 한다.

### Node 버전

- CI: Node 20 (`.github/workflows/PROJECT-CI.yaml`)
- 로컬 개발 검증: Node 26에서 빌드·테스트 통과 확인됨

버전이 다르므로 **"로컬에선 되는데 CI에선 깨지는"** 경우가 생기면 이 차이를 먼저 의심한다.

## 커밋 전 체크

```bash
npm run format:check
npm run lint
npm run test:ci
```

Phase 1 완료 전까지 `lint`와 `test:ci`는 기존 위반 때문에 실패한다. 중요한 것은
**내 변경이 위반 수를 늘리지 않는 것**이다. 기준선은
`docs/superpowers/plans/phase0-lint-baseline.txt`에 기록되어 있다.
