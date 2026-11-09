import PropTypes from "prop-types";
import styled, { css, keyframes } from "styled-components";

import { effect } from "../../styles/semantic";

import { buildParticles, PARTICLE_COUNT_BY_KIND } from "./ambientParticles";

const fallDown = keyframes`
  from { transform: translate3d(0, -10dvh, 0); opacity: 0; }
  10% { opacity: 1; }
  to { transform: translate3d(var(--drift), 110dvh, 0); opacity: 0.6; }
`;

const floatUp = keyframes`
  0%, 100% { transform: translate3d(0, 0, 0); opacity: 0; }
  50% { transform: translate3d(var(--drift), -6dvh, 0); opacity: 1; }
`;

const fallSpin = keyframes`
  from { transform: translate3d(0, -10dvh, 0) rotate(0deg); opacity: 0; }
  10% { opacity: 1; }
  to { transform: translate3d(var(--drift), 110dvh, 0) rotate(360deg); opacity: 0.7; }
`;

const twinkle = keyframes`
  0%, 100% { transform: scale(0.4); opacity: 0; }
  50% { transform: scale(1); opacity: 1; }
`;

// 종류별 입자 모양·움직임 (transform, opacity만 애니메이트)
const particleStyleByKind = {
  rain: css`
    width: 1px;
    height: calc(var(--size) * 12);
    background: ${effect.rain};
    top: 0;
    rotate: 12deg;
    animation-name: ${fallDown};
    animation-timing-function: linear;
  `,
  dust: css`
    bottom: 10%;
    border-radius: 50%;
    background: ${effect.dust};
    animation-name: ${floatUp};
    animation-timing-function: ease-in-out;
  `,
  petals: css`
    top: 0;
    border-radius: 80% 0 80% 0;
    background: ${effect.petal};
    animation-name: ${fallSpin};
    animation-timing-function: ease-in-out;
  `,
  sparkle: css`
    bottom: 0;
    border-radius: 50%;
    background: ${effect.sparkle};
    animation-name: ${twinkle};
    animation-timing-function: ease-in-out;
  `,
};

const Layer = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
`;

const Particle = styled.span`
  position: absolute;
  left: var(--left);
  width: var(--size);
  height: var(--size);
  animation-duration: var(--duration);
  animation-delay: var(--delay);
  animation-iteration-count: infinite;
  will-change: transform, opacity;
  ${({ $kind }) => particleStyleByKind[$kind]}

  /* 모바일은 절반만 (짝수 번째) */
  @media (max-width: 480px) {
    &:nth-child(odd) {
      display: none;
    }
  }
`;

/**
 * 장소별 분위기 효과: 비, 먼지, 꽃잎, 반짝임 입자 층
 * none이거나 줄임 동작이면 그리지 않음
 */
function AmbientEffect({ kind, reduced }) {
  const count = PARTICLE_COUNT_BY_KIND[kind];
  if (reduced || !count) return null;

  return (
    <Layer aria-hidden="true" data-testid="ambient-layer">
      {buildParticles(kind, count).map((particle, index) => (
        <Particle
          key={index}
          $kind={kind}
          data-testid="ambient-particle"
          style={{
            "--left": particle.left,
            "--delay": particle.delay,
            "--duration": particle.duration,
            "--size": particle.size,
            "--drift": particle.drift,
          }}
        />
      ))}
    </Layer>
  );
}

AmbientEffect.propTypes = {
  kind: PropTypes.oneOf(["rain", "dust", "petals", "sparkle", "none"]).isRequired,
  reduced: PropTypes.bool.isRequired,
};

export default AmbientEffect;
