import { useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";

import { scoreAtom } from "../atom/atom";
import { DialoguePlayer } from "../components/scene";
import { Button } from "../components/ui";
import { ROUTES } from "../constants/routes";
import introStoryJson from "../data/stories/intro.json";
import { toIntroScript } from "../game/dialogueScript";
import { PLAY_MODE } from "../game/playMode";
import { resetProgress, resetRunProgress } from "../game/progress";
import { getPreloadImages } from "../game/stages";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { useImagePreload } from "../hooks/useImagePreload";
import { usePlayerName } from "../hooks/usePlayerName";
import { layer } from "../styles/semantic";
import { spacing } from "../styles/tokens";

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
  // 게임오버 "회귀 하기"로 들어옴 (회귀 횟수 유지)
  const isRegression = Boolean(useLocation().state?.isRegression);
  const audioRef = useBackgroundMusic();
  const setScore = useSetRecoilState(scoreAtom);
  // 게임 시작 시점이라 프로필 닉네임으로 1회 갱신
  const characterName = usePlayerName({ shouldRefresh: true });

  // 인트로 재생 중 1스테이지 그림·화면 코드 미리 받기 (진입 시 빈 화면 방지)
  const firstStageImages = useMemo(() => getPreloadImages(FIRST_STAGE), []);
  useImagePreload(firstStageImages);
  useEffect(() => {
    warmFirstStageChunk();
  }, []);

  const script = useMemo(
    () => toIntroScript(introStoryJson, { playerName: characterName }),
    [characterName]
  );

  // 인트로 종료 시점이 곧 새 게임 시작 (이전 판 점수·진행도가 남으면 엉뚱한 엔딩)
  // 회귀 재시작은 회차 상태만, 그 외는 회귀 횟수까지 초기화
  const startNewGame = () => {
    if (isRegression) resetRunProgress();
    else resetProgress();
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
