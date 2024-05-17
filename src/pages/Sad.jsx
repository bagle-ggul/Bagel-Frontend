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
    background-color: #11b4ef;
    border-radius: 15px;
    margin-top: 20px;
    width: 510px;
    height: 100px;
  }

  .imgDiv {
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url("img/sadBack.png");
    background-size: cover; /* or 'contain' depending on the desired effect */
    background-repeat: no-repeat;
    width: 100%;
    height: 100vh; /* Full height */
    max-height: 100vh;

    img {
      border-radius: 15px;
      width: 13%; /* Make the image take the full width of the container */
      height: auto; /* Maintain the aspect ratio */
    }
  }
`;

function Sad() {
  return (
    <CenteredDiv>
      <div className="imgDiv">
        <img src="img/sadnukki.png" alt="레몬에이드" />
      </div>
      <div className="textDiv">
        <p>안녕하세요 호오옹</p>
      </div>
    </CenteredDiv>
  );
}

export default Sad;
