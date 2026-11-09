# 디자인 시스템

> **상태: 적용 완료 (엔딩 제외).** 토큰 2계층과 공용 컴포넌트가 홈·랭킹·갤러리·프로필·
> 게임오버·404·게임 플레이(인트로·스테이지)에 적용됐다. 엔딩 화면은 #128에서 정리한다.

## 진행 현황

| 항목                     | 상태                                                                                        |
| ------------------------ | ------------------------------------------------------------------------------------------- |
| 토큰 2계층               | **적용** (`tokens.js` 원시 + `semantic.js` 의미, `theme.js`는 호환 레이어)                  |
| 하드코딩 색상            | 293곳(22개 파일) → **6곳(6개 파일)**. 남은 곳은 엔딩·결과·진입점뿐                          |
| 공용 컴포넌트            | `Button`·`Card`·`Modal`·`NameTag` (`src/components/ui/`). `GlassCard`는 제거                |
| 대형 파일 분해           | `Home.styled.js` 810 → 223줄, `Board.styled.js` 552 → 254줄, `ImageGallery.jsx` 616 → 4파일 |
| `unknown prop` 콘솔 경고 | **해소** (transient prop 적용)                                                              |
| 게임 플레이 화면         | **완료** (`src/components/scene/` 장면 플레이어, #127)                                      |
| 3해상도 전수 캡처        | **완료** (이관된 화면 기준, 아래 참조)                                                      |
| 규칙 테스트              | `designTokens.rules.test.js` + `designTokens.baseline.json` (줄이기만 허용)                 |

### 남은 하드코딩 (6곳)

| 구분      | 파일                                         | 처리            |
| --------- | -------------------------------------------- | --------------- |
| 엔딩·결과 | `Happy`, `Middle`, `Sad`, `Hidden`, `Result` | #128에서 재구성 |
| 진입점    | `src/index.jsx` (`background-color: #000`)   | 토큰으로 교체   |

### 디렉토리 구조

```
src/styles/
├── tokens.js                # 원시 토큰
├── semantic.js              # 의미 토큰
├── theme.js                 # 호환 레이어
└── styleObject.js           # JS 스타일 객체 > CSS 문자열

src/components/ui/           # 공용 컴포넌트
├── Button.jsx · Card.jsx · Modal.jsx · NameTag.jsx
└── index.js

src/pages/
├── Home.jsx · Home.styled.js
├── Home/                    # HomeMenu(+.styled), GuestStartModal, MbtiSelect, CreditsModal(+.styled)
├── Board.jsx · Board.styled.js
└── Board/                   # BoardList.styled, BoardEmptyState, UserDetailModal(+.styled)

src/components/
├── ImageGallery.jsx · ImageGallery.styled.js    # 목록
├── ImageViewer.jsx · ImageViewer.styled.js      # 뷰어
└── DetailRow.styled.js                           # 프로필·통계 카드가 공유하는 "라벨 - 값" 줄
```

## 공용 컴포넌트

`src/components/ui/`에서 import한다. 화면은 토큰과 이 컴포넌트만 조합한다.

| 컴포넌트  | 용도                                                                          | 주요 props                                                        |
| --------- | ----------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| `Button`  | 모든 버튼·버튼형 링크. 포커스 링 포함                                         | `variant`(primary, secondary, ghost), `size`(md, lg), `as={Link}` |
| `Card`    | 글라스 표면 카드                                                              | `padding`(md, lg)                                                 |
| `Modal`   | 오버레이 모달. dialog role·aria, Esc·바깥 클릭·닫기 버튼, 열릴 때 포커스 이동 | `title`, `onClose`, `children`, `maxWidth`                        |
| `NameTag` | 이름표 (대사창 화자 표시)                                                     | `name`                                                            |

## 장면 컴포넌트 (게임 플레이)

`src/components/scene/`에서 import한다. 색은 `dialogue`·`effect` 의미 토큰만 쓴다.

| 컴포넌트           | 용도                                                         |
| ------------------ | ------------------------------------------------------------ |
| `DialoguePlayer`   | 아래 부품을 조립. 탭·키 진행, 선택, 이어지는 대사, 장면 종료 |
| `SceneBackdrop`    | 배경 크로스페이드, 가독성 그라데이션, 장면 전환 막           |
| `CharacterSprite`  | 캐릭터 등장·교체·숨쉬기 (아래 기준, 화면 아래 고정)          |
| `AmbientEffect`    | 장소별 분위기 입자 (`rain`·`dust`·`petals`·`sparkle`)        |
| `DialogueBox`      | 화자 이름표(나레이션 제외) + 타이핑 본문 + 진행 표시         |
| `ChoiceList`       | 번호 배지 선택지. 점수·게임오버 여부는 노출하지 않음         |
| `PlayerControls`   | `자동`·`건너뛰기`·`지난 대사` 버튼                           |
| `DialogueLogModal` | 지난 대사 모달 (공용 `Modal` 기반)                           |

| 토큰 그룹  | 키                                          | 용도                        |
| ---------- | ------------------------------------------- | --------------------------- |
| `dialogue` | `box`, `narration`, `choice`, `choiceHover` | 대사창·나레이션·선택지 표면 |
| `effect`   | `rain`, `dust`, `petal`, `sparkle`, `veil`  | 분위기 입자·장면 전환 막    |

### 화면 층 구조

일반적인 미연시 배치를 따른다. `DialoguePlayer`는 세로로 쌓지 않고 겹치므로 선택지가 늘어나도
캐릭터와 대사창이 움직이지 않는다.

| 층  | 요소                     | 배치                                                       |
| --- | ------------------------ | ---------------------------------------------------------- |
| 1   | 배경·분위기 효과         | 화면 전체                                                  |
| 2   | 캐릭터 (`SpriteLayer`)   | 아래 끝을 화면 아래에 붙임, 화면 폭을 넘지 않음            |
| 3   | 선택지 (`ChoiceLayer`)   | 화면을 `overlay.dim`으로 누르고 가운데에 카드 (최대 560px) |
| 4   | 대사창 (`DialogueLayer`) | 아래 넓은 띠 (최대 1100px), 이름표는 위 모서리에 걸침      |
| 5   | 조작 버튼·로그·종료 슬롯 | 오른쪽 위·모달·가운데                                      |

캐릭터 그림은 **투명 배경 + 아래쪽이 그림 끝에 닿는 허리 위 세로 구도**로 만든다. 틀·그림자·위아래로
떠다니는 움직임은 쓰지 않는다 (공중에 뜬 스티커처럼 보임).

### 움직임 규칙

길이와 곡선은 `tokens.js`의 `motionSeconds`(quick 0.25 · base 0.45 · slow 0.7)와 `motionCurve.soft`
(빠르게 시작해 천천히 멈춤)만 쓴다.

| 대상    | 움직임                                                                                     |
| ------- | ------------------------------------------------------------------------------------------ |
| 캐릭터  | 아래에서 올라오며 페이드 인(slow), 교체는 같은 자리 크로스페이드, 대기 중 아래 기준 숨쉬기 |
| 이름표  | 화자가 바뀔 때만 옆으로 미끄러지며 교체(quick)                                             |
| 선택지  | 막과 함께 페이드 인, 카드가 순서대로 떠오르며 커짐(base), 고르면 즉시 사라짐               |
| 진행 점 | 줄이 다 나오면 아래로 까딱이며 깜빡임                                                      |

### 줄임 동작 규칙

`prefers-reduced-motion: reduce`이면 분위기 효과와 캐릭터 대기 움직임을 그리지 않고, 장면·배경
전환은 페이드만 쓴다. `DialoguePlayer`가 `MotionConfig reducedMotion="user"`와
`useReducedMotion`으로 한 곳에서 판단해 하위 컴포넌트에 `reduced`로 내려준다.

## 규칙 테스트

문서만으로는 규칙이 지켜지지 않아 **줄이기만 허용하는(ratchet) 테스트**로 강제한다.

- `src/designTokens.rules.test.js`가 `src/` 파일의 하드코딩 색상(`rgba(`, `#hex` 등)을 센다.
- `src/designTokens.baseline.json`에 파일별 허용 개수를 기록한다. 현재 합계 6.
- **새 파일은 0이어야 한다.** 기준치에 없는 파일에 하드코딩이 있으면 실패한다.
- 기존 파일이 늘면 실패한다. **줄었으면 같은 커밋에서 JSON도 낮춘다** (안 낮추면 실패).

## 토큰 체계 (2계층)

컴포넌트는 **의미 토큰만** 참조한다. 원시 토큰을 직접 쓰지 않는다.

| 파일                     | 역할                                                                                                                                                       |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/styles/tokens.js`   | **원시 토큰**. 팔레트·간격·반경·그림자·흐림·전환. 값 그 자체이며 "언제 쓰는지"는 말하지 않는다                                                             |
| `src/styles/semantic.js` | **의미 토큰**. `surface`·`text`·`border`·`action`·`feedback`·`rank`·`dialogue`·`effect`·`glass`·`overlay`·`focus`·`rankGlow`·`layer`. 이름이 용도를 말한다 |
| `src/styles/theme.js`    | 호환 레이어. 기존 컴포넌트가 쓰던 이름(`colors`, `glassmorphism` 등)을 유지하되 값은 전부 의미 토큰을 참조한다                                             |

### 왜 나눴나

`palette.lilac90`은 무슨 색인지만 알려주지만 `action.primary`는 **어디에 써야 하는지**를 알려준다.
이름에 용도가 없으면 새 컴포넌트를 만들 때 참조할 기준이 없어 결국 눈대중으로 `rgba`를 적게 된다.

### 어떻게 쓰나

```js
// 새 코드 — 의미 토큰을 직접 import
import { action, surface, text } from "../styles/semantic";

// 기존 코드 — theme.js 그대로 동작 (값은 의미 토큰을 참조)
import { colors, glassmorphism, media } from "../styles/theme";
```

색을 바꾸려면 `tokens.js`의 팔레트 한 곳만 고치면 의미 토큰과 호환 레이어를 타고 전체에 반영된다.

## 호환 레이어 토큰

`src/styles/theme.js` 기준이다.

### 색상

| 토큰                                | 값                                | 용도(추정)    |
| ----------------------------------- | --------------------------------- | ------------- |
| `colors.primary`                    | `rgba(200, 182, 226, 0.9)`        | 연보라 — 메인 |
| `colors.glassBg`                    | `rgba(0, 0, 0, 0.4)`              | 글라스 배경   |
| `colors.glassBorder`                | `rgba(255, 255, 255, 0.15)`       | 글라스 테두리 |
| `colors.textPrimary`                | `#ffffff`                         | 본문          |
| `colors.textSecondary`              | `rgba(255, 255, 255, 0.7)`        | 보조 텍스트   |
| `colors.textTertiary`               | `rgba(255, 255, 255, 0.6)`        | 부가 텍스트   |
| `colors.error`                      | `rgba(220, 53, 69, 0.9)`          | 에러          |
| `colors.warning`                    | `rgba(255, 193, 7, 0.9)`          | 경고          |
| `colors.success`                    | `rgba(40, 167, 69, 0.9)`          | 성공          |
| `colors.gold` / `silver` / `bronze` | `#FFD700` / `#C0C0C0` / `#CD7F32` | 랭킹 1·2·3위  |

### 글라스모피즘

이 프로젝트의 시각적 정체성이다. `glassmorphism` 객체로 정의되어 있다.

```
background: rgba(0, 0, 0, 0.4)
backdrop-filter: blur(15px)
border: 1px solid rgba(255, 255, 255, 0.15)
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5)
border-radius: 20px
```

### 브레이크포인트

| 이름      | 값       |
| --------- | -------- |
| `mobile`  | `480px`  |
| `tablet`  | `768px`  |
| `desktop` | `1024px` |
| `large`   | `1440px` |

`media` 헬퍼로 미디어 쿼리를 생성할 수 있다 (`media.mobile`, `media.tablet` 등). 그러나
대부분의 컴포넌트는 `@media (max-width: 768px)`를 직접 쓴다.

### z-index

| 토큰                  | 값     |
| --------------------- | ------ |
| `zIndex.base`         | `1`    |
| `zIndex.dropdown`     | `10`   |
| `zIndex.sticky`       | `100`  |
| `zIndex.scrollButton` | `100`  |
| `zIndex.modal`        | `1000` |
| `zIndex.galleryModal` | `1500` |
| `zIndex.imageViewer`  | `2000` |
| `zIndex.progressBar`  | `1000` |

### 애니메이션

`animations` 객체에 Framer Motion용 variant가 정의되어 있다 — `fadeIn`, `slideUp`,
`scaleIn`, `hover`, `tap`.

## 3해상도 점검 결과

토큰 이관 후 홈(진입 전/후)·시작 모달·크레딧·갤러리와 이미지 뷰어·랭킹(목록·빈 상태·상세 모달)·
프로필·게임오버·404를 3해상도에서 캡처했다. 잘림·겹침 없음, 브라우저 콘솔 경고·에러 0건.

| 해상도            | 결과              |
| ----------------- | ----------------- |
| 모바일 390×844    | ✅ 잘림·겹침 없음 |
| 태블릿 768×1024   | ✅ 잘림·겹침 없음 |
| 데스크톱 1280×800 | ✅ 잘림·겹침 없음 |

엔딩 화면은 #128에서 재구성한 뒤 같은 방식으로 점검한다.

### 점검 방법

캡처만으로는 "조금 잘렸는지"를 눈으로 판별하기 어렵다. 그래서 **측정**했다.

```js
[...document.querySelectorAll("*")].filter(
  (e) => e.getBoundingClientRect().right > window.innerWidth + 1
).length;
```

가로 스크롤 발생 여부(`scrollWidth > innerWidth`)와 함께 확인한다. `overflow: hidden`이
걸려 있으면 스크롤은 안 생기지만 요소는 여전히 화면 밖에 있으므로 둘 다 봐야 한다.

### 찾아서 고친 결함

**인트로 화면이 모바일에서 뷰포트를 벗어났다.**

구 인트로 컴포넌트(현재 `DialoguePlayer`로 교체되어 제거됨)의 `CharacterImage`가 모바일에서 `width: 500px` 고정이었고,
부모 `CharacterContainer`에 폭 제한이 없어 자식만큼 늘어났다. 390px 화면에서
컨테이너가 500px가 되어 레이아웃이 밀렸다.

부모에 `width: 100%`, 자식에 `max-width: 100%`를 넣어 해소했다.
`background-size: contain`이라 이미지 자체는 잘리지 않았기 때문에 **눈으로는 알아채기
어려운 결함**이었다.
