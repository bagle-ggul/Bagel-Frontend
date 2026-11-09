import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useEffect, useId, useRef } from "react";
import styled from "styled-components";

import { border, glass, layer, overlay, surface, text } from "../../styles/semantic";
import { radius, spacing, transition } from "../../styles/tokens";

const Overlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: ${layer.modal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${spacing.lg};
  background: ${overlay.modal};
`;

const Dialog = styled(motion.div)`
  position: relative;
  width: 100%;
  max-width: ${({ $maxWidth }) => $maxWidth};
  max-height: 90vh;
  overflow-y: auto;
  padding: ${spacing.xl};
  background: ${glass.background};
  backdrop-filter: ${glass.backdropFilter};
  border: ${glass.border};
  box-shadow: ${glass.boxShadow};
  border-radius: ${glass.borderRadius};
  color: ${text.primary};

  &:focus {
    outline: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: ${spacing.md};
  right: ${spacing.md};
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${surface.raised};
  border: 1px solid ${border.default};
  border-radius: ${radius.pill};
  color: ${text.muted};
  cursor: pointer;
  transition: ${transition.fast};

  &:hover {
    background: ${surface.raisedHover};
    color: ${text.primary};
  }
`;

const Title = styled.h2`
  margin: 0 0 ${spacing.lg};
  font-size: 1.5rem;
`;

/**
 * 공용 모달: 오버레이, 대화상자(role=dialog), 닫기(Esc, 바깥 클릭, 닫기 버튼)
 * 열릴 때 대화상자로 포커스 이동, AnimatePresence로 퇴장 애니메이션 가능
 */
function Modal({ title, onClose, children, maxWidth = "480px" }) {
  const dialogRef = useRef(null);
  const titleId = useId();

  // 열릴 때 대화상자에 포커스
  useEffect(() => {
    dialogRef.current?.focus();
  }, []);

  // Esc로 닫기
  useEffect(() => {
    const closeOnEscape = (keyboardEvent) => {
      if (keyboardEvent.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [onClose]);

  // 오버레이 자신을 직접 누른 경우만 닫기 (내용 클릭은 제외)
  const closeOnOverlayClick = (mouseEvent) => {
    if (mouseEvent.target === mouseEvent.currentTarget) {
      onClose();
    }
  };

  return (
    <Overlay
      data-testid="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={closeOnOverlayClick}
    >
      <Dialog
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        $maxWidth={maxWidth}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
      >
        <CloseButton type="button" aria-label="닫기" onClick={onClose}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </CloseButton>
        <Title id={titleId}>{title}</Title>
        {children}
      </Dialog>
    </Overlay>
  );
}

Modal.propTypes = {
  title: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node,
  maxWidth: PropTypes.string,
};

export default Modal;
