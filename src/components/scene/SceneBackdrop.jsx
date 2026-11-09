import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import styled from "styled-components";

import { effect, overlay } from "../../styles/semantic";

const BACKGROUND_FADE_SECONDS = 0.8; // 배경 교체 크로스페이드
const VEIL_FADE_SECONDS = 0.5; // 장면 전환 막 걷기
const VEIL_FADE_REDUCED_SECONDS = 0.2;

const Stage = styled.div`
  position: relative;
  min-height: 100dvh;
  overflow: hidden;
`;

const BackgroundImage = styled(motion.div)`
  position: absolute;
  inset: 0;
  background-position: center;
  background-size: cover;
`;

// 아래쪽 대사창 가독성용 어둠
const Gradient = styled.div`
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, ${overlay.faint}, ${overlay.light});
  pointer-events: none;
`;

const Veil = styled(motion.div)`
  position: absolute;
  inset: 0;
  background: ${effect.veil};
  pointer-events: none;
`;

const Content = styled.div`
  position: relative;
  min-height: 100dvh;
`;

/**
 * 장면 배경: 배경 크로스페이드, 가독성 그라데이션, 장면 전환 막
 * 첫 진입은 검은 막에서 페이드 인
 */
function SceneBackdrop({ src, sceneKey, reduced, children }) {
  return (
    <Stage>
      <AnimatePresence initial={false}>
        <BackgroundImage
          key={src}
          data-testid="scene-backdrop-image"
          style={{ backgroundImage: `url("${src}")` }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: BACKGROUND_FADE_SECONDS }}
        />
      </AnimatePresence>
      <Gradient />
      <Veil
        key={sceneKey}
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: reduced ? VEIL_FADE_REDUCED_SECONDS : VEIL_FADE_SECONDS }}
      />
      <Content>{children}</Content>
    </Stage>
  );
}

SceneBackdrop.propTypes = {
  src: PropTypes.string.isRequired,
  sceneKey: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  reduced: PropTypes.bool.isRequired,
  children: PropTypes.node,
};

export default SceneBackdrop;
