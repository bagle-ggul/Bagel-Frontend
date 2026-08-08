import { getRefreshToken, setRefreshToken } from "./auth";
import axiosInstance from "./axios";

/**
 * 인터셉터 핸들러를 직접 꺼내 검증한다.
 * 실제 네트워크 호출 없이 "토큰이 주입되는가", "401에 올바르게 반응하는가"만 확인한다.
 */
const getRequestHandler = () => axiosInstance.interceptors.request.handlers[0];
const getResponseHandler = () => axiosInstance.interceptors.response.handlers[0];

describe("axios 인스턴스 설정", () => {
  it("타임아웃과 기본 헤더가 설정되어 있다", () => {
    expect(axiosInstance.defaults.timeout).toBe(10000);
    expect(axiosInstance.defaults.headers["Content-Type"]).toBe("application/json");
    expect(axiosInstance.defaults.withCredentials).toBe(true);
  });

  it("baseURL이 설정되어 있다", () => {
    expect(axiosInstance.defaults.baseURL).toBeTruthy();
  });
});

describe("axios 요청 인터셉터", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  // 이전에는 저장되지 않는 키(authToken)를 읽어 인터셉터가 사실상 죽어 있었다
  it("저장된 토큰을 Authorization 헤더로 주입한다", () => {
    setRefreshToken("refresh-abc");

    const config = getRequestHandler().fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer refresh-abc");
  });

  it("토큰이 없으면 Authorization 헤더를 붙이지 않는다", () => {
    const config = getRequestHandler().fulfilled({ headers: {} });

    expect(config.headers.Authorization).toBeUndefined();
  });

  it("요청 에러는 그대로 전파한다", async () => {
    const error = new Error("요청 실패");

    await expect(getRequestHandler().rejected(error)).rejects.toThrow("요청 실패");
  });
});

describe("axios 응답 인터셉터", () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
    delete window.location;
    window.location = { href: "" };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("정상 응답은 그대로 통과시킨다", () => {
    const response = { status: 200, data: { ok: true } };

    expect(getResponseHandler().fulfilled(response)).toBe(response);
  });

  // 로그인은 별도 라우트가 아니라 홈의 모달이므로 "/"가 목적지다
  it("401이면 토큰을 정리하고 홈으로 보낸다", async () => {
    setRefreshToken("refresh-abc");
    const error = { response: { status: 401 } };

    await expect(getResponseHandler().rejected(error)).rejects.toBe(error);

    expect(getRefreshToken()).toBeNull();
    expect(window.location.href).toBe("/");
  });

  // 이 서버는 잘못된/만료된 토큰에 403을 반환한다(실측).
  // 401만 처리하면 만료돼도 자동 로그아웃이 되지 않는다.
  it("403도 인증 실패로 보고 토큰을 정리한다", async () => {
    setRefreshToken("refresh-abc");
    const error = { response: { status: 403 } };

    await expect(getResponseHandler().rejected(error)).rejects.toBe(error);

    expect(getRefreshToken()).toBeNull();
    expect(window.location.href).toBe("/");
  });

  // 이미 로그아웃 상태인데 또 이동시키면 홈에서 리다이렉트가 반복된다
  it("토큰이 없으면 401/403이어도 이동시키지 않는다", async () => {
    const error = { response: { status: 401 } };

    await expect(getResponseHandler().rejected(error)).rejects.toBe(error);

    expect(window.location.href).toBe("");
  });

  it("인증 실패가 아닌 에러는 토큰을 건드리지 않는다", async () => {
    setRefreshToken("refresh-abc");
    const error = { response: { status: 500 } };

    await expect(getResponseHandler().rejected(error)).rejects.toBe(error);

    expect(getRefreshToken()).toBe("refresh-abc");
    expect(window.location.href).toBe("");
  });

  it("응답이 없는 네트워크 에러도 그대로 전파한다", async () => {
    const error = new Error("Network Error");

    await expect(getResponseHandler().rejected(error)).rejects.toThrow("Network Error");
  });
});
