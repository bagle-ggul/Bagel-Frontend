import TimeUtil from "./TimeUtil";

describe("TimeUtil.formatPlayTime", () => {
  it("60초 미만은 초만 표시한다", () => {
    expect(TimeUtil.formatPlayTime(45)).toBe("45초");
  });

  it("60초 이상은 분과 초로 나눠 표시한다", () => {
    expect(TimeUtil.formatPlayTime(125)).toBe("2분 5초");
  });

  it("정확히 분 단위면 나머지 초는 0으로 표시한다", () => {
    expect(TimeUtil.formatPlayTime(120)).toBe("2분 0초");
  });

  it("음수는 0초로 처리한다", () => {
    expect(TimeUtil.formatPlayTime(-10)).toBe("0초");
  });

  it("숫자가 아니면 0초로 처리한다", () => {
    expect(TimeUtil.formatPlayTime("abc")).toBe("0초");
  });
});

describe("TimeUtil.formatKoreanDate", () => {
  // 실행 환경 타임존에 따라 날짜가 하루 달라질 수 있어 값이 아닌 형식을 검증한다
  // (CI는 UTC, 로컬은 KST)
  it("ISO 문자열을 한국어 날짜로 변환한다", () => {
    expect(TimeUtil.formatKoreanDate("2026-07-27T10:30:00Z")).toMatch(
      /^\d{4}년 \d{1,2}월 \d{1,2}일$/
    );
  });

  it("유효하지 않은 날짜는 '알 수 없음'을 반환한다", () => {
    expect(TimeUtil.formatKoreanDate("not-a-date")).toBe("알 수 없음");
  });
});
