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

describe("TimeUtil.getRelativeTime", () => {
  // 현재 시각 기준 상대값이므로 Date.now()에서 역산한 시각을 넘긴다
  const agoISO = (ms) => new Date(Date.now() - ms).toISOString();

  const MINUTE = 60 * 1000;
  const HOUR = 60 * MINUTE;
  const DAY = 24 * HOUR;

  it("1분 미만은 '방금 전'으로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(10 * 1000))).toBe("방금 전");
  });

  it("분 단위로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(5 * MINUTE))).toBe("5분 전");
  });

  it("시간 단위로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(3 * HOUR))).toBe("3시간 전");
  });

  it("일 단위로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(2 * DAY))).toBe("2일 전");
  });

  it("주 단위로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(14 * DAY))).toBe("2주 전");
  });

  it("개월 단위로 표시한다", () => {
    expect(TimeUtil.getRelativeTime(agoISO(60 * DAY))).toBe("2개월 전");
  });

  it("유효하지 않은 날짜는 '알 수 없음'을 반환한다", () => {
    expect(TimeUtil.getRelativeTime("not-a-date")).toBe("알 수 없음");
  });

  // new Date(null)은 1970-01-01로 해석되어 "유효한 날짜"가 된다.
  // 따라서 "알 수 없음"이 아니라 개월 단위 값이 나온다.
  // 현재 null을 넘기는 호출부는 없으나, 명시적 null 처리를 추가하면 더 안전하다.
  it("null은 1970년으로 해석되어 개월 단위 값을 반환한다", () => {
    expect(TimeUtil.getRelativeTime(null)).toMatch(/^\d+개월 전$/);
  });
});

describe("TimeUtil.formatDetailedDateTime", () => {
  // 타임존에 따라 값이 달라지므로 형식만 검증한다
  it("ISO 문자열을 상세 일시로 변환한다", () => {
    expect(TimeUtil.formatDetailedDateTime("2026-07-27T10:30:00Z")).toMatch(
      /^\d{4}년 \d{1,2}월 \d{1,2}일 \d{1,2}시 \d{2}분$/
    );
  });

  it("분은 두 자리로 채운다", () => {
    const result = TimeUtil.formatDetailedDateTime("2026-07-27T10:05:00Z");
    expect(result).toMatch(/\d{2}분$/);
  });

  it("유효하지 않은 날짜는 '알 수 없음'을 반환한다", () => {
    expect(TimeUtil.formatDetailedDateTime("invalid")).toBe("알 수 없음");
  });
});
