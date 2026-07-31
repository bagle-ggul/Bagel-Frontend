import React from "react";
import styled from "styled-components";

import {
  DetailRow,
  IconCloseButton,
  ModalContent,
  ModalOverlay,
  ModalTitle,
  SubmitButton,
  TeamDetails,
  TeamInfo,
} from "../Home.styled";

// 기존에는 인라인 style로 쓰이던 부분 — 재사용과 테마 적용이 가능하도록 옮겼다
const ActionRow = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 1.5rem;
`;

const SecondaryAction = styled(SubmitButton)`
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.3);
`;

const CloseIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

/**
 * 랭킹처럼 로그인이 필요한 기능에 접근했을 때 안내하는 모달.
 * 막다른 안내로 끝내지 않고 로그인·회원가입으로 이어지는 동선을 함께 제공한다.
 */
function LoginRequiredModal({ onClose, onGoLogin, onGoSignup }) {
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
        <ModalTitle>로그인 필요</ModalTitle>
        <TeamInfo>
          <TeamDetails>
            <DetailRow>
              <span>랭킹 보기는 로그인 후 이용할 수 있습니다.</span>
            </DetailRow>
            <DetailRow>
              <span>로그인하여 다른 플레이어들과 점수를 비교해보세요!</span>
            </DetailRow>
          </TeamDetails>
        </TeamInfo>
        <ActionRow>
          <SubmitButton
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoLogin}
          >
            로그인하기
          </SubmitButton>
          <SecondaryAction
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onGoSignup}
          >
            회원가입하기
          </SecondaryAction>
        </ActionRow>
        <IconCloseButton
          onClick={onClose}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="모달 닫기"
        >
          <CloseIcon />
        </IconCloseButton>
      </ModalContent>
    </ModalOverlay>
  );
}

export default LoginRequiredModal;
