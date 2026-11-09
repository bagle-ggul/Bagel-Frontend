import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";

import { scoreAtom } from "../atom/atom";
import { DialoguePlayer } from "../components/scene";
import { Button } from "../components/ui";
import { ROUTES } from "../constants/routes";
import { toStageScript } from "../game/dialogueScript";
import {
  incrementRegressionCount,
  markGameCompleted,
  markStageReached,
  recordChoice,
} from "../game/progress";
import { resolveAfterScene } from "../game/stageProgress";
import { getPreloadImages, getStageConfig } from "../game/stages";
import { resolveStageExit } from "../game/storyFlow";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { useImagePreload } from "../hooks/useImagePreload";
import { usePlayerName } from "../hooks/usePlayerName";

// 다음 장소로 버튼 등장 페이드 (초)
const END_BUTTON_FADE_SECONDS = 0.5;

/**
 * 스테이지 화면 공통: 설정 표(stages.js) > 대사 플레이어 > 점수 누적 > 장면 전이 > 다음 장소
 * 진입 시 진행도 기록, 닉네임 비어 있으면 프로필 조회
 */
function StagePage({ stage }) {
  const config = getStageConfig(stage);
  const navigate = useNavigate();
  const audioRef = useBackgroundMusic();
  const [score, setScore] = useRecoilState(scoreAtom);
  const characterName = usePlayerName();

  // 분기 없는 마지막 스테이지 방어값
  const fallbackExit = config.defaultExit ?? ROUTES.RESULT;
  // 렌더를 기다리지 않는 최신 점수 (선택 직후 장면 종료 판정용)
  const scoreRef = useRef(score);
  // 다음 목적지는 state (0점 선택은 점수 변화 없어 재렌더 없음 > ref면 버튼 주소 갱신 누락)
  const [nextStageRoute, setNextStageRoute] = useState(fallbackExit);

  const preloadImages = useMemo(() => getPreloadImages(stage), [stage]);
  useImagePreload(preloadImages);

  // 진행도 기록 (다음 스테이지 가드 통과 조건)
  useEffect(() => {
    markStageReached(stage);
  }, [stage]);

  const script = useMemo(
    () => toStageScript(config.storyData, { playerName: characterName }),
    [config, characterName]
  );

  // 선택: 선택 기록 + 점수 누적(게임오버 제외) + 다음 목적지 갱신(카페 돈 줍기 분기)
  const handleChoose = useCallback(
    ({ sceneIndex, choiceIndex, choice }) => {
      recordChoice({ stage, sceneIndex, choiceIndex, label: choice.label });
      if (!choice.gameOver) {
        scoreRef.current += choice.score;
        setScore(scoreRef.current);
      }
      setNextStageRoute(resolveStageExit(stage, choiceIndex, fallbackExit));
    },
    [stage, fallbackExit, setScore]
  );

  // 장면 종료: 게임오버·결과 이동 > 다음 장면 > 스테이지 끝
  const handleSceneDone = useCallback(
    ({ sceneIndex, choice }) => {
      const step = resolveAfterScene({
        stage,
        sceneIndex,
        sceneCount: script.length,
        score: scoreRef.current,
        gameOver: choice?.gameOver,
      });
      if (step.type === "navigate") {
        // 결과·엔딩 화면 진입 자격
        if (step.completed) markGameCompleted();
        // 게임오버 = 회귀 1회 (이어지는 대사를 다 본 뒤 1번만)
        if (choice?.gameOver) incrementRegressionCount();
        navigate(step.to);
        return undefined;
      }
      if (step.type === "scene") return step;
      return { type: "end" };
    },
    [stage, script.length, navigate]
  );

  const endSlot = (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: END_BUTTON_FADE_SECONDS }}
    >
      <Button as={Link} to={nextStageRoute} size="lg">
        다음 장소로
      </Button>
    </motion.div>
  );

  return (
    <>
      <DialoguePlayer
        script={script}
        scopeId={`stage-${stage}`}
        background={config.background}
        ambient={config.ambient}
        playerName={characterName}
        onChoose={handleChoose}
        onSceneDone={handleSceneDone}
        endSlot={endSlot}
      />
      <audio ref={audioRef} src={config.music} loop />
    </>
  );
}

StagePage.propTypes = {
  stage: PropTypes.oneOf([1, 2, 3, 4, 5]).isRequired,
};

export default StagePage;
