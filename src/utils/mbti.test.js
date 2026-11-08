import { combineMbti, EMPTY_MBTI_AXES, MBTI_AXIS_KEYS } from "./mbti";

describe("combineMbti", () => {
  it("4축을 모두 고르면 e > s > t > j 순서로 이어 붙인다", () => {
    expect(combineMbti({ e: "E", s: "N", t: "F", j: "P" })).toBe("ENFP");
    expect(combineMbti({ j: "J", t: "T", s: "S", e: "I" })).toBe("ISTJ");
  });

  it("하나라도 비어 있으면 빈 문자열을 돌려준다", () => {
    expect(combineMbti({ e: "E", s: "N", t: "F", j: "" })).toBe("");
    expect(combineMbti({ ...EMPTY_MBTI_AXES, e: "E" })).toBe("");
  });

  it("아무것도 고르지 않았거나 값이 없으면 빈 문자열이다", () => {
    expect(combineMbti(EMPTY_MBTI_AXES)).toBe("");
    expect(combineMbti(undefined)).toBe("");
    expect(combineMbti(null)).toBe("");
  });

  it("빈 축 객체의 키는 MBTI_AXIS_KEYS와 일치한다 (한쪽만 고쳐 어긋나는 것 방지)", () => {
    expect(Object.keys(EMPTY_MBTI_AXES)).toEqual(MBTI_AXIS_KEYS);
  });
});
