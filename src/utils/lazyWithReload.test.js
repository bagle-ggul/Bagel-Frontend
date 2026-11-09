import { CHUNK_RELOAD_GUARD_KEY, isChunkLoadError, loadWithReload } from "./lazyWithReload";

const createChunkError = () => {
  const error = new Error("Loading chunk 12 failed.");
  error.name = "ChunkLoadError";
  return error;
};

describe("lazyWithReload", () => {
  const originalLocation = window.location;
  let reloadMock;

  beforeEach(() => {
    sessionStorage.clear();
    reloadMock = jest.fn();
    delete window.location;
    window.location = { ...originalLocation, reload: reloadMock };
  });

  afterEach(() => {
    window.location = originalLocation;
  });

  it("성공하면 모듈을 돌려주고 가드를 지운다", async () => {
    sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, "1");
    const loadedModule = { default: () => null };
    await expect(loadWithReload(() => Promise.resolve(loadedModule))).resolves.toBe(loadedModule);
    expect(sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY)).toBeNull();
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("첫 청크 실패는 가드를 세우고 새로고침한다", async () => {
    loadWithReload(() => Promise.reject(createChunkError()));
    await Promise.resolve();
    await Promise.resolve();
    expect(reloadMock).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY)).toBe("1");
  });

  it("가드가 있으면 새로고침 없이 오류를 다시 던진다", async () => {
    sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, "1");
    const chunkError = createChunkError();
    await expect(loadWithReload(() => Promise.reject(chunkError))).rejects.toBe(chunkError);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it("청크 오류가 아니면 그대로 던진다", async () => {
    const otherError = new Error("boom");
    await expect(loadWithReload(() => Promise.reject(otherError))).rejects.toBe(otherError);
    expect(reloadMock).not.toHaveBeenCalled();
  });

  it.each([
    ["ChunkLoadError", "x", true],
    ["Error", "Loading CSS chunk 3 failed", true],
    ["TypeError", "Failed to fetch dynamically imported module: /a.js", true],
    ["Error", "network down", false],
  ])("isChunkLoadError(%s, %s) = %s", (name, message, expected) => {
    const error = new Error(message);
    error.name = name;
    expect(isChunkLoadError(error)).toBe(expected);
  });
});
