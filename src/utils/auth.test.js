import {
  AUTH_TOKENS,
  clearTokens,
  createApiHeaders,
  getAccessToken,
  getAuthHeaders,
  getAuthToken,
  getRefreshToken,
  hasAuthToken,
  isAuthenticated,
  setAccessToken,
  setRefreshToken,
} from "./auth";

describe("auth 토큰 저장/조회", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("리프레시 토큰을 저장하고 조회한다", () => {
    setRefreshToken("refresh-abc");
    expect(getRefreshToken()).toBe("refresh-abc");
  });

  it("액세스 토큰을 저장하고 조회한다", () => {
    setAccessToken("access-abc");
    expect(getAccessToken()).toBe("access-abc");
  });

  it("토큰에 falsy 값을 넣으면 저장하지 않고 제거한다", () => {
    setRefreshToken("refresh-abc");
    setRefreshToken(null);
    expect(getRefreshToken()).toBeNull();
  });

  it("저장된 토큰이 없으면 null을 반환한다", () => {
    expect(getRefreshToken()).toBeNull();
    expect(getAccessToken()).toBeNull();
  });
});

describe("auth 인증 토큰 선택", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 이 프로젝트는 API 인증에 refreshToken을 사용한다.
  // 이름과 실제 역할이 어긋나 있어 명시적으로 검증한다.
  it("API 인증에는 refreshToken을 사용한다", () => {
    setRefreshToken("refresh-abc");
    setAccessToken("access-xyz");
    expect(getAuthToken()).toBe("refresh-abc");
  });
});

describe("auth 인증 상태 판정", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("토큰이 없으면 미인증이다", () => {
    expect(isAuthenticated()).toBe(false);
    expect(hasAuthToken()).toBe(false);
  });

  it("토큰이 있으면 인증 상태다", () => {
    setRefreshToken("refresh-abc");
    expect(isAuthenticated()).toBe(true);
    expect(hasAuthToken()).toBe(true);
  });
});

describe("auth 토큰 정리", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("로그아웃 시 두 토큰을 모두 제거한다", () => {
    setRefreshToken("refresh-abc");
    setAccessToken("access-xyz");

    clearTokens();

    expect(getRefreshToken()).toBeNull();
    expect(getAccessToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});

describe("auth 헤더 생성", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("토큰이 없으면 Authorization 헤더를 만들지 않는다", () => {
    expect(getAuthHeaders()).toBeNull();
  });

  it("토큰이 있으면 Bearer 형식으로 만든다", () => {
    setRefreshToken("refresh-abc");
    expect(getAuthHeaders()).toEqual({ Authorization: "Bearer refresh-abc" });
  });

  it("API 헤더에 Content-Type과 인증 헤더가 함께 들어간다", () => {
    setRefreshToken("refresh-abc");
    expect(createApiHeaders()).toEqual({
      "Content-Type": "application/json",
      Authorization: "Bearer refresh-abc",
    });
  });

  it("추가 헤더를 병합한다", () => {
    const headers = createApiHeaders({ "X-Custom": "value" });
    expect(headers["X-Custom"]).toBe("value");
    expect(headers["Content-Type"]).toBe("application/json");
  });
});

describe("auth 저장 키", () => {
  it("토큰 키 상수가 정의되어 있다", () => {
    expect(AUTH_TOKENS.ACCESS_TOKEN).toBe("accessToken");
    expect(AUTH_TOKENS.REFRESH_TOKEN).toBe("refreshToken");
  });
});
