import PropTypes from "prop-types";
import { useCallback, useMemo } from "react";
import { Link } from "react-router-dom";

import { DialoguePlayer } from "../components/scene";
import { Button } from "../components/ui";
import { ROUTES } from "../constants/routes";
import endingsJson from "../data/stories/endings.json";
import { ENDING_IDS, toEndingScript } from "../game/ending";
import { getChoiceHistory, getRegressionCount } from "../game/progress";
import { useBackgroundMusic } from "../hooks/useBackgroundMusic";
import { usePlayerName } from "../hooks/usePlayerName";
import { motionCurve, motionSeconds } from "../styles/tokens";

import {
  ButtonRow,
  ChoiceStageLabel,
  ChoiceSummaryItem,
  ChoiceSummaryList,
  EmptyChoiceText,
  EndingSubtitle,
  EndingTitle,
  RegressionCountText,
  SectionHeading,
  SummaryCard,
  SummaryMotion,
} from "./EndingPage.styled";

// 엔딩은 장면 1개 > 끝나면 종료 슬롯 표시
const finishEndingScene = () => ({ type: "end" });

/**
 * 엔딩 화면 공통: 엔딩 대사 재생 > 회차 요약(고른 선택, 회귀 횟수) > 홈·랭킹
 * 엔딩별 대사·배경·캐릭터·음악은 endings.json
 */
function EndingPage({ endingId }) {
  const ending = endingsJson[endingId];
  const audioRef = useBackgroundMusic();
  const characterName = usePlayerName();

  const script = useMemo(
    () => toEndingScript(ending, { playerName: characterName }),
    [ending, characterName]
  );
  // 회차 요약은 진입 시점 값 고정
  const choiceHistory = useMemo(() => getChoiceHistory(), []);
  const regressionCount = useMemo(() => getRegressionCount(), []);

  const handleSceneDone = useCallback(finishEndingScene, []);

  const endSlot = (
    <SummaryMotion
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: motionSeconds.slow, ease: motionCurve.soft }}
    >
      <SummaryCard as="section" padding="lg" aria-label="회차 요약">
        <EndingTitle>{ending.title}</EndingTitle>
        <EndingSubtitle>{ending.subtitle}</EndingSubtitle>

        <SectionHeading>이번 회차에 고른 선택</SectionHeading>
        {choiceHistory.length > 0 ? (
          <ChoiceSummaryList>
            {choiceHistory.map((entry) => (
              <ChoiceSummaryItem key={`${entry.stage}-${entry.sceneIndex}`}>
                <ChoiceStageLabel>스테이지 {entry.stage}</ChoiceStageLabel>
                {entry.label}
              </ChoiceSummaryItem>
            ))}
          </ChoiceSummaryList>
        ) : (
          <EmptyChoiceText>기록된 선택이 없어요</EmptyChoiceText>
        )}

        <RegressionCountText>회귀 {regressionCount}번</RegressionCountText>

        <ButtonRow>
          <Button as={Link} to={ROUTES.HOME} variant="secondary">
            홈
          </Button>
          <Button as={Link} to={ROUTES.BOARD}>
            랭킹 확인
          </Button>
        </ButtonRow>
      </SummaryCard>
    </SummaryMotion>
  );

  return (
    <>
      <DialoguePlayer
        script={script}
        scopeId={`ending-${endingId}`}
        background={ending.background}
        playerName={characterName}
        onSceneDone={handleSceneDone}
        endSlot={endSlot}
      />
      {/* 음악 없는 엔딩(hidden)은 audio 생략 */}
      {ending.music && <audio ref={audioRef} src={ending.music} loop />}
    </>
  );
}

EndingPage.propTypes = {
  endingId: PropTypes.oneOf(ENDING_IDS).isRequired,
};

export default EndingPage;
