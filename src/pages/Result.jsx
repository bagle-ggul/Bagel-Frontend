import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";

import { scoreAtom } from "../atom/atom";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

const CenteredButton = styled.button`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: saddlebrown;
  color: white;
  border: none;
  border-radius: 15px;
  transition: background-color 0.3s ease;

  &:hover {
    transition: all 0.3s;
    background-color: #e5792b;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("img/bg_cafe_main.png");
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh; /* Full viewport height */
  img {
    margin-top: 320px;
  }
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
      // 전송에 실패해도 엔딩은 그대로 보여준다. 기록만 남지 않을 뿐이다.
      // (이전에는 회원가입 쪽 문구인 "중복된 이메일입니다"를 띄우고 있었다)
      logger.error("게임 결과 전송 실패:", error);
    }
  };

  const handleClick = async () => {
    await handleSubmit();
    if (score >= 100) {
      navigate("/happy");
    } else if (score >= 50 && score < 100) {
      navigate("/middle");
    } else {
      navigate("/sad");
    }
  };

  return (
    <CenteredDiv>
      <img src="img/mc_result_main.png" alt="레몬에이드" />
      <CenteredButton onClick={handleClick}>결과확인</CenteredButton>
    </CenteredDiv>
  );
}

export default Result;
