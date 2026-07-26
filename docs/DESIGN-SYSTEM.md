# 디자인 시스템

> **상태: Phase 3에서 확정 예정.** 이 문서는 현재 현황과 문제점을 기록한 것이며, 아직
> "지켜야 할 규격"이 아니다. Phase 3에서 실제 화면을 3해상도로 전수 점검한 뒤 토큰 체계를
> 재설계하고 이 문서를 확정한다.

## 현재 상태

### 토큰은 있지만 거의 쓰이지 않는다

`src/styles/theme.js`(194줄)에 색상·간격·z-index 토큰이 정의되어 있다. 그러나 **`src/` 전체에서
4개 파일만 이 파일을 import한다.** 나머지는 `rgba(...)` 값을 컴포넌트에 직접 쓴다.

같은 연보라색이 `theme.js`의 `colors.primary`로도, 여러 컴포넌트의 하드코딩된
`rgba(200, 182, 226, 0.9)`로도 존재한다. **한 곳을 바꿔도 다른 곳은 그대로 남는다.**

### 인라인 스타일과 styled-components 혼용

인라인 `style={{}}`이 36곳에 있다. 대부분 정적 값이라 styled-components로 옮길 수 있다.

| 파일                                       | 인라인 스타일 수 |
| ------------------------------------------ | ---------------- |
| `src/pages/Profile.jsx`                    | 16               |
| `src/pages/Board.jsx`                      | 5                |
| `src/components/ProfileContent.jsx`        | 4                |
| `src/components/GameUI/TypewriterText.jsx` | 4                |
| `src/pages/Home.jsx`                       | 2                |
| 그 외 5개 파일                             | 각 1             |

### 토큰에 의미가 없다

현재 `theme.js`의 토큰은 **값의 나열**이다. `colors.primary`가 무엇인지는 알 수 있지만,
"이 색을 언제 써야 하는가"는 정의되어 있지 않다. 그래서 새 컴포넌트를 만들 때 참조할
기준이 없고, 결국 눈대중으로 `rgba`를 적게 된다.

## 현재 정의된 토큰

`src/styles/theme.js` 기준이다.

### 색상

| 토큰                                | 값                                | 용도(추정)    |
| ----------------------------------- | --------------------------------- | ------------- |
| `colors.primary`                    | `rgba(200, 182, 226, 0.9)`        | 연보라 — 메인 |
| `colors.glassBg`                    | `rgba(0, 0, 0, 0.4)`              | 글라스 배경   |
| `colors.glassBorder`                | `rgba(255, 255, 255, 0.15)`       | 글라스 테두리 |
| `colors.textPrimary`                | `white`                           | 본문          |
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
| `zIndex.progressBar`  | `1000` |

### 애니메이션

`animations` 객체에 Framer Motion용 variant가 정의되어 있다 — `fadeIn`, `slideUp`,
`scaleIn`, `hover`, `tap`.

## Phase 3 계획

### 1. 전수 점검 (선행)

dev 서버를 띄우고 전 화면을 **3해상도**에서 캡처해 문제 목록을 만든다. **캡처 없이 추측으로
고치지 않는다.**

| 구분     | 해상도     |
| -------- | ---------- |
| 데스크톱 | 1440 × 900 |
| 태블릿   | 768 × 1024 |
| 모바일   | 390 × 844  |

대상: 홈(로그인 전/후), 로그인 모달, 회원가입 모달, 크레딧 모달, 이미지 갤러리, 인트로,
Main1~5, 결과, 엔딩 4종, 게임오버, 랭킹, 프로필, 404.

### 2. 토큰 2계층 재설계

- **원시 토큰** — 팔레트 원색, 간격 스케일, 폰트 크기 스케일, 반경, 그림자
- **의미 토큰** — `surface.glass`, `text.primary`, `border.subtle`, `action.primary` 등
  **용도 기반 이름**

컴포넌트는 **의미 토큰만** 참조한다. 그래야 "이 색을 언제 쓰는가"가 이름에 담긴다.

### 3. 적용

- 하드코딩된 `rgba` 값을 의미 토큰 참조로 교체
- 인라인 스타일 36곳을 styled-components/토큰으로 흡수 (동적 계산값은 예외 —
  [CONVENTIONS.md](CONVENTIONS.md) 참조)
- 브레이크포인트 하드코딩을 `media` 헬퍼로 교체

### 4. 대형 화면 분해

토큰 적용과 함께 진행한다. 파일이 크면 스타일 정리 자체가 불가능하다.

| 파일                              | 현재 줄 수 |
| --------------------------------- | ---------- |
| `src/pages/Home.jsx`              | 2193       |
| `src/pages/Board.jsx`             | 1043       |
| `src/components/ImageGallery.jsx` | 611        |
| `src/pages/Profile.jsx`           | 513        |

### 5. 검증

수정 후 동일 해상도에서 재캡처해 before/after를 비교한다. 3해상도 전 화면에서 레이아웃
깨짐 0이 완료 기준이다.
