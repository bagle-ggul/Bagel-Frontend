# Bagel-Frontend · 작업 규칙

React 18 + CRA 기반 인터랙티브 비주얼 노벨 게임. 플레이어의 선택이 점수로 누적되어
스토리 분기와 엔딩을 결정한다.

> **⚠️ 프로젝트 이름이 5곳에서 서로 다르다 (결정 대기)**
>
> | 위치                              | 이름                  |
> | --------------------------------- | --------------------- |
> | 실제 화면 (`src/pages/Home.jsx`)  | **Re: WAVE**          |
> | 브라우저 탭 (`public/index.html`) | Save Her - Game       |
> | PWA (`public/manifest.json`)      | Save Her Game         |
> | `README.md`                       | BAGEL - 그녀를 구하라 |
> | `package.json`                    | bagle                 |
>
> 사용자에게 보이는 이름만 **두 개**다 — 탭에는 "Save Her", 화면에는 "Re: WAVE".
> 어느 것이 정식 명칭인지 확인 후 Phase 5에서 통일한다. 그 전까지 이 문서는 저장소
> 이름(`Bagel-Frontend`)을 쓴다.

**설계·구조 내용은 이 문서에 쓰지 않는다.** 아래 문서 표를 참조한다. 이 문서는
**작업 절차와 규칙**만 담는다.

## 문서 위치

| 찾는 것                                  | 문서                                           |
| ---------------------------------------- | ---------------------------------------------- |
| 디렉토리 구조 · 라우팅 · 상태 관리 · API | [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)   |
| 코딩 컨벤션 (네이밍, 파일 분할, 주석)    | [docs/CONVENTIONS.md](docs/CONVENTIONS.md)     |
| 테스트 작성법 · 커버리지 기준            | [docs/TESTING.md](docs/TESTING.md)             |
| 디자인 토큰 · 반응형                     | [docs/DESIGN-SYSTEM.md](docs/DESIGN-SYSTEM.md) |
| 게임 분기 구조 · 점수 임계치             | [docs/GAME-FLOW.md](docs/GAME-FLOW.md)         |
| 문서 전체 인덱스                         | [docs/README.md](docs/README.md)               |
| 진행 중인 리팩토링 설계                  | `docs/superpowers/specs/`                      |
| 구현 계획                                | `docs/superpowers/plans/`                      |

## 작업 파이프라인

```
설계 → 이슈 작성 → 구현 → 검증 → 커밋 → 푸시 → main 최신화 → 배포 → 완료 보고서 → 라벨 완료처리
```

| 단계          | 도구                         | 비고                                                                                |
| ------------- | ---------------------------- | ----------------------------------------------------------------------------------- |
| 설계          | `/superpowers:brainstorming` | 기능 추가·리팩터링 등 창작이 필요한 작업. 스펙은 `docs/superpowers/specs/`에 남긴다 |
| 이슈 작성     | `/pro-github`                | 템플릿 규격 준수. 브랜치명도 여기서 계산. 라벨을 `작업 중`으로                      |
| 구현          | —                            | 이슈 번호 기반 브랜치. 시작 전 `git pull --rebase`                                  |
| 검증          | —                            | 아래 품질 게이트. **통과 확인 전 "완료"라고 말하지 않는다**                         |
| 커밋          | `/pro-commit`                | 브랜치명에서 이슈 번호 자동 추출                                                    |
| 푸시          | —                            | 사용자가 명시적으로 요청·위임한 경우에만                                            |
| main 최신화   | —                            | 배포 전 `git fetch origin` 후 `origin/main` 병합                                    |
| 배포          | `/pro-changelog-deploy`      | **main push만으로는 배포되지 않는다** (아래 참조)                                   |
| 완료 보고서   | `/pro-report`                | 생략하지 않는다. 손으로 댓글 다는 것으로 대체하지 않는다                            |
| 라벨 완료처리 | `/pro-github`                | `set-labels`로 전체 교체. **이슈는 닫지 않는다**                                    |

### 배포 트리거

`main`에 push한다고 배포되지 않는다. main push는 **버전 자동 증가와 CI까지만** 트리거하며,
실제 배포는 **`deploy` 브랜치 push**가 트리거한다 (`.github/workflows/FRONTEND-CICD.yaml`).

## 품질 게이트

커밋 전 다음을 실행한다.

```bash
npm run format:check   # 포맷
npm run lint           # 린트
npm run test:ci        # 테스트 + 커버리지
CI=false npm run build # 빌드
```

**현재 상태 (Phase 1 완료 시점)**

**네 가지 모두 통과해야 커밋할 수 있다.** Phase 1부터 CI가 실제 차단 게이트로 동작한다.

| 명령           | 기대 결과                            |
| -------------- | ------------------------------------ |
| `format:check` | 통과                                 |
| `lint`         | 통과 (위반 0건)                      |
| `test:ci`      | 통과 (utils·hooks 커버리지 80% 이상) |
| `build`        | 통과                                 |

린트는 빌드에서 분리되어 있다. 이유는 [docs/CONVENTIONS.md](docs/CONVENTIONS.md) 참조.

## 금지 사항

- **`main` 브랜치에 직접 커밋하지 않는다** — 이슈 번호 기반 브랜치에서 작업한다
- **`git add -A` 금지** — 건드린 경로만 명시적으로 스테이징한다. 다른 세션이 동시에 작업
  중일 수 있다
- **force push 금지** — non-fast-forward면 rebase로 통합한다
- **`git push`는 사용자 허락 시에만** — 명시적으로 요청·위임받은 경우에만 실행한다
- **파일 삭제 시 사용자 승인 필수** — 확인 없이 삭제하지 않는다
- **검증 통과 확인 전 "완료" 보고 금지**
- **커밋에 AI 서명 금지** — `Co-Authored-By`, `Generated with Claude` 등을 넣지 않는다
- **`gh` CLI 사용 금지** — GitHub 작업은 `/pro-github`으로 처리한다
- **`console.*` 금지** — ESLint가 막는다. 로거를 쓴다

## 진행 중인 작업: 전면 표준화 리팩토링

이 프로젝트는 리팩토링이 중단된 상태였다. 신구 구현이 병존해 어느 쪽이 정답인지 코드만
봐서는 판단할 수 없었고, 품질 기준이 문서에만 있고 강제되지 않았다.

**설계 스펙**: `docs/superpowers/specs/2026-07-27-codebase-standardization-design.md`

| Phase | 내용                                   | 상태     |
| ----- | -------------------------------------- | -------- |
| 0     | 코드 품질 체계 및 문서 구조 확립       | **완료** |
| 1     | 인증/API 레이어 통일 및 레거시 제거    | **완료** |
| 2     | 게임 라우팅 및 진행 상태 정합성 수정   | **완료** |
| 3     | 디자인 시스템 재확립 및 대형 화면 분해 | 예정     |
| 4     | 스토리 분기 엔진 데이터화              | 예정     |
| 5     | 문서 최종 동기화 및 배포               | 예정     |

각 Phase는 **1 이슈 = 1 브랜치 = 1 PR**로 진행한다.

### Phase 0에서 확립된 것

- ESLint 강제 룰 — `console` 금지, `localStorage` 직접 접근 금지(`auth.js` 경유 강제),
  `axios` 직접 import 금지(인스턴스 강제), import 정렬
- Prettier + EditorConfig — 인코딩(UTF-8)·개행(LF) 고정으로 파일 손상 재발 방지
- 테스트 3계층 체계 + `utils`/`hooks` 커버리지 80% 게이트
- CI가 린트·테스트를 실제로 실행 (Phase 0에서는 보고만, Phase 1부터 차단)
- `docs/` 문서 체계

## 새 코드를 쓸 때

1. **기존 컴포넌트를 먼저 확인한다** — `src/components/` 를 보고 새로 만들지 판단
2. **테마 토큰을 쓴다** — 색상을 직접 쓰지 않는다 (`src/styles/theme.js`)
3. **인증은 `src/utils/auth.js`를 경유한다** — `localStorage` 직접 접근은 ESLint가 막는다
4. **HTTP는 axios 인스턴스를 쓴다** — `axios` 패키지 직접 import는 ESLint가 막는다
5. **테스트를 함께 쓴다** — [docs/TESTING.md](docs/TESTING.md)

---

<!- 해당 문구는 절때 삭제하지 마세요 -->

**⚠️ 업데이트 필요시**: 구조나 규칙이 바뀌면 이 문서와 `docs/`의 해당 문서를 **같은 PR에서**
갱신한다. 문서가 코드와 어긋나면 없느니만 못하다.

<!- 해당 문구는 절때 삭제하지 마세요 -->
