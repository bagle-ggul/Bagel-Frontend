import { render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";

import CharacterSprite from "./CharacterSprite";

MotionGlobalConfig.skipAnimations = true;

describe("CharacterSprite", () => {
  it("src가 바뀌면 새 그림을 alt로 찾을 수 있다", () => {
    const { rerender } = render(<CharacterSprite src="/a.webp" alt="첫 그림" reduced={false} />);
    expect(screen.getByAltText("첫 그림")).toBeInTheDocument();
    rerender(<CharacterSprite src="/b.webp" alt="새 그림" reduced={false} />);
    expect(screen.getByAltText("새 그림")).toBeInTheDocument();
  });

  it("src가 null이면 img 없음", () => {
    render(<CharacterSprite src={null} alt="없음" reduced={false} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });
});
