import {
  STORAGE_KEYS,
  isAutoPlayPreferred,
  isMusicMuted,
  setAutoPlayPreferred,
  setMusicMuted,
} from "./storage";

describe("storage 음소거 설정", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("설정한 적이 없으면 음소거가 아니다", () => {
    expect(isMusicMuted()).toBe(false);
  });

  it("음소거를 켜고 끌 수 있다", () => {
    setMusicMuted(true);
    expect(isMusicMuted()).toBe(true);

    setMusicMuted(false);
    expect(isMusicMuted()).toBe(false);
  });

  // localStorage는 문자열만 저장하므로 boolean 변환이 정확해야 한다
  it("boolean을 문자열로 저장한다", () => {
    setMusicMuted(true);
    expect(localStorage.getItem(STORAGE_KEYS.MUSIC_MUTED)).toBe("true");

    setMusicMuted(false);
    expect(localStorage.getItem(STORAGE_KEYS.MUSIC_MUTED)).toBe("false");
  });

  it("'true' 외의 값은 음소거가 아닌 것으로 본다", () => {
    localStorage.setItem(STORAGE_KEYS.MUSIC_MUTED, "yes");
    expect(isMusicMuted()).toBe(false);
  });
});

describe("storage 자동 진행 선호", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.restoreAllMocks();
  });

  it("설정한 적이 없으면 수동 진행이다", () => {
    expect(isAutoPlayPreferred()).toBe(false);
  });

  it("자동 진행을 켜고 끌 수 있다", () => {
    setAutoPlayPreferred(true);
    expect(isAutoPlayPreferred()).toBe(true);
    setAutoPlayPreferred(false);
    expect(isAutoPlayPreferred()).toBe(false);
  });

  it("저장소가 막혀 있으면 수동으로 보고 저장 실패를 삼킨다", () => {
    jest.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("blocked");
    });
    expect(isAutoPlayPreferred()).toBe(false);
    expect(() => setAutoPlayPreferred(true)).not.toThrow();
  });
});
