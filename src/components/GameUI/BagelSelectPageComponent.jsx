import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState, useRecoilValue } from "recoil";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { scoreAtom, characterNameAtom } from "../../atom/atom";
import BagelDialogBox from "./BagelDialogBox";
import BagelChoiceButton from "./BagelChoiceButton";

const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url(${(props) => props.$bgImage}) no-repeat center center;
  background-size: cover;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;

  /* 배경에 약간의 오버레이 추가 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(0, 0, 0, 0.1) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(0, 0, 0, 0.1) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }

  @media (max-width: 480px) {
    padding: 0.5rem;
  }
`;

const CharacterSection = styled(motion.div)`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  z-index: 2;
`;

const BagelCharacterFrame = styled(motion.div)`
  position: relative;
  border-radius: 30px;

  img {
    width: 18rem;
    height: 27rem;
    border-radius: 30px;
    filter: drop-shadow(0 15px 35px rgba(0, 0, 0, 0.4));
    object-fit: cover;
    transition: all 0.3s ease;
    margin-bottom: -4px;
  }

  @media (max-width: 768px) {
    img {
      width: 14rem;
      height: 20rem;
    }
  }

  @media (max-width: 480px) {
    img {
      width: 11rem;
      height: 16rem;
    }
  }
`;

const DialogSection = styled.div`
  flex: 0 0 auto;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 2;

  @media (max-width: 768px) {
    max-width: 95%;
  }
`;

const ChoicesContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
`;

const NextStageButton = styled(motion.div)`
  flex: 0 0 auto;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2;
  margin-top: 2rem;
`;

const NextStageLink = styled(Link)`
  background: rgba(200, 182, 226, 0.8);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(200, 182, 226, 0.3);
  border-radius: 20px;
  padding: 1.5rem 3rem;
  color: white;
  font-size: 1.3rem;
  font-weight: 600;
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);

  &:hover {
    background: rgba(200, 182, 226, 0.9);
    transform: translateY(-3px);
    box-shadow: 0 12px 30px rgba(200, 182, 226, 0.4);
  }

  &:active {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    padding: 1.2rem 2.5rem;
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 2rem;
    font-size: 1rem;
  }
`;

const BagelSelectPageComponent = ({
  backgroundImage,
  characterImage,
  storyData,
  url,
  scene,
}) => {
  const [index, setIndex] = useState(0);
  const [toggle, setToggle] = useState(false);
  const [subText, setSubText] = useState([]);
  const [subIndex, setSubIndex] = useState(0);
  const [score, setScore] = useRecoilState(scoreAtom);
  const [base, setBase] = useState(url);
  const characterName = useRecoilValue(characterNameAtom);
  const navigate = useNavigate();

  console.log("현재 스코어:", score);

  const currentScene = storyData.plot[index];

  const replaceCharacterName = (text) => {
    return text.replace(/주인공/g, characterName);
  };

  const onClicked = (option, i) => {
    if (scene === 2) {
      if (i === 0) {
        setBase("/main4");
      } else {
        setBase("/main3");
      }
    }
    if (option.error) {
      navigate("/over");
    } else {
      // 기존 subtext 구조를 스마트하게 처리
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

  // 스피커 이름 결정 (필요에 따라 수정)
  const getSpeaker = () => {
    // storyData에 speaker 정보가 있다면 사용, 없다면 기본값
    return currentScene.speaker || null;
  };

  // 캐릭터 아이콘 결정
  const getCharacterIcon = () => {
    if (currentScene.speaker) {
      // 스피커별 아이콘 설정 (나중에 확장 가능)
      switch (currentScene.speaker) {
        case "이수정":
          return "👧";
        default:
          return "💬";
      }
    }
    return "💭"; // 나레이션
  };

  return (
    <GameContainer $bgImage={backgroundImage}>
      {index < storyData.plot.length ? (
        <>
          <CharacterSection>
            <BagelCharacterFrame
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <img src={currentScene.img} alt="Character" />
            </BagelCharacterFrame>
          </CharacterSection>

          <DialogSection>
            <BagelDialogBox
              text={replaceCharacterName(currentScene.text)}
              speaker={getSpeaker()}
              characterIcon={getCharacterIcon()}
              enableTypewriter={true}
              typingSpeed={50}
            />

            <AnimatePresence mode="wait">
              {toggle ? (
                <ChoicesContainer
                  key="subtext"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <BagelChoiceButton
                    text={subText[subIndex]}
                    onClick={onSubClicked}
                    index={0}
                    icon="▶"
                  />
                </ChoicesContainer>
              ) : (
                <ChoicesContainer
                  key="choices"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {currentScene.options.map((option, i) => {
                    // 선택지 중요도에 따른 variant 결정
                    let variant = "default";
                    if (option.score > 10) {
                      variant = "important";
                    } else if (option.error) {
                      variant = "danger";
                    }

                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.1, duration: 0.3 }}
                      >
                        <BagelChoiceButton
                          text={
                            // 스마트한 선택지 텍스트 처리
                            option.ans.startsWith('"') && option.ans.endsWith('"')
                              ? option.ans.slice(1, -1)  // 따옴표 제거
                              : option.ans  // 그대로 표시
                          }
                          onClick={() => onClicked(option, i)}
                          index={i}
                          variant={variant}
                          icon={option.error ? "⚠" : "▶"}
                        />
                      </motion.div>
                    );
                  })}
                </ChoicesContainer>
              )}
            </AnimatePresence>
          </DialogSection>
        </>
      ) : (
        <NextStageButton
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <NextStageLink to={base}>
            다음 스테이지로... ✨
          </NextStageLink>
        </NextStageButton>
      )}
    </GameContainer>
  );
};

export default BagelSelectPageComponent;