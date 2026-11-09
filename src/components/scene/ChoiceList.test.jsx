import { fireEvent, render, screen } from "@testing-library/react";

import ChoiceList from "./ChoiceList";

const choices = [
  { label: "첫째", score: 5, gameOver: false, followUp: [] },
  { label: "둘째", score: -9, gameOver: true, followUp: [] },
  { label: "셋째", score: 1, gameOver: false, followUp: [] },
];

describe("ChoiceList", () => {
  it("모든 선택지 버튼이 같은 class를 쓴다", () => {
    render(<ChoiceList choices={choices} onChoose={() => {}} />);
    const buttons = screen.getAllByRole("button");
    expect(new Set(buttons.map((button) => button.className)).size).toBe(1);
  });

  it("▶·⚠ 문자가 없다", () => {
    const { container } = render(<ChoiceList choices={choices} onChoose={() => {}} />);
    expect(container.textContent).not.toMatch(/[▶⚠]/);
  });

  it("누르면 onChoose(index)", () => {
    const onChoose = jest.fn();
    render(<ChoiceList choices={choices} onChoose={onChoose} />);
    fireEvent.click(screen.getByRole("button", { name: /둘째/ }));
    expect(onChoose).toHaveBeenCalledWith(1);
  });

  it("클릭이 부모로 전파되지 않는다", () => {
    const onParentClick = jest.fn();
    render(
      <div onClick={onParentClick}>
        <ChoiceList choices={choices} onChoose={() => {}} />
      </div>
    );
    fireEvent.click(screen.getByRole("button", { name: /첫째/ }));
    expect(onParentClick).not.toHaveBeenCalled();
  });
});
