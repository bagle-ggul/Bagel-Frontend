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

import PasswordField from "./PasswordField";

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/** 로그인 모달. 폼 상태는 화면(Home)이 소유하고 이 컴포넌트는 표현만 담당한다. */
function LoginModal({
  email,
  password,
  error,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onClose,
}) {
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
        <ModalTitle>로그인</ModalTitle>
        <LoginForm onSubmit={onSubmit}>
          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <GlassInput
              type="email"
              placeholder="이메일을 입력해주세요"
              value={email}
              onChange={onEmailChange}
              required
            />
          </InputWrapper>
          <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <PasswordField value={password} onChange={onPasswordChange} />
          </InputWrapper>

          <SubmitButton type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            로그인
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
          aria-label="로그인 모달 닫기"
        >
          <CloseIcon />
        </IconCloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LoginModal;
