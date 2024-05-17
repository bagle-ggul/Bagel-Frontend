import React from "react";
import { useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import styled from "styled-components";
import { scoreAtom } from "../atom/atom";

const CenteredButton = styled.button`
  position: absolute;
  top: 50%;
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

function Result() {
  const navigate = useNavigate();
  const score = useRecoilValue(scoreAtom);

  const handleClick = () => {
    if (score >= 100) {
      navigate("/happy");
    } else if (score >= 50 && score < 100) {
      navigate("/middle");
    } else {
      navigate("/sad");
    }
  };

  return (
    <div>
      <CenteredButton onClick={handleClick}>결과확인</CenteredButton>
    </div>
  );
}

export default Result;
