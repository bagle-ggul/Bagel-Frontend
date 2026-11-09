import semantic, {
  action,
  border,
  dialogue,
  effect,
  feedback,
  focus,
  overlay,
  surface,
  text,
} from "./semantic";
import { palette } from "./tokens";

const paletteValues = new Set(Object.values(palette));

describe("의미 토큰", () => {
  it("모든 의미 토큰 값은 palette 값 중 하나다", () => {
    const groups = { surface, text, border, action, feedback, overlay, focus, dialogue, effect };
    Object.entries(groups).forEach(([groupName, group]) => {
      Object.entries(group).forEach(([tokenName, tokenValue]) => {
        expect({
          token: `${groupName}.${tokenName}`,
          isFromPalette: paletteValues.has(tokenValue),
        }).toEqual({
          token: `${groupName}.${tokenName}`,
          isFromPalette: true,
        });
      });
    });
  });

  it("overlay.modal은 rgba(0, 0, 0, 0.7)이다", () => {
    expect(overlay.modal).toBe("rgba(0, 0, 0, 0.7)");
  });

  it("overlay와 focus는 기본 export에 포함된다", () => {
    expect(semantic.overlay).toBe(overlay);
    expect(semantic.focus).toBe(focus);
  });
});
