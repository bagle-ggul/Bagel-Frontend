import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import styled from "styled-components";

import { border, text } from "../../styles/semantic";
import { spacing } from "../../styles/tokens";
import { Modal } from "../ui";

const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: ${spacing.md};
  margin: 0;
  padding: 0;
  list-style: none;
`;

const Entry = styled.li`
  padding-bottom: ${spacing.sm};
  border-bottom: 1px solid ${border.subtle};
  white-space: pre-line;
  color: ${({ $isChoice }) => ($isChoice ? text.accent : text.primary)};
`;

const SpeakerName = styled.strong`
  display: block;
  color: ${text.accent};
`;

const EmptyMessage = styled.p`
  color: ${text.secondary};
`;

/**
 * 지난 대사 모달: 화자 + 본문 목록, 선택한 항목은 "선택 · " 접두, 열리면 맨 아래로 스크롤
 */
function DialogueLogModal({ entries, onClose }) {
  const listEndRef = useRef(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView?.();
  }, []);

  return (
    <Modal title="지난 대사" onClose={onClose} maxWidth="560px">
      {entries.length === 0 ? (
        <EmptyMessage>아직 지난 대사가 없어요.</EmptyMessage>
      ) : (
        <List>
          {entries.map((entry) => {
            const isChoice = entry.speakerId === "choice";
            return (
              <Entry key={entry.id} $isChoice={isChoice}>
                {!isChoice && entry.speakerId !== "narration" && (
                  <SpeakerName>{entry.speakerName}</SpeakerName>
                )}
                {isChoice ? `선택 · ${entry.text}` : entry.text}
              </Entry>
            );
          })}
        </List>
      )}
      <div ref={listEndRef} />
    </Modal>
  );
}

DialogueLogModal.propTypes = {
  entries: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      speakerId: PropTypes.string.isRequired,
      speakerName: PropTypes.string,
      text: PropTypes.string.isRequired,
    })
  ).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DialogueLogModal;
