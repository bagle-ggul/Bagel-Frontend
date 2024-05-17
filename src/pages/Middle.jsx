import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { characterNameAtom } from "../atom/atom";

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
  overflow: hidden;
  background: url("/img/middle.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
  position: relative;
`;

const DialogueBox = styled.div`
  width: 80%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid grey;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
  z-index: 10;
`;

const CharacterName = styled.h2`
  margin: 0;
  padding: 0;
  font-size: 1.5em;
  font-weight: bold;
`;

const DialogueText = styled.p`
  font-size: 1.2em;
  font-weight: bold;
`;

const StyledCharacterBackground = styled.div`
  width: 40rem;
  height: 60rem;
  z-index: 5;
  position: absolute;
  bottom: 0;
  img {
    width: 100%;
    height: 100%;
    z-index: 5;
    border-radius: 10px;
  }
`;

function Middle() {
  const characterName = useRecoilValue(characterNameAtom);

  const scenes = [
    {
      text: "있잖아.. 넌 꿈이 뭐야?",
      character: "이수정",
    },
    {
      text: "나? 나는 아직 잘 모르겠어. 지금은 일단 하루하루에 충실하게 살고 있는 것 같아. 너는 어때? 네 꿈은 뭐야?",
      character: characterName,
    },
    {
      text: "그녀는 미소 지으며 그녀의 꿈을 말한다.",
      character: "해설",
    },
    {
      text: "둘은 밤새 이야기하며 서로의 사이는 더욱 깊어져 간다.",
      character: "해설",
    },
    {
      text: "주인공은 고백은 못했지만 그녀를 잃지 않고 함께 있음에 감사한다.",
      character: "해설",
    },
  ];

  const [currentScene, setCurrentScene] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene((prevScene) => prevScene + 1);
      }, 4000); // 4초마다 다음 장면으로 전환

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    } else {
      // 모든 장면이 끝나면 Main1 페이지로 이동
      navigate("/main1");
    }
  }, [currentScene, navigate, scenes.length]);

  const { text, character } = scenes[currentScene];

  console.log(character);

  return (
    <SceneWrap>
      <StyledCharacterBackground>
        <img src="/img/middle누끼.png" alt="여자" />
      </StyledCharacterBackground>
      <DialogueBox>
        <CharacterName>{character}</CharacterName>
        <DialogueText>{text}</DialogueText>
      </DialogueBox>
    </SceneWrap>
  );
}

export default Middle;
