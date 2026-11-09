import { renderHook } from "@testing-library/react";

import { __resetPreloadedUrlsForTest, useImagePreload } from "./useImagePreload";

describe("useImagePreload", () => {
  const originalImage = global.Image;
  let requestedUrls;

  beforeEach(() => {
    __resetPreloadedUrlsForTest();
    requestedUrls = [];
    global.Image = function MockImage() {
      Object.defineProperty(this, "src", {
        set: (url) => requestedUrls.push(url),
      });
    };
  });
  afterEach(() => {
    global.Image = originalImage;
  });

  it("주소마다 한 번만 src를 건다", () => {
    const { rerender } = renderHook(({ urls }) => useImagePreload(urls), {
      initialProps: { urls: ["/a.webp", "/b.webp", "/a.webp"] },
    });
    rerender({ urls: ["/a.webp", "/c.webp"] });
    expect(requestedUrls).toEqual(["/a.webp", "/b.webp", "/c.webp"]);
  });

  it("빈 배열이면 아무것도 하지 않는다", () => {
    renderHook(() => useImagePreload([]));
    expect(requestedUrls).toEqual([]);
  });
});
