import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { colors, glassmorphism, media } from '../styles/theme';
import { Play, Pause, ChevronLeft, ChevronRight, Check } from 'react-bootstrap-icons';

// 애니메이션 키프레임
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const typewriterEffect = keyframes`
  from { width: 0; }
  to { width: 100%; }
`;

const mysteriousAppear = keyframes`
  0% { opacity: 0; transform: scale(0.8) rotate(-5deg); }
  50% { opacity: 0.5; transform: scale(1.1) rotate(2deg); }
  100% { opacity: 1; transform: scale(1) rotate(0deg); }
`;

// 스타일 컴포넌트들
const DialogueContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: center;
  padding: 0 2rem;
  padding-bottom: calc(33vh - 100px); /* 100px 더 내림 */

  ${media.mobile} {
    padding: 0 1rem;
    padding-bottom: calc(33vh - 100px);
  }
`;

// 대화창 위에 떠있는 캐릭터 컨테이너 (메인화면 스타일)
const CharacterContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  margin-bottom: 1rem;

  ${media.mobile} {
    gap: 0;
    margin-bottom: 0.5rem;
  }
`;

const CharacterImage = styled.div`
  width: 600px; /* 1200px의 절반 */
  height: 400px; /* 800px의 절반 */
  background-image: url(${props => props.src});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  animation: ${fadeIn} 0.8s ease-out;
  margin-bottom: -20px; /* 큰 화면에서 더 가깝게 */

  ${media.mobile} {
    width: 500px; /* 1000px의 절반 */
    height: 320px; /* 640px의 절반 */
    margin-bottom: -10px; /* 모바일에서는 -10px */
  }
`;

const DialogueBox = styled.div`
  ${glassmorphism};
  width: 90%;
  max-width: 1000px;
  padding: 2rem;
  margin: 0 auto;
  position: relative;
  animation: ${fadeIn} 0.5s ease-out;

  ${media.mobile} {
    width: 95%;
    padding: 1.5rem;
  }
`;

const NamePlate = styled.div`
  ${glassmorphism};
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  position: absolute;
  top: -50px;
  left: 0;
  border-radius: 12px;
  max-width: fit-content;
  z-index: 10;

  ${media.mobile} {
    top: -45px;
    padding: 0.4rem 0.8rem;
  }
`;

const CharacterName = styled.h3`
  color: ${colors.textPrimary};
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;

  ${media.mobile} {
    font-size: 1rem;
  }
`;

const DialogueText = styled.p`
  color: ${colors.textPrimary};
  font-size: 1.1rem;
  line-height: 1.8;
  margin: 0;
  text-align: left;
  font-weight: 500;
  letter-spacing: 0.5px;

  ${media.mobile} {
    font-size: 1rem;
    line-height: 1.6;
  }

  ${({ isTyping }) => isTyping && css`
    overflow: hidden;
    white-space: nowrap;
    border-right: 2px solid ${colors.textPrimary};
    animation: ${typewriterEffect} 2s steps(40, end);
  `}
`;

const ControlButtons = styled.div`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  display: flex;
  gap: 0.5rem;
  z-index: 100;

  ${media.mobile} {
    bottom: 1.5rem;
    right: 1.5rem;
  }
`;

const ControlButton = styled.button`
  ${glassmorphism};
  padding: 0.6rem;
  color: ${colors.textPrimary};
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  svg {
    width: 16px;
    height: 16px;
  }

  ${media.mobile} {
    width: 36px;
    height: 36px;

    svg {
      width: 14px;
      height: 14px;
    }
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  background: ${colors.primary};
  transition: width 0.1s linear;
  border-radius: 0 0 20px 20px;
  opacity: 0.7;
`;

// 메인 컴포넌트
const DialogueSystem = ({
  storyData,
  userData,
  onComplete,
  autoProgress = true,
  enableControls = true
}) => {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef(null);
  const progressTimerRef = useRef(null);

  const currentScene = storyData?.scenes?.[currentSceneIndex];
  const character = currentScene ? storyData.characters[currentScene.speaker] : null;
  const isLastScene = currentSceneIndex >= (storyData?.scenes?.length - 1 || 0);

  // 주인공 캐릭터의 경우 실제 사용자 이름 사용
  const getCharacterDisplayName = (character) => {
    if (character?.id === 'mc' && userData?.characterName) {
      return userData.characterName;
    }
    return character?.displayName || character?.name || '???';
  };

  // 다음 씬으로 진행
  const nextScene = () => {
    if (isLastScene) {
      onComplete?.();
      return;
    }

    setCurrentSceneIndex(prev => prev + 1);
    setProgress(0);
  };

  // 이전 씬으로 이동
  const prevScene = () => {
    if (currentSceneIndex > 0) {
      setCurrentSceneIndex(prev => prev - 1);
      setProgress(0);
    }
  };

  // 자동 진행 타이머
  useEffect(() => {
    if (!autoProgress || isPaused || !currentScene) return;

    const duration = currentScene.duration || storyData?.settings?.defaultDuration || 4000;

    // 진행 바 애니메이션
    progressTimerRef.current = setInterval(() => {
      setProgress(prev => {
        const increment = 100 / (duration / 100);
        return Math.min(prev + increment, 100);
      });
    }, 100);

    // 다음 씬 타이머
    timerRef.current = setTimeout(() => {
      nextScene();
    }, duration);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [currentSceneIndex, autoProgress, isPaused, currentScene, storyData]);

  // 클릭으로 다음 진행
  const handleDialogueClick = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    nextScene();
  };

  // 일시정지/재생
  const togglePause = () => {
    setIsPaused(prev => !prev);
  };

  if (!storyData || !currentScene) {
    return <div>스토리 데이터를 불러오는 중...</div>;
  }

  return (
    <DialogueContainer>
      {/* 캐릭터 이미지 - 대화창 위에 떠있도록 */}
      {currentScene.characterImage && (
        <CharacterContainer>
          <CharacterImage src={currentScene.characterImage} />
        </CharacterContainer>
      )}

      {/* 대화창 */}
      <DialogueBox onClick={handleDialogueClick}>
        {/* 캐릭터 네임플레이트 */}
        <NamePlate>
          <CharacterName>
            {getCharacterDisplayName(character)}
          </CharacterName>
        </NamePlate>

        {/* 대화 텍스트 */}
        <DialogueText isTyping={isTyping}>
          {currentScene.text}
        </DialogueText>

        {/* 진행바 */}
        {autoProgress && !isPaused && (
          <ProgressBar style={{ width: `${progress}%` }} />
        )}
      </DialogueBox>

      {/* 컨트롤 버튼 */}
      {enableControls && (
        <ControlButtons>
          {currentSceneIndex > 0 && (
            <ControlButton onClick={prevScene} title="이전 대화">
              <ChevronLeft />
            </ControlButton>
          )}

          {autoProgress && (
            <ControlButton onClick={togglePause} title={isPaused ? '재생' : '일시정지'}>
              {isPaused ? <Play /> : <Pause />}
            </ControlButton>
          )}

          <ControlButton onClick={nextScene} title={isLastScene ? '완료' : '다음 대화'}>
            {isLastScene ? <Check /> : <ChevronRight />}
          </ControlButton>
        </ControlButtons>
      )}
    </DialogueContainer>
  );
};

export default DialogueSystem;