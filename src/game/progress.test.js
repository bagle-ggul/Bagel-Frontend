import {
  PROGRESS_KEYS,
  canEnterStage,
  getChoiceHistory,
  getMaxStage,
  getRegressionCount,
  getScore,
  incrementRegressionCount,
  isGameCompleted,
  markGameCompleted,
  markStageReached,
  recordChoice,
  resetProgress,
  resetRunProgress,
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

  // 카페에서 돈을 주우면 동굴(3)을 건너뛰고 우산(4)으로 간다
  it("스테이지 2를 마치면 분기 목적지 3과 4 모두 들어갈 수 있다", () => {
    markStageReached(2);
    expect(canEnterStage(3)).toBe(true);
    expect(canEnterStage(4)).toBe(true);
    expect(canEnterStage(5)).toBe(false);
  });

  // 동굴(3)에서는 우산(4)을 거치지 않고 해변(5)으로 간다
  it("스테이지 3을 마치면 4를 거치지 않아도 5에 들어갈 수 있다", () => {
    markStageReached(3);
    expect(canEnterStage(5)).toBe(true);
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

describe("progress 고른 선택 기록", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("기록이 없으면 빈 목록이다", () => {
    expect(getChoiceHistory()).toEqual([]);
  });

  it("고른 순서대로 쌓인다", () => {
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 1, label: "일어난다" });
    recordChoice({ stage: 2, sceneIndex: 0, choiceIndex: 0, label: "라떼" });
    expect(getChoiceHistory()).toEqual([
      { stage: 1, sceneIndex: 0, choiceIndex: 1, label: "일어난다" },
      { stage: 2, sceneIndex: 0, choiceIndex: 0, label: "라떼" },
    ]);
  });

  // 같은 장면을 다시 고르면 최신 선택만 남는다
  it("같은 스테이지·장면은 덮어쓴다", () => {
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 0, label: "A" });
    recordChoice({ stage: 1, sceneIndex: 1, choiceIndex: 0, label: "B" });
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 2, label: "C" });
    expect(getChoiceHistory().map((entry) => entry.label)).toEqual(["B", "C"]);
  });

  it("손상된 값은 빈 목록으로 처리한다", () => {
    sessionStorage.setItem(PROGRESS_KEYS.CHOICE_HISTORY, "{oops");
    expect(getChoiceHistory()).toEqual([]);
    sessionStorage.setItem(PROGRESS_KEYS.CHOICE_HISTORY, "{}");
    expect(getChoiceHistory()).toEqual([]);
  });
});

describe("progress 회귀 횟수", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("기본값은 0이고 1씩 늘어난다", () => {
    expect(getRegressionCount()).toBe(0);
    incrementRegressionCount();
    incrementRegressionCount();
    expect(getRegressionCount()).toBe(2);
  });

  it("손상된 값은 0으로 처리한다", () => {
    sessionStorage.setItem(PROGRESS_KEYS.REGRESSION_COUNT, "abc");
    expect(getRegressionCount()).toBe(0);
  });

  it("회귀 재시작은 회차 상태만 지우고 회귀 횟수는 남긴다", () => {
    setScore(40);
    markStageReached(3);
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 0, label: "A" });
    incrementRegressionCount();

    resetRunProgress();

    expect(getScore()).toBe(0);
    expect(getMaxStage()).toBe(0);
    expect(getChoiceHistory()).toEqual([]);
    expect(getRegressionCount()).toBe(1);
  });

  it("새 게임 초기화는 회귀 횟수와 선택 기록까지 지운다", () => {
    recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 0, label: "A" });
    incrementRegressionCount();

    resetProgress();

    expect(getChoiceHistory()).toEqual([]);
    expect(getRegressionCount()).toBe(0);
  });

  // 저장소가 막혀도 게임은 계속된다
  it("저장소 쓰기 실패는 무시한다", () => {
    const setItemSpy = jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    expect(() => incrementRegressionCount()).not.toThrow();
    expect(() =>
      recordChoice({ stage: 1, sceneIndex: 0, choiceIndex: 0, label: "A" })
    ).not.toThrow();
    setItemSpy.mockRestore();
  });

  it("저장소 읽기 실패는 기본값으로 처리한다", () => {
    const getItemSpy = jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(getRegressionCount()).toBe(0);
    expect(getChoiceHistory()).toEqual([]);
    getItemSpy.mockRestore();
  });
});
