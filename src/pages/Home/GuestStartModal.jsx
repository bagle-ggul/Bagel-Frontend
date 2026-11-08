import React, { useEffect } from "react";
import { Dice5 } from "react-bootstrap-icons";

import { useGuestStartForm } from "../../hooks/useGuestStartForm";
import { NICKNAME_MAX_LENGTH } from "../../utils/nickname";
import {
  ErrorMessage,
  GlassInput,
  IconCloseButton,
  InputWrapper,
  ModalOverlay,
} from "../Home.styled";

import {
  FieldHint,
  GuestForm,
  GuestModalContent,
  GuestModalDescription,
  GuestModalTitle,
  NicknameField,
  NicknameRow,
  RerollButton,
  StartButton,
  VisuallyHiddenLabel,
} from "./GuestStartModal.styled";
import MbtiSelect from "./MbtiSelect";

const NICKNAME_INPUT_ID = "guest-start-nickname";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * 게임 시작 모달: 가입·로그인 없이 닉네임과 MBTI만 받는다.
 * 닉네임은 서버 추천값이 미리 채워지고, 그대로 쓰거나 다시 뽑거나 직접 고칠 수 있다.
 *
 * @param {string} [description] 모달을 연 이유 안내 (예: 랭킹 보기 전)
 * @param {Function} onStarted 시작 성공 후 호출 (응답 본문 전달)
 * @param {Function} onClose
 */
function GuestStartModal({ description, onStarted, onClose }) {
  const {
    characterName,
    changeCharacterName,
    mbtiAxes,
    mbtiResult,
    selectMbtiAxis,
    rerollNickname,
    isNicknameLoading,
    isSubmitting,
    errorMessage,
    submit,
  } = useGuestStartForm({ onStarted });

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

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <GuestModalContent
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-start-title"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(event) => event.stopPropagation()}
      >
        <GuestModalTitle id="guest-start-title">게임 시작</GuestModalTitle>
        <GuestModalDescription>
          {description ?? "가입 없이 바로 시작할 수 있어요."}
        </GuestModalDescription>

        <GuestForm onSubmit={submit}>
          <InputWrapper>
            <NicknameRow>
              <NicknameField>
                <VisuallyHiddenLabel htmlFor={NICKNAME_INPUT_ID}>닉네임</VisuallyHiddenLabel>
                <GlassInput
                  id={NICKNAME_INPUT_ID}
                  type="text"
                  placeholder="닉네임"
                  value={characterName}
                  maxLength={NICKNAME_MAX_LENGTH}
                  autoComplete="off"
                  onChange={(event) => changeCharacterName(event.target.value)}
                />
              </NicknameField>
              <RerollButton
                type="button"
                onClick={rerollNickname}
                disabled={isNicknameLoading || isSubmitting}
                $isSpinning={isNicknameLoading}
                aria-label="닉네임 다시 뽑기"
                title="닉네임 다시 뽑기"
              >
                <Dice5 size={22} />
              </RerollButton>
            </NicknameRow>
            <FieldHint>마음에 들면 그대로, 아니면 다시 뽑거나 직접 입력하세요.</FieldHint>
          </InputWrapper>

          <InputWrapper>
            <MbtiSelect value={mbtiAxes} onChange={selectMbtiAxis} result={mbtiResult} />
          </InputWrapper>

          <StartButton
            type="submit"
            disabled={isSubmitting}
            whileHover={isSubmitting ? undefined : { scale: 1.02 }}
            whileTap={isSubmitting ? undefined : { scale: 0.98 }}
          >
            {isSubmitting ? "시작하는 중..." : "게임 시작"}
          </StartButton>

          {errorMessage && (
            <ErrorMessage
              role="alert"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {errorMessage}
            </ErrorMessage>
          )}
        </GuestForm>

        <IconCloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="시작 모달 닫기"
        >
          <CloseIcon />
        </IconCloseButton>
      </GuestModalContent>
    </ModalOverlay>
  );
}

export default GuestStartModal;
