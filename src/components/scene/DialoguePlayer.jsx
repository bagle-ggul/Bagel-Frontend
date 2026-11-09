import { AnimatePresence, MotionConfig, useReducedMotion } from "framer-motion";
import PropTypes from "prop-types";
import { useCallback, useMemo, useState } from "react";

import { PHASE } from "../../game/dialogueFlow";
import { PLAY_MODE, PLAY_MODES } from "../../game/playMode";
import { useAdvanceKeys } from "../../hooks/useAdvanceKeys";
import { useAutoPlay } from "../../hooks/useAutoPlay";
import { useDialogueFlow } from "../../hooks/useDialogueFlow";
import { useImagePreload } from "../../hooks/useImagePreload";
import { TYPING_SPEED_MS, useTypewriter } from "../../hooks/useTypewriter";
import { motionCurve, motionSeconds } from "../../styles/tokens";

import AmbientEffect from "./AmbientEffect";
import CharacterSprite from "./CharacterSprite";
import ChoiceList from "./ChoiceList";
import DialogueBox from "./DialogueBox";
import DialogueLogModal from "./DialogueLogModal";
import {
  ChoiceArea,
  ChoiceLayer,
  DialogueLayer,
  EndSlotArea,
  Screen,
  SpriteLayer,
} from "./DialoguePlayer.styled";
import PlayerControls from "./PlayerControls";
import SceneBackdrop from "./SceneBackdrop";

// 장면 전체 그림 주소 (배경 + 장면·줄 sprite, 중복 제거)
const collectImageUrls = (background, script) => {
  const spriteUrls = script.flatMap((scene) => [
    scene.sprite,
    ...scene.lines.map((line) => line.sprite),
    ...scene.choices.flatMap((choice) => choice.followUp.map((line) => line.sprite)),
  ]);
  return [...new Set([background, ...spriteUrls].filter(Boolean))];
};

// 장면 마지막 본 대사 (선택지 단계에서 대사창 유지용)
const selectLastSceneLine = (scene) => scene?.lines[scene.lines.length - 1] ?? null;

/**
 * 대사 플레이어: 탭·키 진행 > 선택지 > 이어지는 대사 > 장면 종료 통지
 * 조작 3종(자동, 건너뛰기, 지난 대사), 줄임 동작 설정 존중 (MotionConfig user)
 */
function DialoguePlayer({
  script,
  scopeId,
  background,
  ambient = "none",
  initialMode = PLAY_MODE.MANUAL,
  initialSceneIndex = 0,
  allowSkip = true,
  playerName,
  onChoose,
  onSceneDone,
  endSlot = null,
}) {
  const reduced = Boolean(useReducedMotion());
  const [mode, setMode] = useState(initialMode);
  const [isLogOpen, setIsLogOpen] = useState(false);

  const { flow, line, lineKey, isLineSeenBefore, choices, sprite, advance, choose, log } =
    useDialogueFlow({ script, scopeId, playerName, initialSceneIndex, onChoose, onSceneDone });
  const { phase } = flow;
  const isChoicePhase = phase === PHASE.CHOICES;
  const isEnded = phase === PHASE.ENDED;

  const typing = useTypewriter(line?.text ?? "", { speed: TYPING_SPEED_MS, resetKey: lineKey });

  const imageUrls = useMemo(() => collectImageUrls(background, script), [background, script]);
  useImagePreload(imageUrls);

  // 직접 탭·Space 진행 (로그 열림·선택지·종료는 무시, 자동·건너뛰기는 manual로 해제)
  const requestAdvance = useCallback(() => {
    if (isLogOpen || isChoicePhase || isEnded) return;
    if (mode !== PLAY_MODE.MANUAL) setMode(PLAY_MODE.MANUAL);
    if (typing.isDone) advance();
    else typing.complete();
  }, [isLogOpen, isChoicePhase, isEnded, mode, typing, advance]);

  useAdvanceKeys({
    enabled: !isLogOpen && !isEnded,
    onAdvance: requestAdvance,
    onChoose: choose,
    choiceCount: choices.length,
  });

  // 로그 열림 중에는 자동·건너뛰기 일시 정지 (표시 모드는 유지)
  useAutoPlay({
    mode: isLogOpen ? PLAY_MODE.MANUAL : mode,
    lineKey,
    isTypingDone: typing.isDone,
    isSeen: isLineSeenBefore,
    onComplete: typing.complete,
    onAdvance: advance,
    onStop: () => setMode(PLAY_MODE.MANUAL),
  });

  // 대사창 내용: 진행 중 줄 > 선택지 단계면 마지막 본 대사 (전체 표시, 진행 표시 없음)
  const lastSceneLine = isChoicePhase ? selectLastSceneLine(script[flow.sceneIndex]) : null;
  const dialogueBoxProps = line
    ? { line, visibleText: typing.visibleText, isDone: typing.isDone }
    : lastSceneLine && { line: lastSceneLine, visibleText: lastSceneLine.text, isDone: false };

  return (
    <MotionConfig reducedMotion="user">
      <SceneBackdrop src={background} sceneKey={flow.sceneIndex} reduced={reduced}>
        <Screen data-testid="dialogue-player" onClick={requestAdvance}>
          <AmbientEffect kind={ambient} reduced={reduced} />
          <SpriteLayer>
            <CharacterSprite src={sprite} alt="" reduced={reduced} />
          </SpriteLayer>
          {/* 선택지: 막과 함께 서서히 등장, 고르면 바로 사라짐 (선택 반응을 즉시 보여 줌) */}
          {isChoicePhase && (
            <ChoiceLayer
              key={`choices-${flow.sceneIndex}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: motionSeconds.base, ease: motionCurve.soft }}
            >
              <ChoiceArea>
                <ChoiceList choices={choices} onChoose={choose} />
              </ChoiceArea>
            </ChoiceLayer>
          )}
          {/* 대사창은 선택지 막 위 (선택 중에도 마지막 대사를 또렷하게) */}
          <DialogueLayer>{dialogueBoxProps && <DialogueBox {...dialogueBoxProps} />}</DialogueLayer>
          <PlayerControls
            mode={mode}
            onModeChange={setMode}
            canSkip={isLineSeenBefore}
            showSkip={allowSkip}
            onOpenLog={() => setIsLogOpen(true)}
          />
          <AnimatePresence>
            {isLogOpen && <DialogueLogModal entries={log} onClose={() => setIsLogOpen(false)} />}
          </AnimatePresence>
          {isEnded && endSlot && <EndSlotArea data-testid="end-slot">{endSlot}</EndSlotArea>}
        </Screen>
      </SceneBackdrop>
    </MotionConfig>
  );
}

const linePropType = PropTypes.shape({
  speakerId: PropTypes.string.isRequired,
  speakerName: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  sprite: PropTypes.string,
});

DialoguePlayer.propTypes = {
  script: PropTypes.arrayOf(
    PropTypes.shape({
      sprite: PropTypes.string,
      lines: PropTypes.arrayOf(linePropType).isRequired,
      choices: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string.isRequired,
          score: PropTypes.number,
          gameOver: PropTypes.bool,
          followUp: PropTypes.arrayOf(linePropType).isRequired,
        })
      ).isRequired,
    })
  ).isRequired,
  scopeId: PropTypes.string.isRequired,
  background: PropTypes.string.isRequired,
  ambient: PropTypes.oneOf(["rain", "dust", "petals", "sparkle", "none"]),
  initialMode: PropTypes.oneOf(PLAY_MODES),
  initialSceneIndex: PropTypes.number,
  allowSkip: PropTypes.bool,
  playerName: PropTypes.string.isRequired,
  onChoose: PropTypes.func,
  onSceneDone: PropTypes.func.isRequired,
  endSlot: PropTypes.node,
};

export default DialoguePlayer;
