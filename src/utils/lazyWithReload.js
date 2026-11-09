import { lazy } from "react";

// sessionStorage: 청크 실패로 새로고침 1회 했는지 ("1"이면 이미 함)
export const CHUNK_RELOAD_GUARD_KEY = "bagel:chunkReloaded";

// 배포 후 옛 청크 이름이 사라졌을 때 나는 오류 문구 3종
const CHUNK_LOAD_ERROR_PATTERN =
  /ChunkLoadError|Loading (CSS )?chunk|Failed to fetch dynamically imported module/i;

/** 청크 로드 실패 여부 (이름 또는 문구로 판별) */
export const isChunkLoadError = (error) =>
  CHUNK_LOAD_ERROR_PATTERN.test(`${error?.name ?? ""} ${error?.message ?? ""}`);

// 저장소 막힘(사생활 모드 등)은 "이미 새로고침함"으로 간주 (무한 새로고침 방지)
const hasReloadedOnce = () => {
  try {
    return sessionStorage.getItem(CHUNK_RELOAD_GUARD_KEY) === "1";
  } catch {
    return true;
  }
};

const writeReloadGuard = (isReloaded) => {
  try {
    if (isReloaded) sessionStorage.setItem(CHUNK_RELOAD_GUARD_KEY, "1");
    else sessionStorage.removeItem(CHUNK_RELOAD_GUARD_KEY);
  } catch {
    // 저장 실패는 무시 (다음 실패에서 그대로 오류 노출)
  }
};

/**
 * 동적 import 감싸기: 성공 > 가드 해제, 청크 실패 첫 회 > 새로고침, 그 외·재실패 > 오류 전달
 */
export const loadWithReload = async (importer) => {
  try {
    const loadedModule = await importer();
    writeReloadGuard(false);
    return loadedModule;
  } catch (error) {
    if (!isChunkLoadError(error) || hasReloadedOnce()) throw error;
    writeReloadGuard(true);
    window.location.reload();
    // 새로고침 진행 중에는 404 화면이 잠깐 보이지 않게 대기
    return new Promise(() => {});
  }
};

/** React.lazy + 청크 실패 시 새로고침 1회 */
export const lazyWithReload = (importer) => lazy(() => loadWithReload(importer));

export default lazyWithReload;
