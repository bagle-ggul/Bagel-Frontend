import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";

import { scoreAtom } from "../atom/atom";
import DialogueSystem from "../components/DialogueSystem";
import { ROUTES } from "../constants/routes";
import introStory from "../data/stories/intro.json";
import { resetProgress } from "../game/progress";
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

const SceneWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
  background: url("/img/bg_intro_main.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
`;

const SkipButton = styled.button`
  position: absolute;
  top: 30px;
  right: 30px;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 12px;
  color: white;
  padding: 12px 24px;
  font-size: 1rem;
  font-weight: 600;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    top: 20px;
    right: 20px;
    padding: 10px 20px;
    font-size: 0.9rem;
  }
`;

const SelectPageComponent = () => {
  const navigate = useNavigate();
  const setScore = useSetRecoilState(scoreAtom);
  const audioRef = useRef(null);
  const [data, setData] = useState(null);
  // loading 값을 참조하는 곳이 없다 — 로딩 UI 미구현 (별도 확인 필요)
  const [, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get("/api/my-page");
        setData(response.data);
        setLoading(false);
      } catch (error) {
        logger.error("프로필 조회 실패:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        logger.warn("배경음 재생 실패:", error);
      });
    }
  }, []);

  // 인트로에서 스테이지로 넘어가는 시점이 곧 "새 게임 시작"이다.
  // 이전 판의 점수·진행도가 남아 있으면 엉뚱한 엔딩을 보게 된다.
  const startNewGame = () => {
    resetProgress();
    setScore(0);
    navigate(ROUTES.MAIN1);
  };

  const handleStoryComplete = () => {
    startNewGame();
  };

  const handleSkip = () => {
    startNewGame();
  };

  return (
    <SceneWrap>
      <DialogueSystem
        storyData={introStory.story}
        userData={data}
        onComplete={handleStoryComplete}
        autoProgress={true}
        enableControls={true}
      />
      <SkipButton onClick={handleSkip}>Skip</SkipButton>
      <audio ref={audioRef} src="/audio/intro.mp3" loop />
    </SceneWrap>
  );
};

export default SelectPageComponent;
