import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { scoreAtom } from "../atom/atom";
import axios from "../utils/axios";

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

const NavigationContainer = styled.div`
  position: absolute;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding: 2rem;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
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
    margin: 0 5%;
    padding: 1rem;
    bottom: 4%;
    gap: 0.8rem;
    left: 50%;
    transform: translateX(-50%);
  }
`;

const PrimaryNavButton = styled.button`
  padding: 1.2rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  display: block;
  width: 100%;
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

  &:active {
    transform: scale(0.97);
  }

  @media (max-width: 480px) {
    padding: 1rem 1.5rem;
    font-size: 1.1rem;
  }
`;

const SecondaryNavButton = styled.button`
  padding: 1.2rem 2rem;
  font-size: 1.3rem;
  font-weight: 600;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  text-align: center;
  display: block;
  width: 100%;
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

  &:active {
    transform: scale(0.97);
  }

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
  background-image: url("img/background_underwater.png");
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
  console.log(score);

  useEffect(() => {
    // 2초 후에 모달 표시
    const timer = setTimeout(() => {
      setShowModal(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the refresh token from local storage

  const handleSubmit = async () => {
    const userData = {
      finalScore: score,
      success: false,
      details: "string",
      gamePlaySeconds: 0,
    };
    console.log(userData);

    try {
      const response = await axios.post(
        "/api/game/over",
        userData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json", // 명확하게 JSON으로 전송
          },
        }
      );

      console.log(response.data);
      // Handle success (e.g., display a success message, redirect to another page, etc.)
    } catch (error) {
      console.error(error);

      // Handle error (e.g., display an error message)
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
  const handleRankings = () => handleNavigation("/board/1");
  const handleProfile = () => handleNavigation("/profile");
  const handlePlayAgain = () => handleNavigation("/intro");

  return (
    <CenteredDiv className={fadeOutEffect ? "fade-out" : ""}>
      <img src="img/her_game_over_giving_her_hand_underwater.png" alt="게임오버 캐릭터" />
      {showModal && (
        <NavigationContainer>
          <PrimaryNavButton onClick={handlePlayAgain}>회귀 하기</PrimaryNavButton>
          <SecondaryNavButton onClick={handleHome}>홈</SecondaryNavButton>
          <SecondaryNavButton onClick={handleRankings}>랭킹 확인</SecondaryNavButton>
          <SecondaryNavButton onClick={handleProfile}>마이페이지</SecondaryNavButton>
        </NavigationContainer>
      )}
    </CenteredDiv>
  );
}

export default GameOver;
