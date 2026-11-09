import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  PHASE,
  advanceFlow,
  chooseFlow,
  createFlowState,
  endFlow,
  selectChoices,
  selectLine,
  selectLineKey,
} from "../game/dialogueFlow";
import { isLineSeen, markLineSeen } from "../game/seenLines";

// 지난 대사 기록의 선택 항목 화자 id (DialogueLogModal이 "선택 · " 접두로 표시)
const CHOICE_LOG_SPEAKER_ID = "choice";

/**
 * 대사 흐름: 진행·선택 상태, 본 줄 기록, 지난 대사 로그, 장면 종료 통지
 * 장면 종료 시 onSceneDone 반환값 3종: scene > 그 장면 시작, end > 종료, 없음 > 호출자가 이동
 */
export function useDialogueFlow({
  script,
  scopeId,
  playerName,
  initialSceneIndex = 0,
  onChoose,
  onSceneDone,
}) {
  const [flow, setFlow] = useState(() =>
    createFlowState(script[initialSceneIndex], initialSceneIndex)
  );
  const [log, setLog] = useState([]);

  // 같은 틱 연속 입력(빠른 두 번 탭)도 최신 상태 기준으로 처리
  const flowRef = useRef(flow);
  const updateFlow = useCallback((nextFlow) => {
    flowRef.current = nextFlow;
    setFlow(nextFlow);
  }, []);

  // 최신 콜백 참조 (effect 재실행 방지)
  const callbacksRef = useRef({});
  callbacksRef.current = { onChoose, onSceneDone };

  const logIdRef = useRef(0);
  const appendLog = useCallback((entry) => {
    logIdRef.current += 1;
    const id = `log-${logIdRef.current}`;
    setLog((previousLog) => [...previousLog, { id, ...entry }]);
  }, []);

  const sceneScript = script[flow.sceneIndex];
  const line = sceneScript ? selectLine(flow, sceneScript) : null;
  const choices = sceneScript ? selectChoices(flow, sceneScript) : [];
  const lineKey = selectLineKey(flow, scopeId);
  const sprite = line?.sprite ?? sceneScript?.sprite ?? null;

  // 기록 전 본 줄 여부 (아래 effect의 markLineSeen보다 먼저 계산)
  const isLineSeenBefore = useMemo(() => lineKey !== null && isLineSeen(lineKey), [lineKey]);

  // 줄이 바뀌면 본 줄 기록 + 로그 추가 (StrictMode 이중 실행 시 1회)
  const lineRef = useRef(line);
  lineRef.current = line;
  const lastLoggedKeyRef = useRef(null);
  useEffect(() => {
    if (lineKey === lastLoggedKeyRef.current) return;
    lastLoggedKeyRef.current = lineKey;
    if (lineKey === null) return;
    markLineSeen(lineKey);
    const { speakerId, speakerName, text } = lineRef.current;
    appendLog({ speakerId, speakerName, text });
  }, [lineKey, appendLog]);

  // 장면 종료 통지 1회 > 반환값대로 이동
  const isSceneDoneHandledRef = useRef(false);
  useEffect(() => {
    if (flow.phase !== PHASE.SCENE_DONE) {
      isSceneDoneHandledRef.current = false;
      return;
    }
    if (isSceneDoneHandledRef.current) return;
    isSceneDoneHandledRef.current = true;

    const { sceneIndex, choiceIndex } = flow;
    const choice = choiceIndex === null ? null : script[sceneIndex].choices[choiceIndex];
    const nextStep = callbacksRef.current.onSceneDone?.({ sceneIndex, choiceIndex, choice });
    if (nextStep?.type === "scene" && script[nextStep.index]) {
      updateFlow(createFlowState(script[nextStep.index], nextStep.index));
    } else if (nextStep?.type === "scene" || nextStep?.type === "end") {
      // 없는 장면 번호도 종료로 처리
      updateFlow(endFlow(flowRef.current));
    }
  }, [flow, script, updateFlow]);

  const advance = useCallback(() => {
    const currentFlow = flowRef.current;
    const currentScene = script[currentFlow.sceneIndex];
    if (!currentScene) return;
    const nextFlow = advanceFlow(currentFlow, currentScene);
    if (nextFlow !== currentFlow) updateFlow(nextFlow);
  }, [script, updateFlow]);

  // 선택: onChoose 통지 > 선택 로그 > followUp 또는 장면 종료
  const choose = useCallback(
    (choiceIndex) => {
      const currentFlow = flowRef.current;
      const currentScene = script[currentFlow.sceneIndex];
      if (!currentScene) return;
      const nextFlow = chooseFlow(currentFlow, currentScene, choiceIndex);
      if (nextFlow === currentFlow) return;

      const choice = currentScene.choices[choiceIndex];
      callbacksRef.current.onChoose?.({ sceneIndex: currentFlow.sceneIndex, choiceIndex, choice });
      appendLog({ speakerId: CHOICE_LOG_SPEAKER_ID, speakerName: playerName, text: choice.label });
      updateFlow(nextFlow);
    },
    [script, playerName, appendLog, updateFlow]
  );

  return { flow, line, lineKey, isLineSeenBefore, choices, sprite, advance, choose, log };
}
