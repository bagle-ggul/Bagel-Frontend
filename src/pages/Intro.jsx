import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import styled from "styled-components";

import { characterNameAtom, scoreAtom } from "../atom/atom";
import { DialoguePlayer } from "../components/scene";
import { Button } from "../components/ui";
import { ROUTES } from "../constants/routes";
import introStory from "../data/stories/intro.json";
import { fromIntroStory } from "../game/dialogueScript";
import { PLAY_MODE } from "../game/playMode";
import { resetProgress } from "../game/progress";
import { getPreloadImages } from "../game/stages";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { useImagePreload } from "../hooks/useImagePreload";
import { layer } from "../styles/semantic";
import { spacing } from "../styles/tokens";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

const INTRO_BACKGROUND = "/img/bg_intro_main.webp";
const INTRO_MUSIC = "/audio/intro.m4a";
const FIRST_STAGE = 1;

// 1스테이지 화면 코드 미리 받기 (실패는 무시, 실제 진입 시 다시 시도)
const warmFirstStageChunk = () => import("./StagePage").catch(() => {});

// 왼쪽 위 고정 (오른쪽 위 조작 버튼과 겹치지 않게, 플레이어보다 위)
const IntroSkipButton = styled(Button)`
  position: fixed;
  top: ${spacing.md};
  left: ${spacing.md};
  z-index: ${layer.sticky};
`;

/**
 * 인트로 화면: 닉네임 조회 > 자동 재생 대사 > 끝나거나 건너뛰면 새 게임 시작
 */
function Intro() {
  const navigate = useNavigate();
  const audioRef = useBackgroundMusic();
  const setScore = useSetRecoilState(scoreAtom);
  const [characterName, setCharacterName] = useRecoilState(characterNameAtom);

  // 닉네임 조회 (실패해도 기본 이름으로 진행)
  useEffect(() => {
    const fetchCharacterName = async () => {
      try {
        const response = await axios.get("/api/my-page");
        if (response.data?.characterName) setCharacterName(response.data.characterName);
      } catch (error) {
        logger.error("프로필 조회 실패:", error);
      }
    };
    fetchCharacterName();
  }, [setCharacterName]);

  // 인트로 재생 중 1스테이지 그림·화면 코드 미리 받기 (진입 시 빈 화면 방지)
  const firstStageImages = useMemo(() => getPreloadImages(FIRST_STAGE), []);
  useImagePreload(firstStageImages);
  useEffect(() => {
    warmFirstStageChunk();
  }, []);

  const script = useMemo(
    () => fromIntroStory(introStory.story, { playerName: characterName }),
    [characterName]
  );

  // 인트로 종료 시점이 곧 새 게임 시작 (이전 판 점수·진행도가 남으면 엉뚱한 엔딩)
  const startNewGame = () => {
    resetProgress();
    setScore(0);
    navigate(ROUTES.MAIN1);
  };

  const handleSkipClick = (mouseEvent) => {
    mouseEvent.stopPropagation();
    startNewGame();
  };

  return (
    <>
      <DialoguePlayer
        script={script}
        scopeId="intro"
        background={INTRO_BACKGROUND}
        ambient="none"
        initialMode={PLAY_MODE.AUTO}
        allowSkip={false}
        playerName={characterName}
        onSceneDone={startNewGame}
      />
      <IntroSkipButton type="button" variant="ghost" onClick={handleSkipClick}>
        인트로 건너뛰기
      </IntroSkipButton>
      <audio ref={audioRef} src={INTRO_MUSIC} loop />
    </>
  );
}

export default Intro;
