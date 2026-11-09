import { render, screen } from "@testing-library/react";
import { MotionGlobalConfig } from "framer-motion";

import AmbientEffect from "./AmbientEffect";
import { buildParticles } from "./ambientParticles";

MotionGlobalConfig.skipAnimations = true;

describe("AmbientEffect", () => {
  it("rain은 입자 48개를 그린다", () => {
    render(<AmbientEffect kind="rain" isReducedMotion={false} />);
    expect(screen.getAllByTestId("ambient-particle")).toHaveLength(48);
  });

  it.each([
    ["dust", 24],
    ["petals", 18],
    ["sparkle", 20],
  ])("%s는 입자 %i개를 그린다", (kind, count) => {
    render(<AmbientEffect kind={kind} isReducedMotion={false} />);
    expect(screen.getAllByTestId("ambient-particle")).toHaveLength(count);
  });

  it("none이면 아무것도 그리지 않는다", () => {
    render(<AmbientEffect kind="none" isReducedMotion={false} />);
    expect(screen.queryAllByTestId("ambient-particle")).toHaveLength(0);
  });

  it("isReducedMotion면 아무것도 그리지 않는다", () => {
    render(<AmbientEffect kind="dust" isReducedMotion />);
    expect(screen.queryAllByTestId("ambient-particle")).toHaveLength(0);
  });

  it("효과 층은 aria-hidden이다", () => {
    render(<AmbientEffect kind="petals" isReducedMotion={false} />);
    expect(screen.getByTestId("ambient-layer")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("buildParticles", () => {
  it("반짝임은 모두 아래 1/3(33% 이하)에 놓인다", () => {
    buildParticles("sparkle", 20).forEach((particle) => {
      expect(parseFloat(particle.bottom)).toBeLessThanOrEqual(33);
    });
  });

  it("같은 입력이면 같은 결과", () => {
    expect(buildParticles("sparkle", 20)).toEqual(buildParticles("sparkle", 20));
  });
});
