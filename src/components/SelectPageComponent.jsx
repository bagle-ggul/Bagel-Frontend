import React, { useState, useEffect } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { scoreAtom, characterNameAtom } from "../atom/atom";

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
    width: 20rem;
    height: 30rem;
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
  margin-bottom: 2rem;
`;

const StyledSelectButton = styled.button`
  height: 30%;
  width: 40%;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
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
  opacity: 1;
  border-radius: 10px;
  padding: 2rem;
  border: 1px solid grey;
  justify-content: center;
  text-align: center;
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  font-size: 1.5rem;
  font-weight: 600;
`;

const NextButton = styled.button`
  padding: 2rem 4rem; /* 패딩을 줄여서 더 깔끔하게 */
  border: none;
  border-radius: 10px; /* 둥근 모서리 */
  background-color: #ff4757; /* 부드러운 빨간색 */
  color: #fff; /* 흰색 텍스트 */
  font-size: 1.5rem; /* 텍스트 크기 적당히 조정 */
  margin: 0.5rem;
  cursor: pointer;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 부드러운 그림자 효과 */
  transition: all 0.3s ease; /* 부드러운 전환 효과 */
  &:hover {
    background-color: #e84118; /* 호버 시 색상 변경 */
    transform: translateY(-2px); /* 호버 시 살짝 위로 올라가는 효과 */
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.15); /* 호버 시 그림자 효과 강화 */
  }

  &:active {
    transform: translateY(0); /* 클릭 시 원래 위치로 */
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); /* 클릭 시 원래 그림자 */
  }
`;

function SelectPageComponent({
  backgroundImage,
  characterImage,
  storyData,
  url,
  scene,
}) {
  const [index, setIndex] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [subText, setSubText] = useState([]);
  const [subIndex, setSubIndex] = useState(0);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [base, setBase] = useState(url); // base 상태 추가
  const characterName = useRecoilValue(characterNameAtom);
  const navigate = useNavigate();

  console.log(score);

  const currentScene = storyData.plot[index];

  const replaceCharacterName = (text) => {
    return text.replace(/주인공/g, characterName);
  };

  const onClicked = (option, i) => {
    if (scene === 2) {
      if (i === 0) {
        setBase("/main4"); // setBase로 base 상태 업데이트
      } else {
        setBase("/main3"); // setBase로 base 상태 업데이트
      }
    }
    if (option.error) {
      navigate("/over");
    } else {
      setSubText(
        option.subtext
          .split("^")
          .map((text) => replaceCharacterName(text).trim())
      );
      setScore((prevScore) => prevScore + option.score);
      setToggle(true);
      setSubIndex(0);
    }
  };

  const onSubClicked = () => {
    if (subIndex < subText.length - 1) {
      setSubIndex(subIndex + 1);
    } else {
      setToggle(false);

      if (scene === 2) {
        if (index === 0) {
          if (score >= 15 && score < 40) {
            setIndex(1);
          } else if (score < 15) {
            setIndex(2);
          } else {
            setIndex(3);
          }
        } else if (index !== 1 && index !== 2) {
          setIndex((prev) => prev + 1);
        } else {
          setIndex(3);
        }
      } else if (scene === 3) {
        if (index === 1) {
          if (score >= 60) {
            setIndex(2);
          } else if (score >= 20 && score < 60) {
            setIndex(3);
          } else {
            setIndex(4);
          }
        } else if (index === 2 || index === 3 || index === 4) {
          setIndex(5);
        } else {
          setIndex((prev) => prev + 1);
        }
      } else if (scene === 4) {
        if (index === 2) {
          if (score >= 70) {
            setIndex(3);
          } else {
            setIndex(4);
          }
        } else {
          setIndex((prev) => prev + 1);
        }
      } else if (scene === 5) {
        if (index === 2) {
          navigate("/result");
        } else {
          setIndex((prev) => prev + 1);
        }
      } else {
        setIndex((prev) => prev + 1);
      }
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
      {index < storyData.plot.length ? (
        <>
          <StyledCharacterBackground>
            <img src={currentScene.img} alt="Character" />
          </StyledCharacterBackground>
          <StyledChatWrap>
            {replaceCharacterName(currentScene.text)
              .split("\n")
              .map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  <br />
                </React.Fragment>
              ))}
          </StyledChatWrap>
          <StyledTextWrap>
            {toggle ? (
              <StyledSelectButton onClick={onSubClicked}>
                {subText[subIndex]}
              </StyledSelectButton>
            ) : (
              currentScene.options.map((option, i) => (
                <StyledSelectButton
                  key={i}
                  onClick={() => onClicked(option, i)}
                >
                  {option.ans}
                </StyledSelectButton>
              ))
            )}
          </StyledTextWrap>
        </>
      ) : (
        <NextButton>
          <Link to={base}>다음 스테이지로...</Link>
        </NextButton>
      )}
    </StyledBackGround>
  );
}

export default SelectPageComponent;
