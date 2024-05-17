import React from "react";

import styled from "styled-components";

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
    background-color: #8fe0fd;
    border-radius: 15px;
    margin-top: 20px;
    width: 510px;
    height: 100px;
  }
  .imgDiv img {
    border-radius: 15px;
  }
`;

function Middle() {
  return (
    <CenteredDiv>
      <div className="imgDiv">
        <img src="img/soso.png" alt="레몬에이드" />
      </div>
      <div className="textDiv">
        <p>안녕하세요 호오옹</p>
      </div>
    </CenteredDiv>
  );
}

export default Middle;
