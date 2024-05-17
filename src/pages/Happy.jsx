import React from "react";

import styled from "styled-components";

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
  flex-direction: column;
  .textDiv {
    display: flex;
    justify-content: center;
    text-align: center;
    align-items: center;
    background-color: #caeffd;
    border-radius: 15px;
    margin-top: 20px;
    width: 510px;
    height: 100px;
  }
  .imgDiv img {
    border-radius: 15px;
  }
`;

function Happy() {
  return (
    <CenteredDiv>
      <div className="imgDiv">
        <img src="img/웨딩.png" alt="레몬에이드" />
      </div>
      <div className="textDiv">
        <p>안녕하세요 호오옹</p>
      </div>
    </CenteredDiv>
  );
}

export default Happy;
