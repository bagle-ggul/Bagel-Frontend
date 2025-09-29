import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { APP_VERSION } from "../constants/version";
import axios from "../utils/axios";

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url('/img/bg_home_v4.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: absolute;
  top: 50%;
  right: 10%;
  transform: translateY(-50%);
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  padding: 3rem 2.5rem;
  border-radius: 20px;
  width: 45rem;
  max-width: 45vw;
  z-index: 10;

  @media (max-width: 1200px) {
    right: 8%;
    width: 40rem;
    max-width: 50vw;
  }

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 MobileContainer로 이동 */
  }
`;

const Title = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  text-shadow: 0 6px 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(255, 255, 255, 0.3);

  @media (max-width: 768px) {
    font-size: 3.5rem;
  }

  @media (max-width: 480px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
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

const VersionInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  opacity: 0.7;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const VersionText = styled.span`
  font-weight: 500;
`;

const IconControlGroup = styled.div`
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

// 공유 스타일 상수 - ChangelogLink와 MusicControlButton이 동일한 스타일 사용
const sharedLinkButtonStyles = `
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  margin-top: 0.4rem;
  border: none;
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
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

const ChangelogLink = styled.a`
  ${sharedLinkButtonStyles}
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  width: 100%;
`;

const ButtonWrapper = styled(motion.div)`
  width: 40%;

  @media (max-width: 768px) {
    width: 60%;
  }

  @media (max-width: 480px) {
    width: 80%;
  }
`;

const ButtonBase = `
  width: 100%;
  padding: 1.2rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  display: block;

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 768px) {
    font-size: 1.1rem;
    padding: 1rem 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
    padding: 0.9rem 1.2rem;
  }
`;

const PrimaryButton = styled(Link)`
  ${ButtonBase}
  background: rgba(255, 255, 255, 0.85);
  color: #000;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);

  &:hover {
    background: rgba(200, 182, 226, 0.9);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.4);
  }
`;

const SecondaryButton = styled(Link)`
  ${ButtonBase}
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;

const SecondaryButtonModal = styled.button`
  ${ButtonBase}
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  &:hover {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
`;


const BottomRightButtonGroup = styled.div`
  position: absolute;
  bottom: 20px;
  right: 20px;
  display: flex;
  gap: 0.5rem;
  align-items: center;
  z-index: 100;

  @media (max-width: 768px) {
    bottom: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    bottom: 10px;
    right: 10px;
  }
`;

const BottomCreditsButton = styled.button`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: fit-content;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.7rem 1rem;
  }
`;

const LogoutButton = styled.button`
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: fit-content;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.7rem 1rem;
  }
`;

const BottomVersionInfo = styled.a`
  position: fixed;
  bottom: 20px;
  left: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 1rem 1.5rem;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  width: fit-content;
  text-decoration: none;
  display: block;
  z-index: 100;

  &:hover {
    background: rgba(0, 0, 0, 0.5);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    font-size: 0.9rem;
    padding: 0.8rem 1.2rem;
    bottom: 15px;
    left: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.8rem;
    padding: 0.7rem 1rem;
    bottom: 10px;
    left: 10px;
  }
`;

const CharacterWrapper = styled.div`
  position: absolute;
  left: 5%;
  bottom: 0;
  height: 80vh;
  width: auto;
  z-index: 15;

  img {
    height: 100%;
    width: auto;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 1200px) {
    left: 3%;
    height: 70vh;
  }

  @media (max-width: 900px) {
    left: 2%;
    height: 60vh;
  }

  @media (max-width: 768px) {
    display: none; /* 모바일에서는 MobileContainer로 이동 */
  }
`;

// 모바일 전용 컨테이너
const MobileContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    position: fixed;
    bottom: 5vh;
    left: 50%;
    transform: translateX(-50%);
    z-index: 20;
    gap: 0;
  }

  @media (max-width: 480px) {
    bottom: 9vh;
    gap: 0;
  }
`;

// 모바일 전용 캐릭터 래퍼
const MobileCharacterWrapper = styled.div`
  width: auto;
  height: auto;
  display: flex;
  align-items: flex-end;
  justify-content: center;

  img {
    width: auto;
    height: 38vh;
    object-fit: contain;
    object-position: bottom;
    filter: drop-shadow(0 0 20px rgba(0, 0, 0, 0.3));
  }

  @media (max-width: 480px) {
    img {
      height: 33vh;
    }
  }

  @media (max-width: 360px) {
    img {
      height: 24vh;
    }
  }
`;

// 모바일 전용 메인 래퍼
const MobileMainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  padding: 2rem 1.5rem;
  border-radius: 20px;
  width: 45rem;
  max-width: 90vw;
  z-index: 10;

  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    width: 90vw;
    max-width: 90vw;
    gap: 0.5rem;
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  max-width: 700px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
  color: white;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
  }
`;

const ModalTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

const TeamInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

const TeamName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: rgba(200, 182, 226, 1);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;


const TeamDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  strong {
    opacity: 1;
    font-weight: 600;
  }
`;

const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  transition: all 0.3s ease;
  gap: 0.5rem;

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateX(5px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const MemberName = styled.span`
  font-size: 1.3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

const MemberRole = styled.span`
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

const IconCloseButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(200, 182, 226, 0.4);
  }

  svg {
    width: 20px;
    height: 20px;
    transition: all 0.2s ease;
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;

    svg {
      width: 18px;
      height: 18px;
    }
  }

  @media (max-width: 480px) {
    top: 0.8rem;
    right: 0.8rem;
    width: 40px;
    height: 40px;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

// 로그인 모달 스타일 컴포넌트들
const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

const InputWrapper = styled(motion.div)`
  width: 100%;
`;

const GlassInput = styled.input`
  width: 100%;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  box-sizing: border-box;
  transition: all 0.3s ease;

  &::placeholder {
    color: rgba(255, 255, 255, 0.7);
  }

  &:focus {
    outline: none;
    border-color: rgba(200, 182, 226, 0.5);
    box-shadow: 0 0 20px rgba(200, 182, 226, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }
`;

const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const PasswordToggleButton = styled.button`
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-50%) scale(1.1);
  }

  &:focus {
    outline: none;
    color: rgba(200, 182, 226, 0.9);
    background: rgba(200, 182, 226, 0.1);
    box-shadow: 0 0 0 2px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  svg {
    width: 18px;
    height: 18px;
    transition: all 0.2s ease;
  }

  @media (max-width: 480px) {
    right: 0.8rem;
    padding: 0.4rem;

    svg {
      width: 16px;
      height: 16px;
    }
  }
`;

const ErrorMessage = styled(motion.div)`
  width: 100%;
  padding: 0.8rem 1rem;
  background: rgba(220, 38, 38, 0.15);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(220, 38, 38, 0.3);
  border-radius: 8px;
  color: #ff6b6b;
  font-size: 0.9rem;
  text-align: center;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    padding: 0.7rem 0.8rem;
    font-size: 0.85rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.7rem;
    font-size: 0.8rem;
  }
`;

const SubmitButton = styled(motion.button)`
  width: 100%;
  padding: 1.2rem 2rem;
  background: rgba(200, 182, 226, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 182, 226, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background: rgba(200, 182, 226, 0.9);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }
`;



// 성별 선택 컴포넌트
const GenderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const GenderTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const GenderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

const GenderButton = styled.button`
  flex: 1;
  max-width: 150px;
  padding: 1rem 1.5rem;
  background: ${props => props.selected ? 'rgba(200, 182, 226, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'rgba(200, 182, 226, 1)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 12px;
  color: ${props => props.selected ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 0.6);
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(200, 182, 226, 0.3);
  }

  @media (max-width: 480px) {
    max-width: none;
    padding: 0.9rem 1.2rem;
    font-size: 0.9rem;
  }
`;

// MBTI 컴팩트 선택 컴포넌트
const MbtiCompactContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const MbtiTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.8rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const MbtiRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

const MbtiLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  min-width: 60px;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    min-width: auto;
  }
`;

const MbtiButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  max-width: 200px;
`;

const MbtiButton = styled.button`
  min-width: 80px;
  padding: 0.6rem 1rem;
  background: ${props => props.selected ? 'rgba(200, 182, 226, 0.8)' : 'rgba(255, 255, 255, 0.1)'};
  border: 1px solid ${props => props.selected ? 'rgba(200, 182, 226, 1)' : 'rgba(255, 255, 255, 0.2)'};
  border-radius: 8px;
  color: ${props => props.selected ? 'white' : 'rgba(255, 255, 255, 0.9)'};
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 0.6);
    color: white;
    transform: translateY(-1px);
  }

  @media (max-width: 480px) {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
`;

const MbtiResult = styled.div`
  text-align: center;
  margin-top: 0.5rem;
  padding: 0.8rem;
  background: rgba(200, 182, 226, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(200, 182, 226, 0.4);

  span {
    color: rgba(200, 182, 226, 1);
    font-weight: 700;
    font-size: 1.2rem;
    letter-spacing: 0.1em;
  }
`;

// 음악 컨트롤 관련 스타일 컴포넌트
const VersionControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 0.5rem;

  @media (max-width: 768px) {
    margin-top: 0.4rem;
  }

  @media (max-width: 480px) {
    margin-top: 0.3rem;
  }
`;

const MusicControlButton = styled.button`
  ${sharedLinkButtonStyles}
`;

// 생일 선택 컴포넌트
const BirthDateContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
  padding: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
`;

const BirthDateTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const BirthDateRow = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

const BirthSelect = styled.select`
  flex: 1;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: rgba(200, 182, 226, 0.5);
    box-shadow: 0 0 20px rgba(200, 182, 226, 0.2);
    background: rgba(255, 255, 255, 0.15);
  }

  option {
    background: rgba(0, 0, 0, 0.9);
    color: white;
  }

  @media (max-width: 768px) {
    padding: 0.9rem 1.2rem;
    font-size: 0.95rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 0.6rem;
    font-size: 0.9rem;
  }
`;

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [characterImage, setCharacterImage] = useState("/img/her_home_v1.png");

  // 로그인 폼 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  // 회원가입 폼 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [isSignupPasswordVisible, setIsSignupPasswordVisible] = useState(false);
  const [isSignupPasswordConfirmVisible, setIsSignupPasswordConfirmVisible] = useState(false);
  const [characterName, setCharacterName] = useState("");
  const [mbti, setMbti] = useState("");
  // MBTI 단계별 선택 상태
  const [mbtiE, setMbtiE] = useState(""); // E/I
  const [mbtiS, setMbtiS] = useState(""); // S/N
  const [mbtiT, setMbtiT] = useState(""); // T/F
  const [mbtiJ, setMbtiJ] = useState(""); // J/P
  // 생일 개별 선택 상태
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [signupError, setSignupError] = useState("");

  // 배경음악 컨트롤 상태
  const [isMuted, setIsMuted] = useState(() => {
    return localStorage.getItem('musicMuted') === 'true';
  });
  const [audioRef] = useState(new Audio('/audio/main_once-again.m4a'));

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  // 배경음악 초기 설정 및 정리
  useEffect(() => {
    audioRef.loop = true;
    audioRef.volume = 0.3;

    // 음소거 상태가 아니면 재생 시도
    if (!isMuted) {
      const playPromise = audioRef.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 자동재생이 차단된 경우 음소거 상태로 설정
          setIsMuted(true);
          localStorage.setItem('musicMuted', 'true');
        });
      }
    }

    return () => {
      audioRef.pause();
      audioRef.currentTime = 0;
    };
  }, [audioRef, isMuted]);

  // 화면 크기에 따른 캐릭터 이미지 변경
  useEffect(() => {
    const updateCharacterImage = () => {
      if (window.innerWidth <= 768) {
        setCharacterImage("/img/her_home_v1_mobile.png");
      } else {
        setCharacterImage("/img/her_home_v1.png");
      }
    };

    // 초기 설정
    updateCharacterImage();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener('resize', updateCharacterImage);

    // 클린업 함수
    return () => window.removeEventListener('resize', updateCharacterImage);
  }, []);

  // MBTI 자동 조합
  useEffect(() => {
    if (mbtiE && mbtiS && mbtiT && mbtiJ) {
      setMbti(mbtiE + mbtiS + mbtiT + mbtiJ);
    } else {
      setMbti("");
    }
  }, [mbtiE, mbtiS, mbtiT, mbtiJ]);


  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // 에러 메시지 초기화

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post("/api/login", userData);
      const { refreshToken } = response.data;
      localStorage.setItem("refreshToken", refreshToken);
      setIsAuthenticated(true);
      setShowLogin(false);
      // 폼 초기화
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      console.error(error);
      setError("아이디 또는 비밀번호를 확인해주세요");
    }
  };

  const openLoginModal = () => {
    setShowLogin(true);
    setError("");
    setEmail("");
    setPassword("");
    setIsPasswordVisible(false);
  };

  const closeLoginModal = () => {
    setShowLogin(false);
    setError("");
    setEmail("");
    setPassword("");
    setIsPasswordVisible(false);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setSignupError(""); // 에러 메시지 초기화

    // 비밀번호 확인 검증
    if (signupPassword !== signupPasswordConfirm) {
      setSignupError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // MBTI 검증
    if (!mbtiE || !mbtiS || !mbtiT || !mbtiJ) {
      setSignupError("MBTI를 모두 선택해주세요.");
      return;
    }

    // 생일 검증
    if (!birthYear || !birthMonth || !birthDay) {
      setSignupError("생년월일을 모두 선택해주세요.");
      return;
    }

    const userData = {
      email: signupEmail,
      password: signupPassword,
      characterName,
      mbti,
      birthDate: `${birthYear}-${birthMonth.padStart(2, '0')}-${birthDay.padStart(2, '0')}`,
      gender,
    };

    try {
      const response = await axios.post("/api/signup", userData);
      setShowSignup(false);
      // 회원가입 성공 후 로그인 모달 열기
      setShowLogin(true);
      // 폼 초기화
      setSignupEmail("");
      setSignupPassword("");
      setSignupPasswordConfirm("");
      setIsSignupPasswordVisible(false);
      setIsSignupPasswordConfirmVisible(false);
      setCharacterName("");
      setMbti("");
      setMbtiE("");
      setMbtiS("");
      setMbtiT("");
      setMbtiJ("");
      setBirthYear("");
      setBirthMonth("");
      setBirthDay("");
      setGender("");
      setSignupError("");
    } catch (error) {
      console.error(error);
      setSignupError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const openSignupModal = () => {
    setShowSignup(true);
    setSignupError("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setIsSignupPasswordVisible(false);
    setIsSignupPasswordConfirmVisible(false);
    setCharacterName("");
    setMbti("");
    setMbtiE("");
    setMbtiS("");
    setMbtiT("");
    setMbtiJ("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setGender("");
  };

  const closeSignupModal = () => {
    setShowSignup(false);
    setSignupError("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setIsSignupPasswordVisible(false);
    setIsSignupPasswordConfirmVisible(false);
    setCharacterName("");
    setMbti("");
    setMbtiE("");
    setMbtiS("");
    setMbtiT("");
    setMbtiJ("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setGender("");
  };

  const handleRankingClick = () => {
    if (isAuthenticated) {
      window.location.href = "/board";
    } else {
      setShowLoginRequired(true);
    }
  };

  const closeLoginRequiredModal = () => {
    setShowLoginRequired(false);
  };

  // 배경음악 토글 함수
  const toggleMusic = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    localStorage.setItem('musicMuted', newMutedState.toString());

    if (newMutedState) {
      audioRef.pause();
    } else {
      audioRef.play().catch(() => {
        // 재생 실패시 다시 음소거 상태로
        setIsMuted(true);
        localStorage.setItem('musicMuted', 'true');
      });
    }
  };

  const teamMembers = [
    { name: "서새찬", role: "Backend, Frontend, 발표 및 Document 문서화" },
    { name: "이창규", role: "Frontend, 이미지 생성" },
    { name: "강인권", role: "Frontend" },
    { name: "신혁수", role: "Frontend" },
    { name: "김현서", role: "스토리 제작 및 전체 통괄, 이미지 생성" },
    { name: "김도현", role: "스토리 제작 및 전체 통괄, 이미지 생성" },
  ];

  return (
    <div>
      <Wrapper />

      {/* 데스크톱용 캐릭터 */}
      <CharacterWrapper>
        <motion.img
          src={characterImage}
          alt="Save Her - 그녀"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            ease: "easeOut"
          }}
        />
      </CharacterWrapper>

      {/* 데스크톱용 메인 */}
      <MainWrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Re: WAVE</Title>
          <Subtitle>선택의 순간, 그녀의 운명이 갈린다.</Subtitle>
          <IconControlGroup>
            <ChangelogLink
              href="https://github.com/bagle-ggul"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub 저장소"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
              </svg>
            </ChangelogLink>
            <MusicControlButton
              onClick={toggleMusic}
              aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
              title={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                  <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                </svg>
              )}
            </MusicControlButton>
          </IconControlGroup>
        </motion.div>
        <ButtonGroup>
          {isAuthenticated ? (
            <>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <PrimaryButton to="/intro">게임 시작</PrimaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/profile">내 정보</SecondaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/board">랭킹 보기</SecondaryButton>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={openSignupModal}>
                  회원가입
                </SecondaryButtonModal>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={openLoginModal}>
                  로그인
                </SecondaryButtonModal>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={handleRankingClick}>
                  랭킹 보기
                </SecondaryButtonModal>
              </ButtonWrapper>
            </>
          )}
        </ButtonGroup>
      </MainWrapper>

      {/* 모바일용 통합 컨테이너 */}
      <MobileContainer>
        <MobileCharacterWrapper>
          <motion.img
            src={characterImage}
            alt="Save Her - 그녀"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.3,
              ease: "easeOut"
            }}
          />
        </MobileCharacterWrapper>

        <MobileMainWrapper>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title>Re: WAVE</Title>
            <Subtitle>선택의 순간, 그녀의 운명이 갈린다.</Subtitle>
            <IconControlGroup>
              <ChangelogLink
                href="https://github.com/bagle-ggul"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub 저장소"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                </svg>
              </ChangelogLink>
              <MusicControlButton
                onClick={toggleMusic}
                aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
                title={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z"/>
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z"/>
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z"/>
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z"/>
                  </svg>
                )}
              </MusicControlButton>
            </IconControlGroup>
          </motion.div>
          <ButtonGroup>
            {isAuthenticated ? (
              <>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PrimaryButton to="/intro">게임 시작</PrimaryButton>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButton to="/profile">내 정보</SecondaryButton>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButton to="/board">랭킹 보기</SecondaryButton>
                </ButtonWrapper>
              </>
            ) : (
              <>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={openSignupModal}>
                    회원가입
                  </SecondaryButtonModal>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={openLoginModal}>
                    로그인
                  </SecondaryButtonModal>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={handleRankingClick}>
                    랭킹 보기
                  </SecondaryButtonModal>
                </ButtonWrapper>
              </>
            )}
          </ButtonGroup>
        </MobileMainWrapper>
      </MobileContainer>

      {isAuthenticated ? (
        <BottomRightButtonGroup>
          <BottomCreditsButton onClick={() => setShowCredits(true)}>
            크레딧
          </BottomCreditsButton>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </BottomRightButtonGroup>
      ) : (
        <BottomRightButtonGroup>
          <BottomCreditsButton onClick={() => setShowCredits(true)}>
            크레딧
          </BottomCreditsButton>
        </BottomRightButtonGroup>
      )}

      <AnimatePresence>
        {showCredits && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowCredits(false)}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>크레딧</ModalTitle>
              <TeamInfo>
                <TeamName>그녀가사다준 뉴욕 베이글 (그뉴베)</TeamName>
                <TeamDetails>
                  <DetailRow>
                    <span>날짜: 2024.05.17 | 주제: 파도, 시간, 미로</span>
                  </DetailRow>
                  <DetailRow>
                    <span>세종대학교 소프트웨어융합대학 해커톤</span>
                  </DetailRow>
                </TeamDetails>
              </TeamInfo>
              <TeamList>
                {teamMembers.map((member, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TeamMember>
                      <MemberName>{member.name}</MemberName>
                      <MemberRole>{member.role}</MemberRole>
                    </TeamMember>
                  </motion.div>
                ))}
              </TeamList>
              <IconCloseButton
                onClick={() => setShowCredits(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="크레딧 모달 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showSignup && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSignupModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>회원가입</ModalTitle>
              <LoginForm onSubmit={handleSignup}>
                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <GlassInput
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    value={signupEmail}
                    onChange={(e) => setSignupEmail(e.target.value)}
                    required
                  />
                </InputWrapper>

                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PasswordInputWrapper>
                    <GlassInput
                      type={isSignupPasswordVisible ? "text" : "password"}
                      placeholder="비밀번호를 입력해주세요"
                      value={signupPassword}
                      onChange={(e) => setSignupPassword(e.target.value)}
                      required
                    />
                    <PasswordToggleButton
                      type="button"
                      onClick={() => setIsSignupPasswordVisible(!isSignupPasswordVisible)}
                    >
                      {isSignupPasswordVisible ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      )}
                    </PasswordToggleButton>
                  </PasswordInputWrapper>
                </InputWrapper>

                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PasswordInputWrapper>
                    <GlassInput
                      type={isSignupPasswordConfirmVisible ? "text" : "password"}
                      placeholder="비밀번호를 다시 입력해주세요"
                      value={signupPasswordConfirm}
                      onChange={(e) => setSignupPasswordConfirm(e.target.value)}
                      required
                    />
                    <PasswordToggleButton
                      type="button"
                      onClick={() => setIsSignupPasswordConfirmVisible(!isSignupPasswordConfirmVisible)}
                    >
                      {isSignupPasswordConfirmVisible ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      )}
                    </PasswordToggleButton>
                  </PasswordInputWrapper>
                  {signupPasswordConfirm && signupPassword !== signupPasswordConfirm && (
                    <ErrorMessage
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      비밀번호가 일치하지 않습니다
                    </ErrorMessage>
                  )}
                </InputWrapper>

                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <GlassInput
                    type="text"
                    placeholder="이름을 입력해주세요"
                    value={characterName}
                    onChange={(e) => setCharacterName(e.target.value)}
                    required
                  />
                </InputWrapper>

                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <MbtiCompactContainer>
                    <MbtiTitle>성격 유형 (MBTI)</MbtiTitle>

                    <MbtiRow>
                      <MbtiLabel>에너지</MbtiLabel>
                      <MbtiButtonGroup>
                        <MbtiButton
                          selected={mbtiE === "E"}
                          onClick={() => setMbtiE("E")}
                          type="button"
                        >
                          E 외향
                        </MbtiButton>
                        <MbtiButton
                          selected={mbtiE === "I"}
                          onClick={() => setMbtiE("I")}
                          type="button"
                        >
                          I 내향
                        </MbtiButton>
                      </MbtiButtonGroup>
                    </MbtiRow>

                    <MbtiRow>
                      <MbtiLabel>인식</MbtiLabel>
                      <MbtiButtonGroup>
                        <MbtiButton
                          selected={mbtiS === "S"}
                          onClick={() => setMbtiS("S")}
                          type="button"
                        >
                          S 감각
                        </MbtiButton>
                        <MbtiButton
                          selected={mbtiS === "N"}
                          onClick={() => setMbtiS("N")}
                          type="button"
                        >
                          N 직관
                        </MbtiButton>
                      </MbtiButtonGroup>
                    </MbtiRow>

                    <MbtiRow>
                      <MbtiLabel>판단</MbtiLabel>
                      <MbtiButtonGroup>
                        <MbtiButton
                          selected={mbtiT === "T"}
                          onClick={() => setMbtiT("T")}
                          type="button"
                        >
                          T 사고
                        </MbtiButton>
                        <MbtiButton
                          selected={mbtiT === "F"}
                          onClick={() => setMbtiT("F")}
                          type="button"
                        >
                          F 감정
                        </MbtiButton>
                      </MbtiButtonGroup>
                    </MbtiRow>

                    <MbtiRow>
                      <MbtiLabel>생활</MbtiLabel>
                      <MbtiButtonGroup>
                        <MbtiButton
                          selected={mbtiJ === "J"}
                          onClick={() => setMbtiJ("J")}
                          type="button"
                        >
                          J 계획
                        </MbtiButton>
                        <MbtiButton
                          selected={mbtiJ === "P"}
                          onClick={() => setMbtiJ("P")}
                          type="button"
                        >
                          P 자율
                        </MbtiButton>
                      </MbtiButtonGroup>
                    </MbtiRow>

                    {mbti && (
                      <MbtiResult>
                        <span>{mbti}</span>
                      </MbtiResult>
                    )}
                  </MbtiCompactContainer>
                </InputWrapper>

                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <BirthDateContainer>
                    <BirthDateTitle>생년월일</BirthDateTitle>
                    <BirthDateRow>
                      <BirthSelect
                        value={birthYear}
                        onChange={(e) => setBirthYear(e.target.value)}
                        required
                      >
                        <option value="" disabled>년도</option>
                        {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map((year) => (
                          <option key={year} value={year}>
                            {year}년
                          </option>
                        ))}
                      </BirthSelect>

                      <BirthSelect
                        value={birthMonth}
                        onChange={(e) => setBirthMonth(e.target.value)}
                        required
                      >
                        <option value="" disabled>월</option>
                        {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => (
                          <option key={month} value={month}>
                            {month}월
                          </option>
                        ))}
                      </BirthSelect>

                      <BirthSelect
                        value={birthDay}
                        onChange={(e) => setBirthDay(e.target.value)}
                        required
                      >
                        <option value="" disabled>일</option>
                        {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                          <option key={day} value={day}>
                            {day}일
                          </option>
                        ))}
                      </BirthSelect>
                    </BirthDateRow>
                  </BirthDateContainer>
                </InputWrapper>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <GenderContainer>
                    <GenderTitle>성별</GenderTitle>
                    <GenderButtonGroup>
                      <GenderButton
                        selected={gender === "남성"}
                        onClick={() => setGender("남성")}
                        type="button"
                      >
                        남성
                      </GenderButton>
                      <GenderButton
                        selected={gender === "여성"}
                        onClick={() => setGender("여성")}
                        type="button"
                      >
                        여성
                      </GenderButton>
                    </GenderButtonGroup>
                  </GenderContainer>
                </motion.div>

                <SubmitButton
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  회원가입
                </SubmitButton>
                {signupError && (
                  <ErrorMessage
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    {signupError}
                  </ErrorMessage>
                )}
              </LoginForm>
              <IconCloseButton
                onClick={closeSignupModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="회원가입 모달 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showLogin && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginModal}
          >
            <ModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <ModalTitle>로그인</ModalTitle>
              <LoginForm onSubmit={handleLogin}>
                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <GlassInput
                    type="email"
                    placeholder="이메일을 입력해주세요"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </InputWrapper>
                <InputWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PasswordInputWrapper>
                    <GlassInput
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="비밀번호를 입력해주세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <PasswordToggleButton
                      type="button"
                      onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    >
                      {isPasswordVisible ? (
                        // Eye Open (보기)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      ) : (
                        // Eye Closed (숨기기)
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                          <line x1="1" y1="1" x2="23" y2="23"/>
                        </svg>
                      )}
                    </PasswordToggleButton>
                  </PasswordInputWrapper>
                </InputWrapper>
                <SubmitButton
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
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
                onClick={closeLoginModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="로그인 모달 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}

        {showLoginRequired && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLoginRequiredModal}
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
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
                <SubmitButton
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowLoginRequired(false);
                    setShowLogin(true);
                  }}
                >
                  로그인하기
                </SubmitButton>
                <SubmitButton
                  type="button"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setShowLoginRequired(false);
                    setShowSignup(true);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    border: '1px solid rgba(255, 255, 255, 0.3)'
                  }}
                >
                  회원가입하기
                </SubmitButton>
              </div>
              <IconCloseButton
                onClick={closeLoginRequiredModal}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="모달 닫기"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </IconCloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* 왼쪽 아래 버전 정보 */}
      <BottomVersionInfo
        href="https://github.com/bagle-ggul/Bagel-Frontend/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener noreferrer"
        title="Changelog 확인"
      >
        v{APP_VERSION}
      </BottomVersionInfo>
    </div>
  );
}

export default Home;