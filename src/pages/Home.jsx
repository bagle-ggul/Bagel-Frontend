import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Wrapper = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    grid-template-rows: repeat(3, 1fr);
  }

  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;

    @media (max-width: 768px) {
      height: 33.33vh;
    }
  }
`;

const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  padding: 3rem 2.5rem;
  border-radius: 20px;
  width: 50rem;
  max-width: 90vw;

  @media (max-width: 768px) {
    gap: 1.2rem;
    padding: 2rem 1.5rem;
  }
`;

const Title = styled.h1`
  font-size: 7rem;
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
  gap: 0.5rem;
  font-size: 1.2rem;
  opacity: 0.7;
  margin-top: 0.5rem;
  transition: opacity 0.3s ease;

  &:hover {
    opacity: 0.9;
  }

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-top: 0.4rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const VersionText = styled.span`
  font-weight: 500;
`;

const ChangelogLink = styled.a`
  display: inline-flex;
  align-items: center;
  color: inherit;
  text-decoration: none;
  transition: all 0.3s ease;
  padding: 0.3rem 0.5rem;
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
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

const CreditsButtonStyled = styled.button`
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

const LogoutButton = styled.button`
  position: absolute;
  bottom: 20px;
  right: 20px;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.7);
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 400;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

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
    font-size: 0.8rem;
    padding: 8px 16px;
    bottom: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 6px 12px;
    bottom: 10px;
    right: 10px;
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

const TeamSubName = styled.p`
  font-size: 1.2rem;
  font-weight: 500;
  margin-bottom: 1.2rem;
  opacity: 0.8;

  @media (max-width: 768px) {
    font-size: 1rem;
    margin-bottom: 1rem;
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

const CloseButton = styled.button`
  margin-top: 2rem;
  width: 100%;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.7);
  border: none;
  border-radius: 10px;
  color: #000;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 0.8);
    color: white;
    transform: scale(1.02);
  }

  @media (max-width: 768px) {
    margin-top: 1.5rem;
    padding: 0.8rem;
    font-size: 1rem;
  }
`;

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const APP_VERSION = "1.0.8";

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    setIsAuthenticated(false);
    window.location.reload();
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
      <Wrapper>
        <img src="/img/image1.png" alt="" />
        <img src="/img/image2.png" alt="" />
        <img src="/img/image3.png" alt="" />
      </Wrapper>
      <MainWrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Save Her</Title>
          <Subtitle>당신의 선택이 그녀의 운명을 결정합니다</Subtitle>
          <VersionInfo>
            <VersionText>v{APP_VERSION}</VersionText>
            <ChangelogLink
              href="https://github.com/bagle-ggul/Bagel-Frontend/blob/main/CHANGELOG.md"
              target="_blank"
              rel="noopener noreferrer"
              title="Changelog 확인"
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </ChangelogLink>
          </VersionInfo>
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
                <CreditsButtonStyled onClick={() => setShowCredits(true)}>
                  크레딧
                </CreditsButtonStyled>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/signup">회원가입</SecondaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/login">로그인</SecondaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <CreditsButtonStyled onClick={() => setShowCredits(true)}>
                  크레딧
                </CreditsButtonStyled>
              </ButtonWrapper>
            </>
          )}
        </ButtonGroup>
      </MainWrapper>

      {isAuthenticated && <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>}

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
              <CloseButton onClick={() => setShowCredits(false)}>닫기</CloseButton>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Home;