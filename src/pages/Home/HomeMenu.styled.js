import { motion } from "framer-motion";
import styled, { css } from "styled-components";

import { Button } from "../../components/ui";
import { border, surface, text } from "../../styles/semantic";
import { radius, shadow } from "../../styles/tokens";

// 홈 메뉴: 제목, 아이콘 버튼 3개(GitHub, 갤러리, 음악), 주요 버튼

export const Title = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  text-shadow:
    0 6px 20px ${surface.strong},
    0 0 40px ${border.strong};

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.2rem;
  font-weight: 400;
  opacity: 0.9;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const IconControlGroup = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    margin-top: 0.4rem;
  }

  @media (max-width: 480px) {
    margin-top: 0.3rem;
  }
`;

// GitHub 링크·갤러리·음악 버튼이 함께 쓰는 아이콘 버튼 스타일
const iconButtonStyles = css`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${text.primary};
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.5rem;
  border-radius: ${radius.sm};
  background: ${surface.raised};
  margin-top: 0.4rem;
  border: none;
  cursor: pointer;

  &:hover {
    background: ${surface.raisedHover};
    transform: translateY(-1px);
  }

  &:focus {
    outline: none;
  }

  svg {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

export const ChangelogLink = styled.a`
  ${iconButtonStyles}
`;

export const MusicControlButton = styled.button`
  ${iconButtonStyles}
`;

export const ImageGalleryButton = styled.button`
  ${iconButtonStyles}
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
`;

export const ButtonWrapper = styled(motion.div)`
  width: 40%;

  @media (max-width: 768px) {
    width: 60%;
  }

  @media (max-width: 480px) {
    width: 80%;
  }
`;

// 메뉴 주요 버튼: 래퍼 너비를 가득 채우고 화면 폭에 따라 글자를 줄임
export const MenuButton = styled(Button)`
  width: 100%;
  font-size: 1.3rem;

  &:hover:not(:disabled) {
    box-shadow: ${shadow.buttonHover};
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;
