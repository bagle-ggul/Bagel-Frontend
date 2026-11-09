import { resetProgress } from "./progress";
import { clearSeenLines, isLineSeen, markLineSeen } from "./seenLines";

describe("seenLines", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("기록한 줄은 본 줄이다", () => {
    markLineSeen("s1:0:s:0");
    expect(isLineSeen("s1:0:s:0")).toBe(true);
  });

  it("기록 안 한 줄은 아니다", () => {
    markLineSeen("s1:0:s:0");
    expect(isLineSeen("s1:0:s:1")).toBe(false);
  });

  it("손상된 저장값이면 false", () => {
    sessionStorage.setItem("bagel:game:seenLines", "{broken");
    expect(isLineSeen("s1:0:s:0")).toBe(false);
  });

  it("clearSeenLines 후 false", () => {
    markLineSeen("s1:0:s:0");
    clearSeenLines();
    expect(isLineSeen("s1:0:s:0")).toBe(false);
  });

  it("같은 줄을 두 번 기록해도 한 번만 저장한다", () => {
    markLineSeen("a");
    markLineSeen("a");
    expect(JSON.parse(sessionStorage.getItem("bagel:game:seenLines"))).toEqual(["a"]);
  });

  it("resetProgress 뒤에도 남는다", () => {
    markLineSeen("s1:0:s:0");
    resetProgress();
    expect(isLineSeen("s1:0:s:0")).toBe(true);
  });

  describe("저장소 오류", () => {
    afterEach(() => jest.restoreAllMocks());

    it("setItem이 실패해도 던지지 않는다", () => {
      jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
        throw new DOMException("quota", "QuotaExceededError");
      });
      expect(() => markLineSeen("s1:0:s:0")).not.toThrow();
      expect(isLineSeen("s1:0:s:0")).toBe(false);
    });

    it("getItem이 실패하면 본 줄 없음", () => {
      jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
        throw new Error("blocked");
      });
      expect(isLineSeen("s1:0:s:0")).toBe(false);
      expect(() => markLineSeen("s1:0:s:0")).not.toThrow();
    });
  });
});
