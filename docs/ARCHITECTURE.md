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
├── constants/         # 라우트 경로 등 상수
├── game/              # 게임 진행 상태 (라우팅·UI와 독립)
├── pages/             # 라우트에 대응하는 화면
│   ├── Home.styled.js # 화면별 styled 정의는 *.styled.js로 분리
│   └── Home/          # 화면 전용 하위 컴포넌트
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

| 경로       | 화면                     | 인증 보호 |
| ---------- | ------------------------ | --------- |
| `/`        | `src/pages/Home.jsx`     | ✗         |
| `/help`    | `src/pages/Help.jsx`     | ✗         |
| `/intro`   | `src/pages/Intro.jsx`    | ✗         |
| `/main1`   | `src/pages/Main1.jsx`    | ✓         |
| `/main2`   | `src/pages/Main2.jsx`    | ✓         |
| `/main3`   | `src/pages/Main3.jsx`    | ✓         |
| `/main4`   | `src/pages/Main4.jsx`    | ✓         |
| `/main5`   | `src/pages/Main5.jsx`    | ✓         |
| `/result`  | `src/pages/Result.jsx`   | ✓         |
| `/happy`   | `src/pages/Happy.jsx`    | ✓         |
| `/middle`  | `src/pages/Middle.jsx`   | ✓         |
| `/sad`     | `src/pages/Sad.jsx`      | ✓         |
| `/hidden`  | `src/pages/Hidden.jsx`   | ✓         |
| `/over`    | `src/pages/GameOver.jsx` | ✓         |
| `/board`   | `src/pages/Board.jsx`    | ✓         |
| `/profile` | `src/pages/Profile.jsx`  | ✓         |

### 로그인·회원가입에는 라우트가 없다

**`/login`과 `/signup`은 존재하지 않는다.** 로그인과 회원가입은 `src/pages/Home.jsx` 내부의
모달로 처리된다.

> 이 사실이 문서화되지 않아 여러 곳에서 오해를 낳았다. axios의 401 처리가 존재하지 않는
> `/login`으로 리다이렉트했고, 기존 `claude.md`에도 두 페이지가 있다고 기술되어 있었다.
> 둘 다 Phase 1에서 정정했다.

### 인증 보호 방식

`src/components/RequireAuth.jsx`가 보호 라우트 13개를 감싼다. `auth.js`의
`isAuthenticated()`로 토큰 존재 여부를 확인하며, 미인증 시 `/`로 이동한다.

만료 검증은 하지 않는다. 만료된 토큰은 API 401 응답 시 axios 인터셉터가 정리한다.

### 없는 페이지 처리

`src/pages/NotFound.jsx`가 라우터의 `errorElement`이자 `*` 경로를 담당한다.

### 진행도 가드

`src/components/RequireProgress.jsx`가 게임 진행도에 따라 화면 접근을 제어한다.
조건은 [GAME-FLOW.md](GAME-FLOW.md) 참조.

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

`src/utils/axios.js`가 axios 인스턴스를 만들어 export한다. 모든 호출부가 이 인스턴스를
import한다(전수 확인됨).

- Base URL: `REACT_APP_API_BASE_URL` 환경변수. 미설정 시 운영 주소로 폴백
- 타임아웃: 10초
- `withCredentials: true`

### 인터셉터

- **요청**: `auth.js`의 `getAuthToken()`으로 토큰을 자동 주입한다. **호출부는 `Authorization`
  헤더를 붙이지 않는다.**
- **응답**: 401이면 토큰을 정리하고 `/`(홈)로 이동한다. 로그인은 별도 라우트가 아니라 홈의
  모달이기 때문이다.

> **확인 필요**: 실측 결과 서버는 잘못된 토큰에 **403**을 반환한다. 인터셉터는 401만
> 처리하므로, 만료 토큰의 자동 로그아웃이 동작하지 않을 수 있다. 백엔드의 401/403 응답
> 규약을 확인한 뒤 처리 범위를 조정해야 한다.

## 인증

`src/utils/auth.js`가 토큰 관리를 전담한다. **`localStorage` 직접 접근은 0건**이며,
ESLint `no-restricted-properties` 룰이 재발을 막는다.

UI 설정(배경음 음소거)은 `src/utils/storage.js`가 별도로 담당한다. 토큰과 설정은 보안·만료
정책이 다르므로 같은 저장소를 쓰더라도 모듈을 분리했다.

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
