import { toCss } from "./styleObject";

describe("toCss", () => {
  it("camelCase 속성을 kebab-case CSS 선언으로 바꾼다", () => {
    expect(toCss({ justifyContent: "space-between", backdropFilter: "blur(10px)" })).toBe(
      "justify-content: space-between; backdrop-filter: blur(10px);"
    );
  });

  it("이미 한 단어인 속성은 그대로 둔다", () => {
    expect(toCss({ display: "flex", padding: "1rem" })).toBe("display: flex; padding: 1rem;");
  });

  it("중첩된 hover 객체는 &:hover 블록으로 내보낸다", () => {
    const css = toCss({ background: "red", hover: { borderColor: "blue", transform: "scale(1)" } });

    expect(css).toContain("background: red;");
    expect(css).toContain("&:hover { border-color: blue; transform: scale(1); }");
  });

  it("중첩 객체가 기본 선언에 [object Object]로 새지 않는다", () => {
    expect(toCss({ color: "white", hover: { color: "black" } })).not.toContain("[object Object]");
    expect(toCss({ color: "white", nested: { a: 1 } })).toBe("color: white;");
  });

  it("값이 null이거나 객체가 없으면 빈 문자열이나 해당 속성을 건너뛴다", () => {
    expect(toCss(undefined)).toBe("");
    expect(toCss(null)).toBe("");
    expect(toCss({ color: null, display: "flex" })).toBe("display: flex;");
  });
});
