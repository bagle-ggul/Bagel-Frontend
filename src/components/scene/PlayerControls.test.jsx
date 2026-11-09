import { fireEvent, render, screen } from "@testing-library/react";

import PlayerControls from "./PlayerControls";

const setup = (props = {}) => {
  const handlers = { onModeChange: jest.fn(), onOpenLog: jest.fn() };
  render(<PlayerControls mode="manual" canSkip {...handlers} {...props} />);
  return handlers;
};

describe("PlayerControls", () => {
  it("자동을 누르면 onModeChange(auto)", () => {
    const { onModeChange } = setup();
    fireEvent.click(screen.getByRole("button", { name: "자동" }));
    expect(onModeChange).toHaveBeenCalledWith("auto");
  });

  it("켜진 자동을 다시 누르면 manual", () => {
    const { onModeChange } = setup({ mode: "auto" });
    fireEvent.click(screen.getByRole("button", { name: "자동" }));
    expect(onModeChange).toHaveBeenCalledWith("manual");
  });

  it("canSkip false면 건너뛰기 비활성", () => {
    setup({ canSkip: false });
    expect(screen.getByRole("button", { name: "건너뛰기" })).toBeDisabled();
  });

  it("showSkip false면 건너뛰기 없음", () => {
    setup({ showSkip: false });
    expect(screen.queryByRole("button", { name: "건너뛰기" })).toBeNull();
  });

  it("지난 대사를 누르면 onOpenLog", () => {
    const { onOpenLog } = setup();
    fireEvent.click(screen.getByRole("button", { name: "지난 대사" }));
    expect(onOpenLog).toHaveBeenCalled();
  });
});
