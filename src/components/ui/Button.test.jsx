import { fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter } from "react-router-dom";

import Button from "./Button";

describe("Button", () => {
  it.each(["primary", "secondary", "ghost"])("%s 변형을 렌더한다", (variant) => {
    render(<Button variant={variant}>확인</Button>);

    expect(screen.getByRole("button", { name: "확인" })).toBeInTheDocument();
  });

  it("as={Link}이면 a 태그로 렌더한다", () => {
    render(
      <MemoryRouter>
        <Button as={Link} to="/home">
          홈
        </Button>
      </MemoryRouter>
    );

    expect(screen.getByRole("link", { name: "홈" })).toHaveAttribute("href", "/home");
  });

  it("disabled면 클릭을 무시한다", () => {
    const onClick = jest.fn();
    render(
      <Button disabled onClick={onClick}>
        확인
      </Button>
    );

    fireEvent.click(screen.getByRole("button", { name: "확인" }));

    expect(onClick).not.toHaveBeenCalled();
  });
});
