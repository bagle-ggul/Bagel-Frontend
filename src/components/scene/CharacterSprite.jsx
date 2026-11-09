import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { media } from "../../styles/theme";
import { radius, shadow } from "../../styles/tokens";

const ENTRANCE_SECONDS = 0.5;
const IDLE_LOOP_SECONDS = 6;
const IDLE_FLOAT_KEYFRAMES = [0, -4, 0]; // 대기 위아래 흔들림 (px)

// 바깥: 등장·교체 담당
const Entrance = styled(motion.div)`
  pointer-events: none;
`;

// 안쪽: 대기 움직임 담당 (등장 y와 키프레임이 충돌하지 않도록 분리)
const Idle = styled(motion.div)`
  display: flex;
`;

const Sprite = styled.img`
  height: min(52dvh, 27rem);
  max-width: 100%;
  object-fit: contain;

  ${({ $framed }) =>
    $framed &&
    css`
      border-radius: ${radius.lg};
      box-shadow: ${shadow.card};
    `}

  ${media.mobile} {
    height: min(38dvh, 16rem);
  }
`;

/**
 * 캐릭터 그림: 등장(아래에서 위로 페이드 인), 교체 크로스페이드, 대기 움직임
 * src가 null이면 그리지 않음
 */
function CharacterSprite({ src, alt, framed = true, reduced }) {
  return (
    <AnimatePresence mode="sync">
      {src && (
        <Entrance
          key={src}
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ENTRANCE_SECONDS }}
        >
          <Idle
            data-testid="character-idle"
            data-idle={reduced ? "off" : "on"}
            animate={reduced ? { y: 0 } : { y: IDLE_FLOAT_KEYFRAMES }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: IDLE_LOOP_SECONDS, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Sprite src={src} alt={alt} $framed={framed} />
          </Idle>
        </Entrance>
      )}
    </AnimatePresence>
  );
}

CharacterSprite.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  framed: PropTypes.bool,
  reduced: PropTypes.bool.isRequired,
};

export default CharacterSprite;
