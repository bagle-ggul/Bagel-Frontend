import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "../utils/axios";
import DialogueSystem from "../components/DialogueSystem";
import introStory from "../data/stories/intro.json";

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
  const audioRef = useRef(null);
  const accessToken = localStorage.getItem("refreshToken");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "/api/my-page",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        setData(response.data);
        setLoading(false);
      } catch (error) {
        // console.error("Error fetching profile:", error);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [accessToken]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        // console.error("Error playing audio:", error);
      });
    }
  }, []);

  const handleStoryComplete = () => {
    navigate("/main1");
  };

  const handleSkip = () => {
    navigate("/main1");
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
