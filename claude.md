# Save Her 프로젝트 - 개발 컨텍스트

## 🔧 개발 가이드

### 새로운 컴포넌트 개발시

1. **공통 컴포넌트 우선 사용**

   ```jsx
   import GlassCard from "../components/GlassCard"; // 글라스모피즘 카드
   import ProfileContent from "../components/ProfileContent"; // 프로필 내용
   import StatsContent from "../components/StatsContent"; // 통계 내용
   ```

2. **테마 시스템 활용**

   ```jsx
   import { colors, glassmorphism, glassCard, buttons, componentStyles } from "../styles/theme";
   ```

3. **인증 관리**
   ```jsx
   import { getAuthToken, isAuthenticated, createApiHeaders } from "../utils/auth";
   ```

### 개발 원칙

- ✅ **기존 컴포넌트 재사용** - 새로 만들기 전에 `src/components/` 확인
- ✅ **테마 시스템 사용** - 직접 스타일링 대신 `src/styles/theme.js` 활용
- ✅ **통합 auth 유틸** - localStorage 직접 접근 대신 `src/utils/auth.js` 사용
- ❌ **console.log 금지** - 디버깅 로그는 개발 완료 후 제거
- ❌ **코드 중복 금지** - 같은 스타일/로직은 컴포넌트/유틸로 분리

## 🎨 디자인 시스템

### 색상 팔레트

```css
--primary: rgba(200, 182, 226, 0.9) /* 연보라 - 메인 컬러 */ --glass-bg: rgba(0, 0, 0, 0.4)
  /* 글라스모피즘 배경 */ --glass-border: rgba(255, 255, 255, 0.15) /* 글라스 테두리 */
  --text-primary: white /* 메인 텍스트 */ --text-secondary: rgba(255, 255, 255, 0.7)
  /* 보조 텍스트 */;
```

### 글라스모피즘 표준

```css
background: rgba(0, 0, 0, 0.4);
backdrop-filter: blur(15px);
border: 1px solid rgba(255, 255, 255, 0.15);
box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
border-radius: 20px;
```

### 반응형 브레이크포인트

```css
/* 데스크톱: 기본 */
@media (max-width: 768px) {
  /* 태블릿 */
}
@media (max-width: 480px) {
  /* 모바일 */
}
```

### 주요 페이지

- `/` - Home (메인페이지)
- `/login` - 로그인
- `/signup` - 회원가입
- `/intro` - 게임 시작

### 홈 배경 이미지

- 홈페이지: `/img/image1.png`, `/img/image2.png`, `/img/image3.png`
- 3개 이미지가 grid로 배치됨

### 코딩 컨벤션

- **Boolean 변수**: `is` 접두사 사용 (예: `isPasswordVisible`, `isLoading`)
- **아이콘**: Bootstrap Icons SVG 우선 사용 (`react-bootstrap-icons` 패키지)

### 이미지 명명법

- **구조**: `{카테고리}_{위치}_{상태}.png`
- **카테고리**: `bg_` (배경), `her_` (그녀), `mc_` (주인공)
- **위치**: `house`, `cafe`, `cave`, `beach`, `road`, `underwater` 등
- **상태**: `main`, `v1/v2/v3`, `high/mid/low`, `happy/sad/normal`

## 📁 프로젝트 구조

### 새로 생성된 표준 구조

```
src/
├── components/          # 재사용 가능한 컴포넌트
│   ├── GlassCard.jsx    # 글라스모피즘 카드 (공통)
│   ├── ProfileContent.jsx # 프로필 내용
│   └── StatsContent.jsx  # 게임 통계 내용
├── styles/
│   └── theme.js         # 통합 테마 시스템
└── utils/
    └── auth.js          # 인증 관리 유틸리티
```

### API 응답 구조

```json
{
  "totalScore": 265, // ✅ 총 획득 호감도
  "totalRegressionCount": 15, // ✅ 총 회귀수
  "characterName": "서새찬",
  "email": "chan4760@gmail.com"
}
```

---

<!- 해당 문구는 절때 삭제하지 마세요 -->
**⚠️ 업데이트 필요시**: 프로젝트 구조나 디자인 시스템 변경 시 이 문서를 업데이트하세요.
<!- 해당 문구는 절때 삭제하지 마세요 -->
