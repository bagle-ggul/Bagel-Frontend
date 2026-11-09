import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import { scoreAtom } from "../atom/atom";
import { Button, Card } from "../components/ui";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
`;

const NavigationContainer = styled(Card)`
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 2rem;
  width: 300px;
  z-index: 2;
  animation: ${modalFadeIn} 0.8s ease-out forwards;

  @media (max-width: 768px) {
    width: 280px;
    padding: 1.5rem;
    bottom: 6%;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-width: 90%;
    padding: 1rem;
    bottom: 4%;
    gap: 0.8rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

// 하단 버튼 공통: 컨테이너 폭을 채우는 큰 버튼
const NavButton = styled(Button)`
  width: 100%;
  padding: 1.2rem 2rem;
  font-size: 1.3rem;

  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url("/img/bg_underwater_main.webp");
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100vh; /* Full viewport height */
  animation: ${fadeIn} 4s forwards; /* Apply fade-in effect on load */
  &.fade-out {
    animation: ${fadeOut} 4s forwards;
  }

  img {
    max-width: 90%;
    max-height: 70vh;
    object-fit: contain;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -60%);
    z-index: 1;

    @media (max-width: 768px) {
      max-width: 85%;
      max-height: 60vh;
      transform: translate(-50%, -55%);
    }

    @media (max-width: 480px) {
      max-width: 120%;
      max-height: 50vh;
      transform: translate(-50%, -50%);
    }
  }
`;

function GameOver() {
  const [fadeOutEffect, setFadeOutEffect] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const score = useRecoilValue(scoreAtom);
  const setScore = useSetRecoilState(scoreAtom); // 상태 업데이트를 위한 함수

  useEffect(() => {
    // 2초 후에 모달 표시
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async () => {
    const userData = {
      finalScore: score,
      success: false,
      details: "string",
      gamePlaySeconds: 0,
    };

    try {
      // 토큰과 Content-Type은 axios 인터셉터가 처리한다
      await axios.post("/api/game/over", userData);
    } catch (error) {
      logger.error("게임 결과 전송 실패:", error);
    }
  };

  const handleNavigation = async (path) => {
    setFadeOutEffect(true);
    setTimeout(() => {
      setScore(0); // score 초기화
      navigate(path);
      handleSubmit();
    }, 1000); // 1초 후에 페이지를 이동합니다.
  };

  const handleHome = () => handleNavigation("/");
  const handleRankings = () => handleNavigation("/board");
  const handleProfile = () => handleNavigation("/profile");
  const handlePlayAgain = () => handleNavigation("/intro");

  return (
    <CenteredDiv className={fadeOutEffect ? "fade-out" : ""}>
      <img src="/img/her_underwater_gameover.webp" alt="게임오버 캐릭터" />
      {showModal && (
        <NavigationContainer>
          <NavButton variant="primary" onClick={handlePlayAgain}>
            회귀 하기
          </NavButton>
          <NavButton variant="secondary" onClick={handleHome}>
            홈
          </NavButton>
          <NavButton variant="secondary" onClick={handleRankings}>
            랭킹 확인
          </NavButton>
          <NavButton variant="secondary" onClick={handleProfile}>
            마이페이지
          </NavButton>
        </NavigationContainer>
      )}
    </CenteredDiv>
  );
}

export default GameOver;
