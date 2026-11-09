import PropTypes from "prop-types";
import styled from "styled-components";

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
  const toggleMode = (targetMode) => onModeChange(mode === targetMode ? "manual" : targetMode);

  return (
    <Container onClick={(mouseEvent) => mouseEvent.stopPropagation()}>
      <Button
        type="button"
        variant="ghost"
        aria-pressed={mode === "auto"}
        onClick={() => toggleMode("auto")}
      >
        자동
      </Button>
      {showSkip && (
        <Button
          type="button"
          variant="ghost"
          aria-pressed={mode === "skip"}
          disabled={!canSkip && mode !== "skip"}
          onClick={() => toggleMode("skip")}
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
  mode: PropTypes.oneOf(["manual", "auto", "skip"]).isRequired,
  onModeChange: PropTypes.func.isRequired,
  canSkip: PropTypes.bool.isRequired,
  showSkip: PropTypes.bool,
  onOpenLog: PropTypes.func.isRequired,
};

export default PlayerControls;
