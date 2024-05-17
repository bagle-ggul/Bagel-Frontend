import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const StyledBackGround = styled.div`
  padding: 5rem;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url(${(props) => props.bgImage}) no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCharacterBackground = styled.div`
  width: 20rem;
  height: 30rem;
  img {
    width: 100%;
    height: 100%;
    z-index: 10;
    border-radius: 10px;
  }
`;

const StyledTextWrap = styled.div`
  width: 90%;
  background-color: white;
  border-radius: 10px;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledSelectButton = styled.button`
  height: 30%;
  width: 40%;
  border-radius: 10px;
  border: 1px solid grey;
  margin: 0.3%;
  cursor: pointer;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.5s ease-in-out;
  &:hover {
    background-color: #111;
    color: white;
  }
`;

const StyledChatWrap = styled.div`
  width: 90%;
  height: 20%;
  background-color: white;
  border-radius: 10px;
  padding: 2rem;
  border: 1px solid grey;
  justify-content: center;
  display: flex;
  align-items: center;
  margin: 1rem 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const NextButton = styled.button`
  padding: 5rem 10rem;
  border-radius: 10px;
  background-color: red;
  font-size: 3rem;
  margin: 0.3%;
  cursor: pointer;
`;

function SelectPageComponent({ backgroundImage, characterImage, storyData }) {
  const [index, setIndex] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [subText, setSubText] = useState([]);
  const [subIndex, setSubIndex] = useState(0);
  const navigate = useNavigate();

  const currentScene = storyData.home.plot[index];

  const onClicked = (option) => {
    if (option.error) {
      alert(option.error);
      navigate("/");
    } else {
      setSubText(option.subtext.split("^").map((text) => text.trim()));
      setToggle(true);
      setSubIndex(0);
    }
  };

  const onSubClicked = () => {
    if (subIndex < subText.length - 1) {
      setSubIndex(subIndex + 1);
    } else {
      setToggle(false);
      setIndex((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!toggle) {
      setSubText([]);
      setSubIndex(0);
    }
  }, [toggle]);

  return (
    <StyledBackGround bgImage={backgroundImage}>
      <StyledCharacterBackground>
        <img src={characterImage} alt="Character" />
      </StyledCharacterBackground>
      {index < storyData.home.plot.length ? (
        <>
          <StyledChatWrap>{currentScene.text}</StyledChatWrap>
          <StyledTextWrap>
            {toggle ? (
              <StyledSelectButton onClick={onSubClicked}>
                {subText[subIndex]}
              </StyledSelectButton>
            ) : (
              currentScene.options.map((option, i) => (
                <StyledSelectButton key={i} onClick={() => onClicked(option)}>
                  {option.ans}
                </StyledSelectButton>
              ))
            )}
          </StyledTextWrap>
        </>
      ) : (
        <NextButton>
          <Link to={"/"}>다음 스테이지로...</Link>
        </NextButton>
      )}
    </StyledBackGround>
  );
}

export default SelectPageComponent;
