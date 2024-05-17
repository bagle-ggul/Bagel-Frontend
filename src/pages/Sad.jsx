import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { scoreAtom } from "../atom/atom";
import axios from "axios";

const CenteredButton = styled.button`
  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem 2rem;
  font-size: 1.5rem;
  cursor: pointer;
  background-color: #4caf50;
  color: white;
  border: none;
  border-radius: 5px;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #45a049;
  }
`;

const CenteredDiv = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: #45a049;
  }
`;

function Result() {
  const navigate = useNavigate();
  const score = useRecoilValue(scoreAtom);

  return (
    <CenteredDiv>
      <img src="img/카페라뗴.png" alt="레몬에이드" />
      <CenteredButton>결과확인</CenteredButton>
    </CenteredDiv>
  );
}

export default Result;
