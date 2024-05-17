import React, { useState, useEffect, useRef } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const scenes = [
  {
    text: "있잖아… 너 덕분에 오늘 하루 정말 재밌었어! 진짜 이렇게 재밌는 하루는 정말 오랜만이야.",
    character: "여자",
  },
  {
    text: "그럼 나랑 좀 더 자주 이렇게 놀러 다닐래? 나도 좋아하는 사람이랑 같이 있으면 즐겁거든.",
    character: "주인공",
  },
  {
    text: "어? 뭐라고?",
    character: "여자",
  },
  {
    text: "나 너 좋아한다고. 네가 나한테 뉴욕 베이글을 사줬을 때부터. 그때부터 쭉 좋아했어.",
    character: "주인공",
  },
  {
    text: "나도… 나도 네가 좋아.",
    character: "여자",
  },
  {
    text: "그녀는 고백을 받아주고 두 사람은 연인이 된다. 해피 엔딩",
    character: "해설",
  },
];

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
  background: url("/img/weddingbackground.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
  position: relative;
`;

const DialogueBox = styled.div`
  width: 80%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* 투명도 설정 */
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
  width: 50rem;
  height: 80rem;
  z-index: 5;
  position: absolute;
  bottom: 0; /* Adjust the position as needed */
  img {
    width: 100%;
    height: 100%;
    z-index: 5;
    border-radius: 10px;
  }
`;

function Happy() {
  const [currentScene, setCurrentScene] = useState(0);
  const navigate = useNavigate();
  const audioRef = useRef(null);


  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error("Error playing audio:", error);
      });
    }
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(currentScene + 1);
      }, 4000); // 4초마다 다음 장면으로 전환

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    } else {
      // 모든 장면이 끝나면 Main1 페이지로 이동
      navigate("/main1");
    }
  }, [currentScene, navigate]);

  const { text, character } = scenes[currentScene];

  return (
    <SceneWrap>
      <StyledCharacterBackground>
        <img src="/img/웨딩누끼.png" alt="여자" />
      </StyledCharacterBackground>
      <DialogueBox>
        <CharacterName>{character}</CharacterName>
        <DialogueText>{text}</DialogueText>
      </DialogueBox>
      <audio ref={audioRef} src="/audio/happy.mp3" loop />
    </SceneWrap>
  );
}

export default Happy;
