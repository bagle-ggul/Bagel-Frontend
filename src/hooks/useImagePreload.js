import { useEffect } from "react";

// 이미 요청한 주소 (앱 전체에서 한 번만 요청)
const preloadedUrls = new Set();

/** 테스트 전용: 요청 기록 초기화 */
export function __resetPreloadedUrlsForTest() {
  preloadedUrls.clear();
}

/**
 * 이미지 미리 받기: 주소마다 new Image().src를 한 번만 설정
 */
export function useImagePreload(urls) {
  const urlsKey = urls.join("\u0000");

  useEffect(() => {
    urlsKey
      .split("\u0000")
      .filter(Boolean)
      .forEach((url) => {
        if (preloadedUrls.has(url)) return;
        preloadedUrls.add(url);
        new Image().src = url;
      });
  }, [urlsKey]);
}
