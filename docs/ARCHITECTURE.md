# 아키텍처

React 18 + CRA(react-scripts 5) 기반 SPA. 인터랙티브 비주얼 노벨 게임이다.

## 디렉토리 구조

```
src/
├── index.jsx          # 진입점. RecoilRoot + RouterProvider + 전역 스타일
├── Route.jsx          # 라우터 정의 (createBrowserRouter)
├── atom/              # Recoil 전역 상태
├── components/        # 재사용 컴포넌트
│   ├── scene/         # 장면 플레이어 (대사창·선택지·배경·캐릭터·효과)
│   └── ui/            # 공용 UI (Button·Card·Modal·NameTag)
├── data/stories/      # JSON 스토리 데이터 (현재 인트로만)
├── hooks/             # 커스텀 훅 (타이핑·진행 키·자동 재생·이미지 미리 받기·대사 흐름)
├── constants/         # 라우트 경로 등 상수
├── game/              # 게임 진행 상태 (라우팅·UI와 독립)
├── pages/             # 라우트에 대응하는 화면
│   ├── Home.styled.js # 화면별 styled 정의는 *.styled.js로 분리
│   └── Home/          # 화면 전용 하위 컴포넌트
├── styles/            # 테마 토큰
└── utils/             # 유틸리티 + 레거시 스토리 데이터
```

| 디렉토리                | 책임                                                                                                                                                                                                                                                                                                                         |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/atom/`             | Recoil atom 정의. 현재 `scoreAtom`, `characterNameAtom` 2개                                                                                                                                                                                                                                                                  |
| `src/components/`       | 화면 간 재사용되는 컴포넌트                                                                                                                                                                                                                                                                                                  |
| `src/components/scene/` | 장면 플레이어 — `DialoguePlayer`가 대사창·선택지·배경·캐릭터·효과·조작 버튼 조립                                                                                                                                                                                                                                             |
| `src/components/ui/`    | 공용 UI — `Button`·`Card`·`Modal`·`NameTag`·`VisuallyHidden`(스크린리더 전용)                                                                                                                                                                                                                                                |
| `src/data/stories/`     | 새 형식의 JSON 스토리 데이터. 현재 인트로만 사용                                                                                                                                                                                                                                                                             |
| `src/hooks/`            | 대사 플레이어 — `useDialogueFlow`(진행·선택·로그), `useTypewriter`(타이핑), `useAdvanceKeys`(Space·Enter·1~4 키), `useAutoPlay`(자동·건너뛰기), `useImagePreload`(그림 미리 받기), `useBackgroundMusic`(배경 음악). 그 외 `useRankingData`(랭킹 조회), `useInfiniteScroll`(무한 스크롤), `useGuestStartForm`(게스트 시작 폼) |
| `src/game/`             | 스테이지 설정(`stages`), 대사 변환·진행(`dialogueScript`, `dialogueFlow`), 본 줄 기록(`seenLines`), 장면 종료 판정(`stageProgress`), 재생 모드(`playMode`), 전이 규칙(`storyFlow`), 진행도(`progress`)                                                                                                                       |
| `src/pages/`            | 스테이지 5개는 `StagePage` 하나, 나머지는 라우트 1:1 대응 화면                                                                                                                                                                                                                                                               |
| `src/styles/`           | `theme.js` — 색상·간격·z-index 토큰                                                                                                                                                                                                                                                                                          |
| `src/utils/`            | 인증·HTTP·시간 유틸, `lazyWithReload`(배포 후 옛 청크 로드 실패 시 새로고침 1회) + **레거시 스토리 데이터**(`data.jsx`~`data5.jsx`)                                                                                                                                                                                          |

> `src/utils/`에 스토리 데이터가 섞여 있는 것은 정리되지 않은 상태다. Phase 4에서
> `src/data/stories/`로 통합한다.
>
> `src/constants/version.js`는 `scripts/sync-version.js`가 빌드 전에 생성하는 파일이라
> 저장소에 커밋되지 않는다.

## 라우팅

`src/Route.jsx`가 `createBrowserRouter`로 정의한다. **이 표가 실제 라우트의 전부다.**

| 경로              | 화면                                         | 인증 보호 |
| ----------------- | -------------------------------------------- | --------- |
| `/`               | `src/pages/Home.jsx`                         | ✗         |
| `/help`           | `src/pages/Help.jsx`                         | ✗         |
| `/intro`          | `src/pages/Intro.jsx`                        | ✓         |
| `/main1`~`/main5` | `src/pages/StagePage.jsx` (`stage` prop 1~5) | ✓         |
| `/result`         | `src/pages/Result.jsx`                       | ✓         |
| `/happy`          | `src/pages/Happy.jsx`                        | ✓         |
| `/middle`         | `src/pages/Middle.jsx`                       | ✓         |
| `/sad`            | `src/pages/Sad.jsx`                          | ✓         |
| `/hidden`         | `src/pages/Hidden.jsx`                       | ✓         |
| `/over`           | `src/pages/GameOver.jsx`                     | ✓         |

게임 화면(인트로·스테이지·결과·엔딩·게임오버)은 `React.lazy`로 지연 로드하고 `Suspense`의
`RouteFallback`을 보여 준다. 스테이지 라우트는 `key`로 스테이지 간 상태를 새로 만든다.| `/over` | `src/pages/GameOver.jsx` | ✓ |
| `/board` | `src/pages/Board.jsx` | ✓ |
| `/profile` | `src/pages/Profile.jsx` | ✓ |

### 가입·로그인은 없다 (게스트 시작)

**가입과 로그인은 없다.** `/login`·`/signup` 라우트도 존재하지 않는다. 홈에서 `게임 시작`
(또는 `랭킹 보기`)을 누르면 시작 모달(`src/pages/Home/GuestStartModal.jsx`)이 열리고,
**닉네임과 MBTI만** 입력하면 바로 시작한다.

| 단계        | 처리                                                                                                                          |
| ----------- | ----------------------------------------------------------------------------------------------------------------------------- |
| 닉네임 추천 | 모달이 열릴 때 `GET /api/guest/nickname`으로 추천값을 채운다. 다시 뽑기·직접 입력 가능. 비워서 보내면 서버가 자동 생성        |
| 시작        | `POST /api/guest/start` `{ characterName?, mbti }`. 응답의 `Authorization` 헤더(액세스 토큰)와 body의 `refreshToken`을 받는다 |
| 저장        | `refreshToken`을 `auth.js`로 저장하고 목적지(`/intro` 또는 `/board`)로 이동한다                                               |

폼 상태·검증은 `src/hooks/useGuestStartForm.js`, API 호출은 `src/utils/guestApi.js`가 맡는다.
닉네임 규칙(2~12자, 한글·영문·숫자·밑줄)은 서버 `GuestStartForm`과 같아야 한다.

**토큰이 곧 계정이다.** 저장소가 지워지면 같은 플레이어로 돌아올 수 없다. 홈의 `새로 시작`은
토큰과 진행 기록을 지우고 새 플레이어로 다시 시작한다.

> 이메일·비밀번호 가입/로그인이 있었으나 진입 장벽 때문에 이용자가 없어 제거했다.

### 인증 보호 방식

`src/components/RequireAuth.jsx`가 보호 라우트 14개를 감싼다. `auth.js`의
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

`characterNameAtom`은 인트로와 `StagePage`가 비어 있을 때 `/api/my-page`로 조회해 채운다
(새로고침하면 atom이 비므로 스테이지마다 확인).

## API 통신

`src/utils/axios.js`가 axios 인스턴스를 만들어 export한다. 모든 호출부가 이 인스턴스를
import한다(전수 확인됨).

- Base URL: `REACT_APP_API_BASE_URL` 환경변수. 미설정 시 운영 주소로 폴백
- 타임아웃: 10초
- `withCredentials: true`

### 인터셉터

- **요청**: `auth.js`의 `getAuthToken()`으로 토큰을 자동 주입한다. **호출부는 `Authorization`
  헤더를 붙이지 않는다.**
- **응답**: **401·403**을 인증 실패로 보고 토큰을 정리한 뒤 `/`(홈)로 이동한다.
  토큰은 홈의 시작 모달에서 발급되기 때문이다.

> **403을 포함하는 이유**: 이 서버는 잘못된/만료된 토큰에 **403을 반환한다**(실측 확인).
> 401만 처리하면 토큰이 만료돼도 자동 로그아웃이 되지 않아 사용자가 계속 실패하는 화면만
> 보게 된다.
>
> 안전한 이유는 이 프로젝트에 **사용자별 권한 구분이 없기** 때문이다. 권한 체계가 생기면
> "인증됐지만 권한 없음"과 구분해야 하므로 이 판단을 재검토해야 한다.
>
> 토큰이 없을 때는 이동시키지 않는다. 이미 로그아웃 상태인데 또 홈으로 보내면 홈에서
> 실패한 요청이 리다이렉트를 반복한다.

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

핵심만 요약하면, 카페(스테이지 2)에서 돈을 줍는지 여부로 동굴(스테이지 3) / 우산(스테이지 4) 경로가
갈리고 둘 다 해변(스테이지 5)으로 합류한다.

## 스타일링

styled-components(CSS-in-JS)를 쓴다. `src/styles/theme.js`에 토큰이 정의되어 있으나
4개 파일에서만 import되고 나머지는 색상을 하드코딩한다. 자세한 내용은
[DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) 참조.

## 빌드와 배포

| 항목        | 내용                                                                                                |
| ----------- | --------------------------------------------------------------------------------------------------- |
| 빌드        | `npm run build` (CRA). 린트는 분리됨 — [CONVENTIONS.md](CONVENTIONS.md) 참조                        |
| 버전 관리   | `version.yml`이 단일 출처. `scripts/sync-version.js`가 동기화                                       |
| CI          | `.github/workflows/PROJECT-CI.yaml` — main PR/push에서 실행                                         |
| 배포 트리거 | `deploy` 브랜치 push. 프론트 `FRONTEND-CICD.yaml`, 백엔드(`backend/**` 변경 시) `BACKEND-CICD.yaml` |
| 배포 방식   | Docker + Nginx 정적 서빙                                                                            |

`main`에 push한다고 배포되지 않는다. main push는 버전 자동 증가와 CI까지만 트리거하며,
실제 배포는 `deploy` 브랜치 push가 트리거한다.
