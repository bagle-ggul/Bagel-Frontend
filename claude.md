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

## 🏗️ 프로젝트 구조

### 기술 스택
- React 18.3.1 + styled-components 6.1.11
- framer-motion 11.2.4 (애니메이션)
- react-router-dom 6.23.1 (라우팅)
- axios 1.12.2 (API 통신)

### 주요 페이지
- `/` - Home (메인페이지)
- `/login` - 로그인
- `/signup` - 회원가입
- `/intro` - 게임 시작

### 배경 이미지
- 모든 페이지: `/img/image1.png`, `/img/image2.png`, `/img/image3.png`
- 3개 이미지가 grid로 배치됨

## 🎯 현재 작업
- **이슈 #65**: ✅ 완료 - 로그인/회원가입 페이지 모바일 반응성 개선 및 글라스모피즘 적용
- **목표**: ✅ 완료 - Home.jsx와 동일한 디자인 시스템 통일

### ✅ 완료된 개선 사항
- 로그인/회원가입 페이지 글라스모피즘 완전 적용
- 반응형 디자인 (768px, 480px 브레이크포인트)
- 뒤로가기 버튼 추가 (홈으로)
- **중앙 정렬 문제 해결**: width 단위 통일(rem), z-index 적용, overflow 처리
- 통일된 색상 시스템 적용
- UI 일관성 확보: 모든 페이지에서 동일한 디자인 시스템 적용

### 🔧 중앙 정렬 수정 사항
- **width 단위 통일**: px → rem (Home.jsx와 일치)
- **z-index 적용**: MainWrapper(100), BackButton(110)
- **overflow 처리**: Wrapper에 `overflow: hidden` 추가
- **모바일 최적화**: max-width 세분화로 반응형 개선

---
**⚠️ 업데이트 필요시**: 프로젝트 구조나 디자인 시스템 변경 시 이 문서를 업데이트하세요.