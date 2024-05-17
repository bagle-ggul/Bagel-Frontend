import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import styled, { keyframes } from "styled-components";
import { scoreAtom } from "../atom/atom";
import axios from "axios";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const CenteredButton = styled.button`
  position: absolute;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: skyblue;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    transition: all 0.3s;
    color: black;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  background-image: url("img/road.png"); /* Update the path if necessary */
  background-size: cover;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh; /* Full viewport height */
  animation: ${fadeIn} 4s forwards; /* Apply fade-in effect on load */
  &.fade-out {
    animation: ${fadeOut} 4s forwards;
  }
  img {
    margin-top: 170px;
  }
`;

function GameOver() {
  const [fadeOutEffect, setFadeOutEffect] = useState(false);
  const navigate = useNavigate();
  const score = useRecoilValue(scoreAtom);
  const setScore = useSetRecoilState(scoreAtom); // 상태 업데이트를 위한 함수
  console.log(score);

  const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the refresh token from local storage

  const handleSubmit = async () => {
    const userData = {
      finalScore: score,
      success: false,
      details: "string",
      gamePlaySeconds: 0,
    };
    console.log(userData);

    try {
      const response = await axios.post(
        "https://api.she-is-newyork-bagel.co.kr/api/game/over",
        userData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
            "Content-Type": "application/json", // 명확하게 JSON으로 전송
          },
        }
      );

      console.log(response.data);
      // Handle success (e.g., display a success message, redirect to another page, etc.)
    } catch (error) {
      console.error(error);
      alert("중복된 이메일입니다");
      // Handle error (e.g., display an error message)
    }
  };

  const handleClick = async () => {
    setFadeOutEffect(true);
    setTimeout(() => {
      setScore(0); // score 초기화
      navigate("/intro");
      handleSubmit();
    }, 1000); // 1초 후에 페이지를 이동합니다.
  };

  return (
    <CenteredDiv className={fadeOutEffect ? "fade-out" : ""}>
      <img src="img/house3-2.png" alt="레몬에이드" />
      <CenteredButton onClick={handleClick}>회귀하기</CenteredButton>
    </CenteredDiv>
  );
}

export default GameOver;
