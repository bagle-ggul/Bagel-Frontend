import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import styled from "styled-components";

import { media } from "../../styles/theme";

const ENTRANCE_SECONDS = 0.5;
const ENTRANCE_OFFSET_PIXELS = 24; // 등장 시작 위치 (아래로, 화면 밖으로 잘려 틈 없음)
const BREATH_LOOP_SECONDS = 6;
const BREATH_SCALE_KEYFRAMES = [1, 1.006, 1]; // 대기 숨쉬기 (아래 기준 세로 배율)

// 바깥: 등장·교체 담당
const Entrance = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  height: 100%;
  pointer-events: none;
`;

// 안쪽: 숨쉬기 담당 (아래 기준이라 발밑이 뜨지 않음)
const Breath = styled(motion.div)`
  display: flex;
  align-items: flex-end;
  height: 100%;
  transform-origin: 50% 100%;
`;

// 허리 위 그림 > 화면 아래에 붙여 대사창 뒤에 서 있는 구도
const Sprite = styled.img`
  display: block;
  height: min(84dvh, 56rem);
  max-width: 100vw; // 가로로 넓은 그림은 화면 폭에 맞춰 줄임 (아래 정렬 유지 > 얼굴 잘림 방지)
  object-fit: contain;
  object-position: bottom;

  ${media.mobile} {
    height: min(72dvh, 36rem);
  }
`;

/**
 * 캐릭터 그림: 화면 아래 고정 > 등장(아래에서 올라오며 페이드 인), 교체 크로스페이드, 숨쉬기
 * src가 null이면 그리지 않음
 */
function CharacterSprite({ src, alt, reduced }) {
  return (
    <AnimatePresence mode="sync">
      {src && (
        <Entrance
          key={src}
          initial={{ y: ENTRANCE_OFFSET_PIXELS, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: ENTRANCE_SECONDS }}
        >
          <Breath
            data-testid="character-idle"
            data-idle={reduced ? "off" : "on"}
            animate={reduced ? { scaleY: 1 } : { scaleY: BREATH_SCALE_KEYFRAMES }}
            transition={
              reduced
                ? { duration: 0 }
                : { duration: BREATH_LOOP_SECONDS, repeat: Infinity, ease: "easeInOut" }
            }
          >
            <Sprite src={src} alt={alt} />
          </Breath>
        </Entrance>
      )}
    </AnimatePresence>
  );
}

CharacterSprite.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string.isRequired,
  reduced: PropTypes.bool.isRequired,
};

export default CharacterSprite;
