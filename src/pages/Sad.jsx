import React, { useState, useEffect, useRef } from "react";
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
  background: url("/img/bg_sad_main.png") no-repeat center center;
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
  width: 40rem;
  height: 60rem;
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

function Sad() {
  const characterName = useRecoilValue(characterNameAtom);

  const scenes = [
    {
      text: "그거 알아? 나 사실 수영 잘 할 줄 모른다?",
      character: "이수정",
    },
    {
      text: "진짜? 그러면 바다에 오면 안됐네.",
      character: characterName,
    },
    {
      text: "무슨 뜻이야? 지금 나랑 여기 괜히 왔다는 의미야?",
      character: "이수정",
    },
    {
      text: "있잖아.. 사실 나 너 때문에 오늘 하루 종일 기분 안 좋았어.",
      character: "이수정",
    },
    {
      text: "그게 무슨 말이야? 내가 뭐 잘못한 게 있어?",
      character: characterName,
    },
    {
      text: "난 그냥 농담으로 한 말이었어!",
      character: characterName,
    },
    {
      text: "내가 너랑 여기에 왜 같이 왔는지 모르겠다.",
      character: "이수정",
    },
    {
      text: "나 갈 거니까 따라오지마.",
      character: "이수정",
    },
    {
      text: "아니 잠깐만… 갑자기 왜 그래?! 기다려 봐!",
      character: characterName,
    },
    {
      text: "그녀를 잡아보려 했지만 그녀는 주인공을 뿌리치고 떠난다.",
      character: "해설",
    },
    {
      text: "시간을 되돌려 보려 하지만 시간은 그대로 흘러간다.",
      character: "해설",
    },
    {
      text: "왜 더 이상 시간을 돌릴 수 없지?",
      character: characterName,
    },
    {
      text: "이 능력은 서로를 좋아하는 마음이 있을 때만 사용할 수 있지.",
      character: "신비한 남자",
    },
    {
      text: "그녀의 마음이 완전히 떠나서 더 이상 시간을 되돌릴 수 없는 거야.",
      character: "신비한 남자",
    },
    {
      text: "그래도 그녀의 목숨은 살렸군.",
      character: "신비한 남자",
    },
    {
      text: "할 말을 다한 남자는 나타났을 때와 같이 눈치 챌 틈도 없이 사라진다.",
      character: "해설",
    },
    {
      text: "다행이라고 해야 하나? 그래도 그녀를 잃은 건 마찬가지 인데…",
      character: characterName,
    },
    {
      text: "상심한 체 주인공은 노을을 보며 바닷가에 서있는다.",
      character: "해설",
    },
  ];

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
        setCurrentScene((prevScene) => prevScene + 1);
      }, 4000); // 4초마다 다음 장면으로 전환

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    } else {
      // 모든 장면이 끝나면 Main1 페이지로 이동
      navigate("/profile");
    }
  }, [currentScene, navigate]);

  const { text, character } = scenes[currentScene];

  return (
    <SceneWrap>
      <StyledCharacterBackground>
        <img src="/img/her_sad_main.png" alt="여자" />
      </StyledCharacterBackground>
      <DialogueBox>
        <CharacterName>{character}</CharacterName>
        <DialogueText>{text}</DialogueText>
      </DialogueBox>
      <audio ref={audioRef} src="/audio/sad.mp3" loop />
    </SceneWrap>
  );
}

export default Sad;
