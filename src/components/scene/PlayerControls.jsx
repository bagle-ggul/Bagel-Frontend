import PropTypes from "prop-types";
import styled from "styled-components";

import { PLAY_MODE, PLAY_MODES } from "../../game/playMode";
import { layer, surface } from "../../styles/semantic";
import { spacing } from "../../styles/tokens";
import { Button } from "../ui";

const Container = styled.div`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  z-index: ${layer.dropdown};
  display: flex;
  gap: ${spacing.sm};

  button {
    background: ${surface.control};
  }
`;

/**
 * 조작 버튼: 자동, 건너뛰기, 지난 대사 (같은 모드를 다시 누르면 manual)
 */
function PlayerControls({ mode, onModeChange, canSkip, showSkip = true, onOpenLog }) {
  // 누른 버튼 포커스 해제 (버튼 위 Space는 진행 키로 인정되지 않음)
  const toggleMode = (mouseEvent, targetMode) => {
    mouseEvent.currentTarget.blur();
    onModeChange(mode === targetMode ? PLAY_MODE.MANUAL : targetMode);
  };

  return (
    <Container onClick={(mouseEvent) => mouseEvent.stopPropagation()}>
      <Button
        type="button"
        variant="ghost"
        aria-pressed={mode === PLAY_MODE.AUTO}
        onClick={(mouseEvent) => toggleMode(mouseEvent, PLAY_MODE.AUTO)}
      >
        자동
      </Button>
      {showSkip && (
        <Button
          type="button"
          variant="ghost"
          aria-pressed={mode === PLAY_MODE.SKIP}
          disabled={!canSkip && mode !== PLAY_MODE.SKIP}
          onClick={(mouseEvent) => toggleMode(mouseEvent, PLAY_MODE.SKIP)}
        >
          건너뛰기
        </Button>
      )}
      <Button type="button" variant="ghost" onClick={onOpenLog}>
        지난 대사
      </Button>
    </Container>
  );
}

PlayerControls.propTypes = {
  mode: PropTypes.oneOf(PLAY_MODES).isRequired,
  onModeChange: PropTypes.func.isRequired,
  canSkip: PropTypes.bool.isRequired,
  showSkip: PropTypes.bool,
  onOpenLog: PropTypes.func.isRequired,
};

export default PlayerControls;
