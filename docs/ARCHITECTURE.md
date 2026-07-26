# 아키텍처

React 18 + CRA(react-scripts 5) 기반 SPA. 인터랙티브 비주얼 노벨 게임이다.

## 디렉토리 구조

```
src/
├── index.jsx          # 진입점. RecoilRoot + RouterProvider + 전역 스타일
├── Route.jsx          # 라우터 정의 (createBrowserRouter)
├── atom/              # Recoil 전역 상태
├── components/        # 재사용 컴포넌트
│   └── GameUI/        # 게임 플레이 화면 전용 UI
├── data/stories/      # JSON 스토리 데이터 (현재 인트로만)
├── hooks/             # 커스텀 훅
├── pages/             # 라우트에 대응하는 화면
├── styles/            # 테마 토큰
└── utils/             # 유틸리티 + 레거시 스토리 데이터
```

| 디렉토리                 | 책임                                                                   |
| ------------------------ | ---------------------------------------------------------------------- |
| `src/atom/`              | Recoil atom 정의. 현재 `scoreAtom`, `characterNameAtom` 2개            |
| `src/components/`        | 화면 간 재사용되는 컴포넌트                                            |
| `src/components/GameUI/` | 게임 플레이 전용 — 대사창, 선택지 버튼, 타이핑 효과                    |
| `src/data/stories/`      | 새 형식의 JSON 스토리 데이터. 현재 인트로만 사용                       |
| `src/hooks/`             | `useRankingData`(랭킹 조회), `useInfiniteScroll`(무한 스크롤)          |
| `src/pages/`             | 라우트 1:1 대응 화면                                                   |
| `src/styles/`            | `theme.js` — 색상·간격·z-index 토큰                                    |
| `src/utils/`             | 인증·HTTP·시간 유틸 + **레거시 스토리 데이터**(`data.jsx`~`data5.jsx`) |

> `src/utils/`에 스토리 데이터가 섞여 있는 것은 정리되지 않은 상태다. Phase 4에서
> `src/data/stories/`로 통합한다.
>
> `src/constants/version.js`는 `scripts/sync-version.js`가 빌드 전에 생성하는 파일이라
> 저장소에 커밋되지 않는다.

## 라우팅

`src/Route.jsx`가 `createBrowserRouter`로 정의한다. **이 표가 실제 라우트의 전부다.**

| 경로       | 화면                           | 인증 보호 |
| ---------- | ------------------------------ | --------- |
| `/`        | `src/pages/Home.jsx`           | ✗         |
| `/help`    | `src/pages/Help.jsx`           | ✗         |
| `/intro`   | `src/pages/Intro.jsx`          | ✗         |
| `/main1`   | `src/pages/Main1.jsx`          | ✓         |
| `/main2`   | `src/pages/Main2.jsx`          | ✓         |
| `/main3`   | `src/pages/Main3.jsx`          | ✓         |
| `/main4`   | `src/pages/Main4.jsx`          | ✓         |
| `/main5`   | `src/pages/Main5.jsx`          | ✓         |
| `/result`  | `src/pages/Result.jsx`         | ✓         |
| `/happy`   | `src/pages/Happy.jsx`          | ✓         |
| `/middle`  | `src/pages/Middle.jsx`         | ✓         |
| `/sad`     | `src/pages/Sad.jsx`            | ✓         |
| `/hidden`  | `src/pages/Hidden.jsx`         | ✓         |
| `/over`    | `src/pages/GameOver.jsx`       | ✓         |
| `/board`   | `src/pages/Board.jsx`          | ✓         |
| `/profile` | `src/pages/Profile.jsx`        | ✓         |
| `/ranking` | → `/board` 리다이렉트 (레거시) | ✗         |

### 로그인·회원가입에는 라우트가 없다

**`/login`과 `/signup`은 존재하지 않는다.** 로그인과 회원가입은 `src/pages/Home.jsx` 내부의
모달로 처리된다.

> 이 사실이 문서화되지 않아 여러 곳에서 오해를 낳았다. `src/utils/axios.jsx`의 401 처리는
> 존재하지 않는 `/login`으로 리다이렉트하며, 기존 `claude.md`에도 두 페이지가 있다고
> 기술되어 있었다. Phase 1에서 axios 쪽을 정정한다.

### 인증 보호 방식

`src/Route.jsx` 안에 인라인으로 정의된 `ProtectedRoute`가 `refreshToken`의 **존재 여부만**
확인한다. 만료·유효성 검증은 하지 않는다.

`src/components/RequireAuth.jsx`라는 별도 컴포넌트가 있으나 **어디에서도 import되지 않는
데드 코드**다. Phase 1에서 이쪽으로 일원화한다.

### 없는 페이지 처리

`errorElement`가 정의되어 있지 않다. 존재하지 않는 URL로 접근하면 **빈 흰 화면**이 뜬다.
Phase 2에서 404 페이지를 추가한다.

## 상태 관리

Recoil을 쓴다. atom은 `src/atom/atom.js`에 2개뿐이다.

| atom                | 용도                 | 영속화                 |
| ------------------- | -------------------- | ---------------------- |
| `scoreAtom`         | 게임 진행 중 호감도  | **없음** (메모리 전용) |
| `characterNameAtom` | 플레이어 캐릭터 이름 | **없음** (메모리 전용) |

**게임 도중 새로고침하면 점수가 0으로 초기화된다.** Phase 2에서 `sessionStorage` 동기화를
추가한다.

`characterNameAtom`은 `src/pages/Main1.jsx`에서만 조회한다. 다른 스테이지는 조회하지 않는
비대칭 구조다.

## API 통신

`src/utils/axios.jsx`가 axios 인스턴스를 만들어 export한다. 모든 호출부가 이 인스턴스를
import한다(전수 확인됨).

- Base URL: 하드코딩 (`https://api.bagel.suhsaechan.kr`)
- 타임아웃: 10초
- `withCredentials: true`

### 현재 인터셉터가 동작하지 않는다

요청 인터셉터는 `localStorage`에서 `authToken` 키를 읽는데, **이 키는 프로젝트 어디에서도
저장되지 않는다.** 실제 저장 키는 `refreshToken`이다.

결과적으로 인터셉터는 항상 토큰 없이 통과하고, **각 호출부가 `Authorization` 헤더를
수동으로 다시 붙이고 있다.** Phase 1에서 인터셉터를 정상화하고 수동 헤더를 제거한다.

응답 인터셉터의 401 처리도 존재하지 않는 `/login`으로 리다이렉트한다.

## 인증

`src/utils/auth.js`가 토큰 관리 유틸을 제공한다. 완성도 있게 작성되어 있으나
**`src/pages/Profile.jsx` 한 곳에서만 사용된다.** 나머지 9개 파일은 `localStorage`에
직접 접근한다(16곳).

ESLint `no-restricted-properties` 룰이 이 직접 접근을 막고 있으며, Phase 1에서 전부
`auth.js` 경유로 바꾼다.

| 토큰 키        | 용도                                 |
| -------------- | ------------------------------------ |
| `refreshToken` | **실제 API 인증에 쓰이는 토큰**      |
| `accessToken`  | 저장은 되지만 API 호출에 쓰이지 않음 |

> 이름과 실제 역할이 뒤바뀌어 있다. `const accessToken = localStorage.getItem("refreshToken")`
> 형태의 코드가 4곳 있다. Phase 1에서 이름을 실제와 맞춘다.

## 게임 진행

스토리 분기·점수 체계는 [GAME-FLOW.md](GAME-FLOW.md)를 참조한다.

핵심만 요약하면, 카페(Main2)에서 돈을 줍는지 여부로 동굴(Main3) / 우산(Main4) 경로가
갈리고 둘 다 해변(Main5)으로 합류한다.

## 스타일링

styled-components(CSS-in-JS)를 쓴다. `src/styles/theme.js`에 토큰이 정의되어 있으나
4개 파일에서만 import되고 나머지는 색상을 하드코딩한다. 자세한 내용은
[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) 참조.

## 빌드와 배포

| 항목        | 내용                                                                         |
| ----------- | ---------------------------------------------------------------------------- |
| 빌드        | `npm run build` (CRA). 린트는 분리됨 — [CONVENTIONS.md](CONVENTIONS.md) 참조 |
| 버전 관리   | `version.yml`이 단일 출처. `scripts/sync-version.js`가 동기화                |
| CI          | `.github/workflows/PROJECT-CI.yaml` — main PR/push에서 실행                  |
| 배포 트리거 | `deploy` 브랜치 push (`.github/workflows/FRONTEND-CICD.yaml`)                |
| 배포 방식   | Docker + Nginx 정적 서빙                                                     |

`main`에 push한다고 배포되지 않는다. main push는 버전 자동 증가와 CI까지만 트리거하며,
실제 배포는 `deploy` 브랜치 push가 트리거한다.
