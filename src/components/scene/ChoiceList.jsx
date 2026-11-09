import { motion } from "framer-motion";
import PropTypes from "prop-types";
import styled from "styled-components";

import { border, dialogue, focus, text } from "../../styles/semantic";
import { radius, spacing, transition } from "../../styles/tokens";

// 선택지 등장 간격 (초)
const STAGGER_DELAY_SECONDS = 0.08;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing.sm};
  width: 100%;
`;

const ChoiceCard = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: ${spacing.md};
  width: 100%;
  padding: ${spacing.md} ${spacing.lg};
  background: ${dialogue.choice};
  color: ${text.primary};
  border: 1px solid ${border.subtle};
  border-radius: ${radius.md};
  font-size: 1rem;
  text-align: left;
  cursor: pointer;
  transition: ${transition.fast};

  &:hover {
    background: ${dialogue.choiceHover};
    border-color: ${border.accent};
  }

  &:focus-visible {
    outline: 2px solid ${focus.ring};
    outline-offset: 2px;
  }
`;

const NumberBadge = styled.span`
  flex: none;
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
 */
function ChoiceList({ choices, onChoose }) {
  return (
    <List role="group" aria-label="선택지">
      {choices.map((choice, index) => (
        <ChoiceCard
          key={choice.label}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * STAGGER_DELAY_SECONDS }}
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
