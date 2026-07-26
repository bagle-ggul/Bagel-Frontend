import {
  PROGRESS_KEYS,
  canEnterStage,
  getMaxStage,
  getScore,
  isGameCompleted,
  markGameCompleted,
  markStageReached,
  resetProgress,
  setScore,
} from "./progress";

describe("progress 점수 저장", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("저장한 적이 없으면 0이다", () => {
    expect(getScore()).toBe(0);
  });

  it("점수를 저장하고 복원한다", () => {
    setScore(75);
    expect(getScore()).toBe(75);
  });

  it("0점도 정상 저장한다", () => {
    setScore(0);
    expect(getScore()).toBe(0);
  });

  // 저장소 값이 손상돼도 게임이 멈추면 안 된다
  it("숫자가 아닌 값이 저장돼 있으면 0으로 처리한다", () => {
    sessionStorage.setItem(PROGRESS_KEYS.SCORE, "abc");
    expect(getScore()).toBe(0);
  });
});

describe("progress 스테이지 진행도", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("시작 전에는 0이다", () => {
    expect(getMaxStage()).toBe(0);
  });

  it("도달한 스테이지를 기록한다", () => {
    markStageReached(3);
    expect(getMaxStage()).toBe(3);
  });

  // 뒤로가기로 이전 스테이지를 다시 봐도 진행도가 후퇴하면 안 된다
  it("더 낮은 스테이지를 방문해도 최대 도달치는 유지된다", () => {
    markStageReached(4);
    markStageReached(2);
    expect(getMaxStage()).toBe(4);
  });

  it("잘못된 값은 무시한다", () => {
    markStageReached(3);
    markStageReached(0);
    markStageReached(-1);
    markStageReached(NaN);
    expect(getMaxStage()).toBe(3);
  });
});

describe("progress 스테이지 진입 자격", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("첫 스테이지는 언제나 진입할 수 있다", () => {
    expect(canEnterStage(1)).toBe(true);
  });

  it("직전 스테이지를 마쳐야 다음으로 갈 수 있다", () => {
    markStageReached(1);
    expect(canEnterStage(2)).toBe(true);
    expect(canEnterStage(3)).toBe(false);
  });

  // URL 직접 입력으로 스토리를 건너뛰는 것을 막는다
  it("진행하지 않은 채 최종 스테이지로 갈 수 없다", () => {
    expect(canEnterStage(5)).toBe(false);
  });

  it("진행한 만큼은 자유롭게 오갈 수 있다", () => {
    markStageReached(4);
    expect(canEnterStage(2)).toBe(true);
    expect(canEnterStage(4)).toBe(true);
    expect(canEnterStage(5)).toBe(true);
  });
});

describe("progress 게임 완료", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("기본값은 미완료다", () => {
    expect(isGameCompleted()).toBe(false);
  });

  it("완료를 표시하면 참이 된다", () => {
    markGameCompleted();
    expect(isGameCompleted()).toBe(true);
  });
});

describe("progress 초기화", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  // 새 게임을 시작하면 이전 판의 흔적이 남으면 안 된다
  it("초기화하면 점수·진행도·완료 표시가 모두 사라진다", () => {
    setScore(120);
    markStageReached(5);
    markGameCompleted();

    resetProgress();

    expect(getScore()).toBe(0);
    expect(getMaxStage()).toBe(0);
    expect(isGameCompleted()).toBe(false);
    expect(canEnterStage(5)).toBe(false);
  });
});
