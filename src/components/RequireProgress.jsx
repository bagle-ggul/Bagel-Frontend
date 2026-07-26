import React from "react";
import { Navigate } from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { canEnterStage, getMaxStage, isGameCompleted } from "../game/progress";

/**
 * 게임 진행도에 따라 화면 접근을 제어하는 가드.
 *
 * 목적은 보안이 아니다. 클라이언트 가드이므로 우회 자체를 막지는 못한다.
 * 정상적으로 플레이하는 사용자가 새로고침이나 뒤로가기, 잘못된 링크로
 * **깨진 상태에 빠지지 않게** 하는 것이 목적이다.
 * (예: 점수 0인 채로 최종 스테이지에 들어가 엉뚱한 엔딩을 보는 상황)
 *
 * @param {number} [stage] 스테이지 번호. 지정하면 직전 스테이지까지 진행했는지 확인
 * @param {boolean} [requireCompleted] 참이면 게임 완료자만 통과 (결과·엔딩 화면)
 * @param {boolean} [requireStarted] 참이면 게임을 시작한 사람만 통과 (게임오버 화면)
 */
const RequireProgress = ({ stage, requireCompleted = false, requireStarted = false, children }) => {
  if (requireCompleted && !isGameCompleted()) {
    return <Navigate to={ROUTES.INTRO} replace />;
  }

  // 게임오버는 플레이 도중 발생하므로 "완료"가 아니라 "시작" 여부로 판단해야 한다
  if (requireStarted && getMaxStage() < 1) {
    return <Navigate to={ROUTES.INTRO} replace />;
  }

  if (stage !== undefined && !canEnterStage(stage)) {
    return <Navigate to={ROUTES.INTRO} replace />;
  }

  return children;
};

export default RequireProgress;
