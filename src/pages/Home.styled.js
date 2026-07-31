import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-image: url("/img/bg_home_v4.png");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
`;

export const MainWrapper = styled.div`
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

export const Title = styled.h1`
  font-size: 6rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 10px 0;
  text-shadow:
    0 6px 20px rgba(0, 0, 0, 0.8),
    0 0 40px rgba(255, 255, 255, 0.3);

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

// 공유 스타일 상수 - ChangelogLink와 MusicControlButton이 동일한 스타일 사용
export const sharedLinkButtonStyles = `
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

export const ChangelogLink = styled.a`
  ${sharedLinkButtonStyles}
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

export const ButtonBase = `
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

export const PrimaryButton = styled(Link)`
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

export const SecondaryButton = styled(Link)`
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

export const SecondaryButtonModal = styled.button`
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

export const BottomRightButtonGroup = styled.div`
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

export const BottomCreditsButton = styled.button`
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

export const LogoutButton = styled.button`
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

export const BottomVersionInfo = styled.a`
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

export const CharacterWrapper = styled.div`
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
export const MobileContainer = styled.div`
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
export const MobileCharacterWrapper = styled.div`
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
export const MobileMainWrapper = styled.div`
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

export const ModalOverlay = styled(motion.div)`
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

export const ModalContent = styled(motion.div)`
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

export const ModalTitle = styled.h2`
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

export const TeamInfo = styled.div`
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

export const TeamName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: rgba(200, 182, 226, 1);

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const TeamDetails = styled.div`
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

export const DetailRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  strong {
    opacity: 1;
    font-weight: 600;
  }
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TeamMember = styled.div`
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

export const MemberName = styled.span`
  font-size: 1.3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const MemberRole = styled.span`
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;

export const IconCloseButton = styled(motion.button)`
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
export const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
`;

export const InputWrapper = styled(motion.div)`
  width: 100%;
`;

export const GlassInput = styled.input`
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

export const PasswordInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const PasswordToggleButton = styled.button`
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

export const ErrorMessage = styled(motion.div)`
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

export const SubmitButton = styled(motion.button)`
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
export const GenderContainer = styled.div`
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

export const GenderTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const GenderButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.8rem;
  }
`;

export const GenderButton = styled.button`
  flex: 1;
  max-width: 150px;
  padding: 1rem 1.5rem;
  background: ${(props) =>
    props.selected ? "rgba(200, 182, 226, 0.8)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => (props.selected ? "rgba(200, 182, 226, 1)" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 12px;
  color: ${(props) => (props.selected ? "white" : "rgba(255, 255, 255, 0.9)")};
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
export const MbtiCompactContainer = styled.div`
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

export const MbtiTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.8rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const MbtiRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export const MbtiLabel = styled.span`
  font-size: 0.9rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.8);
  min-width: 60px;

  @media (max-width: 480px) {
    font-size: 0.8rem;
    min-width: auto;
  }
`;

export const MbtiButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  flex: 1;
  max-width: 200px;
`;

export const MbtiButton = styled.button`
  min-width: 80px;
  padding: 0.6rem 1rem;
  background: ${(props) =>
    props.selected ? "rgba(200, 182, 226, 0.8)" : "rgba(255, 255, 255, 0.1)"};
  border: 1px solid
    ${(props) => (props.selected ? "rgba(200, 182, 226, 1)" : "rgba(255, 255, 255, 0.2)")};
  border-radius: 8px;
  color: ${(props) => (props.selected ? "white" : "rgba(255, 255, 255, 0.9)")};
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

export const MbtiResult = styled.div`
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
export const MusicControlButton = styled.button`
  ${sharedLinkButtonStyles}
`;

export const ImageGalleryButton = styled.button`
  ${sharedLinkButtonStyles}
`;

// 생일 선택 컴포넌트
export const BirthDateContainer = styled.div`
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

export const BirthDateTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgba(200, 182, 226, 1);
  text-align: center;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

export const BirthDateRow = styled.div`
  display: flex;
  gap: 0.5rem;
  width: 100%;
`;

export const BirthSelect = styled.select`
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
