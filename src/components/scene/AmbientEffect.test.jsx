import { render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";

import AmbientEffect from "./AmbientEffect";
import { buildParticles } from "./ambientParticles";

MotionGlobalConfig.skipAnimations = true;

describe("AmbientEffect", () => {
  it("rain은 입자 48개를 그린다", () => {
    render(<AmbientEffect kind="rain" reduced={false} />);
    expect(screen.getAllByTestId("ambient-particle")).toHaveLength(48);
  });

  it("none이면 아무것도 그리지 않는다", () => {
    render(<AmbientEffect kind="none" reduced={false} />);
    expect(screen.queryAllByTestId("ambient-particle")).toHaveLength(0);
  });

  it("reduced면 아무것도 그리지 않는다", () => {
    render(<AmbientEffect kind="dust" reduced />);
    expect(screen.queryAllByTestId("ambient-particle")).toHaveLength(0);
  });

  it("효과 층은 aria-hidden이다", () => {
    render(<AmbientEffect kind="petals" reduced={false} />);
    expect(screen.getByTestId("ambient-layer")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("buildParticles", () => {
  it("같은 입력이면 같은 결과", () => {
    expect(buildParticles("sparkle", 20)).toEqual(buildParticles("sparkle", 20));
  });
});
