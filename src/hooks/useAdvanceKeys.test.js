import { renderHook } from "@testing-library/react";

import { useAdvanceKeys } from "./useAdvanceKeys";

const press = (key, { target = window, repeat = false } = {}) => {
  const event = new KeyboardEvent("keydown", { key, repeat, bubbles: true, cancelable: true });
  target.dispatchEvent(event);
  return event;
};

const setup = (overrides = {}) => {
  const handlers = { onAdvance: jest.fn(), onChoose: jest.fn() };
  const props = { enabled: true, choiceCount: 3, ...handlers, ...overrides };
  const view = renderHook(() => useAdvanceKeys(props));
  return { ...handlers, ...view };
};

describe("useAdvanceKeys", () => {
  it("Space·Enter는 onAdvance", () => {
    const { onAdvance } = setup();
    const spaceEvent = press(" ");
    press("Enter");
    expect(onAdvance).toHaveBeenCalledTimes(2);
    expect(spaceEvent.defaultPrevented).toBe(true);
  });

  it("숫자 2는 onChoose(1)", () => {
    const { onChoose } = setup();
    press("2");
    expect(onChoose).toHaveBeenCalledWith(1);
  });

  it("choiceCount 밖의 숫자는 무시", () => {
    const { onChoose } = setup({ choiceCount: 2 });
    press("3");
    press("5");
    press("a");
    expect(onChoose).not.toHaveBeenCalled();
  });

  it("버튼에 포커스된 Enter는 무시", () => {
    const { onAdvance } = setup();
    const button = document.body.appendChild(document.createElement("button"));
    press("Enter", { target: button });
    button.remove();
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("dialog 안의 키는 무시", () => {
    const { onAdvance } = setup();
    const dialog = document.body.appendChild(document.createElement("div"));
    dialog.setAttribute("role", "dialog");
    const inner = dialog.appendChild(document.createElement("span"));
    press(" ", { target: inner });
    dialog.remove();
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("enabled false면 무시", () => {
    const { onAdvance } = setup({ enabled: false });
    press("Enter");
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("repeat 키는 무시", () => {
    const { onAdvance } = setup();
    press("Enter", { repeat: true });
    expect(onAdvance).not.toHaveBeenCalled();
  });

  it("언마운트 후 리스너 제거", () => {
    const { onAdvance, unmount } = setup();
    unmount();
    press("Enter");
    expect(onAdvance).not.toHaveBeenCalled();
  });
});
