import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { scoreAtom } from "../atom/atom";
import axios from "../utils/axios";

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
  background-image: url("img/cafe.png");
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

  const refreshToken = localStorage.getItem("refreshToken"); // Retrieve the refresh token from local storage

  const handleSubmit = async () => {
    const userData = {
      finalScore: score,
      success: true,
      details: "string",
      gamePlaySeconds: 0,
    };

    try {
      const response = await axios.post(
        "/api/game/over",
        userData,
        {
          headers: {
            Authorization: `Bearer ${refreshToken}`,
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
      <img src="img/rstNukki.png" alt="레몬에이드" />
      <CenteredButton onClick={handleClick}>결과확인</CenteredButton>
    </CenteredDiv>
  );
}

export default Result;
