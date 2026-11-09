import { AnimatePresence, motion } from "framer-motion";
import PropTypes from "prop-types";
import styled, { keyframes } from "styled-components";

import { SPEAKER } from "../../game/dialogueScript";
import { border, dialogue, text } from "../../styles/semantic";
import { media } from "../../styles/theme";
import { blur, motionCurve, motionSeconds, radius, shadow, spacing } from "../../styles/tokens";
import { NameTag, VisuallyHidden } from "../ui";

const blink = keyframes`
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.35; transform: translateY(2px); }
`;

// 이름표가 대사창 위 모서리에 걸치도록 겹침
const Wrapper = styled.div`
  position: relative;
  padding-top: ${spacing.md};
`;

const NameTagSlot = styled(motion.div)`
  position: absolute;
  top: 0;
  left: ${spacing.xl};
  z-index: 1;

  ${media.mobile} {
    left: ${spacing.lg};
  }
`;

// 화면 아래 넓은 띠 (높이 고정 > 줄 수가 바뀌어도 들썩이지 않음)
const Box = styled.div`
  position: relative;
  width: 100%;
  min-height: 8.5rem;
  padding: ${spacing.xl} ${spacing.xl} ${spacing.lg};
  background: ${dialogue.box};
  border: 1px solid ${border.subtle};
  border-radius: ${radius.lg};
  box-shadow: ${shadow.card};
  backdrop-filter: ${blur.subtle};
  color: ${({ $narration }) => ($narration ? dialogue.narration : text.primary)};
  font-style: ${({ $narration }) => ($narration ? "italic" : "normal")};
  font-size: 1.15rem;
  line-height: 1.75;
  letter-spacing: 0.01em;
  white-space: pre-line;

  ${media.mobile} {
    min-height: 7.5rem;
    padding: ${spacing.lg} ${spacing.lg} ${spacing.md};
    font-size: 1rem;
  }
`;

// 다음으로 넘길 수 있음 표시 (아래로 살짝 까딱이는 점)
const ProgressDot = styled.span`
  position: absolute;
  right: ${spacing.lg};
  bottom: ${spacing.md};
  width: 8px;
  height: 8px;
  border-radius: ${radius.pill};
  background: ${text.accent};
  animation: ${blink} 1.2s ease-in-out infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

// 스크린리더 낭독 문구 (화자 있으면 "이름: 본문")
const toAnnouncement = (line, isNarration) =>
  isNarration ? line.text : `${line.speakerName}: ${line.text}`;

/**
 * 대사창: 화자 이름표(나레이션 제외, 화자 바뀔 때 미끄러져 등장) + 타이핑 본문 + 완료 시 진행 표시
 * 낭독은 숨은 알림 영역에서 줄마다 1회 (타이핑 중 글자 단위 낭독 방지)
 */
function DialogueBox({ line, visibleText, isDone }) {
  const isNarration = line.speakerId === SPEAKER.NARRATION;
  return (
    <Wrapper>
      <AnimatePresence initial={false} mode="wait">
        {!isNarration && (
          <NameTagSlot
            key={line.speakerName}
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: motionSeconds.quick, ease: motionCurve.soft }}
          >
            <NameTag name={line.speakerName} />
          </NameTagSlot>
        )}
      </AnimatePresence>
      <Box $narration={isNarration} aria-hidden="true">
        {visibleText}
        {isDone && <ProgressDot />}
      </Box>
      <VisuallyHidden role="status" data-announcer="">
        <span key={`${line.speakerName}:${line.text}`}>{toAnnouncement(line, isNarration)}</span>
      </VisuallyHidden>
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
