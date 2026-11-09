import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { scoreAtom } from "../atom/atom";
import { Button } from "../components/ui";
import { ENDING_ROUTE_BY_ID, resolveEnding } from "../game/ending";
import { getChoiceHistory } from "../game/progress";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

// 결과 확인 화면: 카페 배경 + 레몬에이드 그림 + 하단 확인 버튼
const ResultScreen = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100vh;
  background-image: url("/img/bg_cafe_main.webp");
  background-size: cover;
  background-repeat: no-repeat;

  img {
    margin-top: 320px;
  }
`;

// 하단 중앙 고정 확인 버튼
const ResultConfirmButton = styled(Button)`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

function Result() {
  const navigate = useNavigate();
  const score = useRecoilValue(scoreAtom);

  const handleSubmit = async () => {
    const userData = {
      finalScore: score,
      success: true,
      details: "string",
      gamePlaySeconds: 0,
    };

    try {
      // 토큰은 axios 인터셉터가 주입한다
      await axios.post("/api/game/over", userData);
    } catch (error) {
      // 전송 실패해도 엔딩 진행 (랭킹 기록만 누락)
      logger.error("게임 결과 전송 실패:", error);
    }
  };

  const handleClick = async () => {
    await handleSubmit();
    // 점수 + 이번 회차 고른 선택 > 엔딩 (히든 > 해피 > 미들 > 새드)
    const endingId = resolveEnding({ score, choiceHistory: getChoiceHistory() });
    navigate(ENDING_ROUTE_BY_ID[endingId]);
  };

  return (
    <ResultScreen>
      <img src="/img/mc_result_main.webp" alt="레몬에이드" />
      <ResultConfirmButton size="lg" onClick={handleClick}>
        결과확인
      </ResultConfirmButton>
    </ResultScreen>
  );
}

export default Result;
