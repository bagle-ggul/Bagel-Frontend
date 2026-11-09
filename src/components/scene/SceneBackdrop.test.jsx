import { render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";

import SceneBackdrop from "./SceneBackdrop";

MotionGlobalConfig.skipAnimations = true;

describe("SceneBackdrop", () => {
  it("children을 그린다", () => {
    render(
      <SceneBackdrop src="/bg.webp" sceneKey="a" isReducedMotion={false}>
        <p>본문</p>
      </SceneBackdrop>
    );
    expect(screen.getByText("본문")).toBeInTheDocument();
  });

  it("배경 주소를 style로 건다", () => {
    render(<SceneBackdrop src="/bg.webp" sceneKey="a" isReducedMotion={false} />);
    expect(screen.getByTestId("scene-backdrop-image")).toHaveStyle({
      backgroundImage: 'url("/bg.webp")',
    });
  });
});
