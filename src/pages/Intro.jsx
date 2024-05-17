import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";
import { useNavigate } from "react-router-dom";

const scenes = [
  {
    text: "드디어 오늘이네... 그녀와 단둘이 바닷가로 여행! 오늘은 정말 좋아한다고 말해야지.",
    character: "주인공",
  },
  {
    text: "이 파도 정말 시원해! 어서 와서 같이 놀자!",
    character: "여자",
  },
  {
    text: "안 돼! 조심해!",
    character: "주인공",
  },
  {
    text: "아.. 안 돼... 아직... 좋아한다고 말도 못했는데...",
    character: "주인공",
  },
  {
    text: "그녀를 구하고 싶은가?",
    character: "신비한 남자",
  },
  {
    text: "누구세요? 대체 어떻게...",
    character: "주인공",
  },
  {
    text: "나는 너에게 시간을 되돌릴 수 있는 능력을 줄 수 있어. 진심으로 그녀를 구하고 싶나?",
    character: "신비한 남자",
  },
  {
    text: "시간을 되돌릴 수 있다고요? 무슨 말도 안되는 소리예요?! 장난치지 마세요!",
    character: "주인공",
  },
  {
    text: "그녀를 구하고 싶지 않은 건가?",
    character: "신비한 남자",
  },
  {
    text: "…. 구하고 싶어요!",
    character: "주인공",
  },
  {
    text: "그럼 알겠다. 하지만 시간을 돌리는 능력을 무한정 쓸 수 있진 않으니 조심하도록 해.",
    character: "신비한 남자",
  },
  {
    text: "여긴... 집이잖아? 정말... 여행 전으로 돌아왔어... 이번엔 꼭 그녀를 구하고 고백할 거야.",
    character: "주인공",
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
  background: url("/img/intro.png") no-repeat center center;
  background-size: contain;
  padding: 20px;
  text-align: center;
  animation: ${fadeIn} 2s ease-in-out;
`;

const DialogueBox = styled.div`
  width: 80%;
  padding: 20px;
  background-color: rgba(255, 255, 255, 0.8); /* 투명도 설정 */
  border: 2px solid grey;
  border-radius: 10px;
  margin-bottom: 20px;
  text-align: center;
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

const SelectPageComponent = () => {
  const [currentScene, setCurrentScene] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    if (currentScene < scenes.length - 1) {
      const timer = setTimeout(() => {
        setCurrentScene(currentScene + 1);
      }, 4000); // 5초마다 다음 장면으로 전환

      return () => clearTimeout(timer); // 컴포넌트 언마운트 시 타이머 클리어
    } else {
      // 모든 장면이 끝나면 Main1 페이지로 이동
      navigate("/main1");
    }
  }, [currentScene, navigate]);

  const { text, character } = scenes[currentScene];

  return (
    <SceneWrap>
      <DialogueBox>
        <CharacterName>{character}</CharacterName>
        <DialogueText>{text}</DialogueText>
      </DialogueBox>
    </SceneWrap>
  );
};

export default SelectPageComponent;
