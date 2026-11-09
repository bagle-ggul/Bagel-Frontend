import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import styled, { css } from "styled-components";

import { radius, shadow } from "../../styles/tokens";

const ENTRANCE_SECONDS = 0.5;
const IDLE_LOOP_SECONDS = 6;

const Sprite = styled(motion.img)`
  height: min(52dvh, 27rem);
  max-width: 100%;
  object-fit: contain;
  pointer-events: none;

  ${({ $framed }) =>
    $framed &&
    css`
      border-radius: ${radius.lg};
      box-shadow: ${shadow.card};
    `}

  @media (max-width: 480px) {
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
        <Sprite
          key={src}
          src={src}
          alt={alt}
          $framed={framed}
          initial={{ y: 24, opacity: 0 }}
          animate={reduced ? { y: 0, opacity: 1 } : { y: [0, -4, 0], opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: ENTRANCE_SECONDS,
            y: reduced
              ? { duration: ENTRANCE_SECONDS }
              : { duration: IDLE_LOOP_SECONDS, repeat: Infinity, ease: "easeInOut" },
          }}
        />
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
