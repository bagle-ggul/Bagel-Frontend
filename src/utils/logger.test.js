describe("logger 환경별 동작", () => {
  const originalEnv = process.env.NODE_ENV;
  let spies;

  beforeEach(() => {
    jest.resetModules();
    spies = {
      log: jest.spyOn(console, "log").mockImplementation(() => {}),
      warn: jest.spyOn(console, "warn").mockImplementation(() => {}),
      info: jest.spyOn(console, "info").mockImplementation(() => {}),
      debug: jest.spyOn(console, "debug").mockImplementation(() => {}),
      error: jest.spyOn(console, "error").mockImplementation(() => {}),
    };
  });

  afterEach(() => {
    Object.values(spies).forEach((s) => s.mockRestore());
    process.env.NODE_ENV = originalEnv;
  });

  // NODE_ENV는 모듈 로드 시점에 평가되므로 resetModules 후 재import해야 한다
  const loadLogger = (env) => {
    process.env.NODE_ENV = env;
    let mod;
    jest.isolateModules(() => {
      mod = require("./logger");
    });
    return mod.logger;
  };

  it("개발 환경에서는 디버그 로그를 출력한다", () => {
    const logger = loadLogger("development");

    logger.log("메시지");
    logger.warn("경고");
    logger.info("정보");
    // eslint-disable-next-line testing-library/no-debugging-utils -- RTL의 screen.debug()가 아니라 로거 메서드다
    logger.debug("디버그");

    expect(spies.log).toHaveBeenCalledWith("메시지");
    expect(spies.warn).toHaveBeenCalledWith("경고");
    expect(spies.info).toHaveBeenCalledWith("정보");
    expect(spies.debug).toHaveBeenCalledWith("디버그");
  });

  // 프로덕션 빌드에 디버그 로그가 나가지 않아야 한다
  it("프로덕션에서는 디버그 로그를 무시한다", () => {
    const logger = loadLogger("production");

    logger.log("메시지");
    logger.warn("경고");
    logger.info("정보");
    // eslint-disable-next-line testing-library/no-debugging-utils -- RTL의 screen.debug()가 아니라 로거 메서드다
    logger.debug("디버그");

    expect(spies.log).not.toHaveBeenCalled();
    expect(spies.warn).not.toHaveBeenCalled();
    expect(spies.info).not.toHaveBeenCalled();
    expect(spies.debug).not.toHaveBeenCalled();
  });

  // 장애 추적에 필요하므로 error는 환경과 무관하게 출력한다
  it("error는 프로덕션에서도 출력한다", () => {
    const logger = loadLogger("production");

    logger.error("에러 발생");

    expect(spies.error).toHaveBeenCalledWith("에러 발생");
  });

  it("error는 개발 환경에서도 출력한다", () => {
    const logger = loadLogger("development");

    logger.error("에러 발생");

    expect(spies.error).toHaveBeenCalledWith("에러 발생");
  });
});
