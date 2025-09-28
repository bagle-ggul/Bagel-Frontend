# Save Her 프로젝트 - 개발 컨텍스트

## 🎨 디자인 시스템

### 색상 팔레트
```css
--primary: rgba(200, 182, 226, 0.9)     /* 연보라 - 메인 컬러 */
--glass-bg: rgba(0, 0, 0, 0.4)          /* 글라스모피즘 배경 */
--glass-border: rgba(255, 255, 255, 0.15) /* 글라스 테두리 */
--text-primary: white                    /* 메인 텍스트 */
--text-secondary: rgba(255, 255, 255, 0.7) /* 보조 텍스트 */
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
@media (max-width: 768px) { /* 태블릿 */ }
@media (max-width: 480px) { /* 모바일 */ }
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

---
**⚠️ 업데이트 필요시**: 프로젝트 구조나 디자인 시스템 변경 시 이 문서를 업데이트하세요.