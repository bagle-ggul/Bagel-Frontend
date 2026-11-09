import { motion } from "framer-motion";
import PropTypes from "prop-types";
import styled from "styled-components";

import { border, dialogue, focus, text } from "../../styles/semantic";
import { media } from "../../styles/theme";
import {
  blur,
  motionCurve,
  motionSeconds,
  radius,
  shadow,
  spacing,
  transition,
} from "../../styles/tokens";

// 선택지 등장 간격 (초)
const STAGGER_DELAY_SECONDS = 0.07;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  width: 100%;
`;

// 화면 가운데 카드 (모두 같은 모양, 가운데 정렬 문구)
const ChoiceCard = styled(motion.button)`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 3.4rem;
  padding: ${spacing.md} ${spacing.xxl};
  background: ${dialogue.choice};
  color: ${text.primary};
  border: 1px solid ${border.default};
  border-radius: ${radius.md};
  box-shadow: ${shadow.button};
  backdrop-filter: ${blur.subtle};
  font-size: 1.05rem;
  line-height: 1.5;
  text-align: center;
  cursor: pointer;
  transition: ${transition.fast};

  &:hover {
    background: ${dialogue.choiceHover};
    border-color: ${border.accentStrong};
    box-shadow: ${shadow.buttonHover};
  }

  &:focus-visible {
    outline: 2px solid ${focus.ring};
    outline-offset: 2px;
  }

  ${media.mobile} {
    padding: ${spacing.md} ${spacing.xl};
    font-size: 0.98rem;
  }
`;

// 번호는 왼쪽 끝에 고정 (문구 가운데 정렬 유지)
const NumberBadge = styled.span`
  position: absolute;
  left: ${spacing.md};
  width: 24px;
  height: 24px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${border.accent};
  border-radius: ${radius.pill};
  color: ${text.accent};
  font-size: 0.85rem;
  font-weight: 600;
`;

/**
 * 선택지 목록: 번호 배지 + 문구, 모두 같은 모양 (점수·게임오버 여부는 노출하지 않음)
 * 등장: 순서대로 떠오르며 커짐, 누르면 살짝 눌림
 */
function ChoiceList({ choices, onChoose }) {
  return (
    <List role="group" aria-label="선택지">
      {choices.map((choice, index) => (
        <ChoiceCard
          key={`${index}-${choice.label}`}
          type="button"
          initial={{ opacity: 0, y: 12, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          whileHover={{ scale: 1.015 }}
          whileTap={{ scale: 0.985 }}
          transition={{
            duration: motionSeconds.base,
            ease: motionCurve.soft,
            delay: index * STAGGER_DELAY_SECONDS,
          }}
          onClick={(mouseEvent) => {
            // 장면 클릭 진행으로 번지지 않게 차단
            mouseEvent.stopPropagation();
            onChoose(index);
          }}
        >
          <NumberBadge aria-hidden="true">{index + 1}</NumberBadge>
          {choice.label}
        </ChoiceCard>
      ))}
    </List>
  );
}

ChoiceList.propTypes = {
  choices: PropTypes.arrayOf(PropTypes.shape({ label: PropTypes.string.isRequired })).isRequired,
  onChoose: PropTypes.func.isRequired,
};

export default ChoiceList;
