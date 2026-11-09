import React from "react";
import { Dice5 } from "react-bootstrap-icons";

import { Modal, VisuallyHidden } from "../../components/ui";
import { useGuestStartForm } from "../../hooks/useGuestStartForm";
import { NICKNAME_MAX_LENGTH } from "../../utils/nickname";

import {
  ErrorMessage,
  FieldHint,
  GlassInput,
  GuestForm,
  GuestModalDescription,
  InputWrapper,
  NicknameField,
  NicknameRow,
  RerollButton,
  StartButton,
} from "./GuestStartModal.styled";
import MbtiSelect from "./MbtiSelect";

const NICKNAME_INPUT_ID = "guest-start-nickname";

/**
 * 게임 시작 모달: 가입·로그인 없이 닉네임과 MBTI만 입력
 * 닉네임은 서버 추천값이 채워지고 다시 뽑기·직접 입력 가능 (description은 모달을 연 이유 안내)
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

  return (
    <Modal title="게임 시작" onClose={onClose} maxWidth="460px">
      <GuestModalDescription>
        {description ?? "가입 없이 바로 시작할 수 있어요."}
      </GuestModalDescription>

      <GuestForm onSubmit={submit}>
        <InputWrapper>
          <NicknameRow>
            <NicknameField>
              <VisuallyHidden as="label" htmlFor={NICKNAME_INPUT_ID}>
                닉네임
              </VisuallyHidden>
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

        <StartButton type="submit" size="lg" disabled={isSubmitting}>
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
    </Modal>
  );
}

export default GuestStartModal;
