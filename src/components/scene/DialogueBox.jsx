import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import { dialogue, text } from "../../styles/semantic";
import { radius, spacing } from "../../styles/tokens";
import { NameTag } from "../ui";

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${spacing.sm};
`;

const Box = styled.div`
  position: relative;
  width: 100%;
  min-height: 96px;
  padding: ${spacing.lg} ${spacing.xl};
  background: ${dialogue.box};
  border-radius: ${radius.lg};
  color: ${({ $narration }) => ($narration ? dialogue.narration : text.primary)};
  font-style: ${({ $narration }) => ($narration ? "italic" : "normal")};
  font-size: 1.1rem;
  line-height: 1.7;
  white-space: pre-line;
`;

const ProgressDot = styled.span`
  position: absolute;
  right: ${spacing.lg};
  bottom: ${spacing.md};
  width: 8px;
  height: 8px;
  border-radius: ${radius.pill};
  background: ${text.accent};
  animation: ${blink} 1s infinite;
`;

/**
 * 대사창: 화자 이름표(나레이션 제외) + 타이핑 중인 본문 + 완료 시 진행 표시
 */
function DialogueBox({ line, visibleText, isDone }) {
  const isNarration = line.speakerId === "narration";
  return (
    <Wrapper>
      {!isNarration && <NameTag name={line.speakerName} />}
      <Box $narration={isNarration} aria-live="polite">
        {visibleText}
        {isDone && <ProgressDot aria-hidden="true" />}
      </Box>
    </Wrapper>
  );
}

DialogueBox.propTypes = {
  line: PropTypes.shape({
    speakerId: PropTypes.string.isRequired,
    speakerName: PropTypes.string.isRequired,
    text: PropTypes.string,
  }).isRequired,
  visibleText: PropTypes.string.isRequired,
  isDone: PropTypes.bool.isRequired,
};

export default DialogueBox;
