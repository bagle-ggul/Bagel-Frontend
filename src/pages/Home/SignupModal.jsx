import { motion } from "framer-motion";
import React from "react";

import {
  ErrorMessage,
  GlassInput,
  IconCloseButton,
  InputWrapper,
  LoginForm,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SubmitButton,
} from "../Home.styled";

import BirthDateSelect from "./BirthDateSelect";
import GenderSelect from "./GenderSelect";
import MbtiSelect from "./MbtiSelect";
import PasswordField from "./PasswordField";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const hoverProps = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

/**
 * 회원가입 모달.
 *
 * 폼 상태는 화면(Home)이 소유하고 이 컴포넌트는 표현만 담당한다.
 * MBTI·생년월일·성별은 각각 하위 컴포넌트로 분리해, 이 파일은 폼의 뼈대만 갖는다.
 */
function SignupModal({
  email,
  password,
  passwordConfirm,
  characterName,
  mbti,
  mbtiResult,
  birth,
  gender,
  error,
  onEmailChange,
  onPasswordChange,
  onPasswordConfirmChange,
  onCharacterNameChange,
  onMbtiChange,
  onBirthChange,
  onGenderChange,
  onSubmit,
  onClose,
}) {
  const isPasswordMismatch = passwordConfirm && password !== passwordConfirm;

  return (
    <ModalOverlay
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <ModalContent
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <ModalTitle>회원가입</ModalTitle>
        <LoginForm onSubmit={onSubmit}>
          <InputWrapper {...hoverProps}>
            <GlassInput
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={onEmailChange}
              required
            />
          </InputWrapper>

          <InputWrapper {...hoverProps}>
            <PasswordField value={password} onChange={onPasswordChange} />
          </InputWrapper>

          <InputWrapper {...hoverProps}>
            <PasswordField
              value={passwordConfirm}
              onChange={onPasswordConfirmChange}
              placeholder="비밀번호를 다시 입력해주세요"
            />
            {isPasswordMismatch && (
              <ErrorMessage
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                비밀번호가 일치하지 않습니다
              </ErrorMessage>
            )}
          </InputWrapper>

          <InputWrapper {...hoverProps}>
            <GlassInput
              type="text"
              placeholder="이름을 입력해주세요"
              value={characterName}
              onChange={onCharacterNameChange}
              required
            />
          </InputWrapper>

          <InputWrapper {...hoverProps}>
            <MbtiSelect value={mbti} onChange={onMbtiChange} result={mbtiResult} />
          </InputWrapper>

          <InputWrapper {...hoverProps}>
            <BirthDateSelect value={birth} onChange={onBirthChange} />
          </InputWrapper>

          <motion.div {...hoverProps}>
            <GenderSelect value={gender} onChange={onGenderChange} />
          </motion.div>

          <SubmitButton type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            회원가입
          </SubmitButton>
          {error && (
            <ErrorMessage
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {error}
            </ErrorMessage>
          )}
        </LoginForm>
        <IconCloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="회원가입 모달 닫기"
        >
          <CloseIcon />
        </IconCloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default SignupModal;
