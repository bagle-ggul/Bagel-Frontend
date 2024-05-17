
import styled from "styled-components";

const StyledBackGround = styled.div`
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url(${(props) => props.bgImage}) no-repeat center center;
  background-size: cover;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledCharacterBackground = styled.div`
  width: 35%;
  height: 70%;
  img {
    width: 100%;
    height: 100%;
    z-index: 10;
  }
`;

const StyledTextWrap = styled.div`
  width: 90%;
  height: 23%;
  background-color: white;
  border: 10px;
  padding: 5%;
  border: 1px solid grey;
`;

function SelectPageComponent({ backgroundImage, characterImage }) {
  return (
    <StyledBackGround bgImage={backgroundImage}>
      <StyledCharacterBackground>
        <img src={characterImage} alt="Character" />
      </StyledCharacterBackground>
      <StyledTextWrap>sfsfsffs</StyledTextWrap>
    </StyledBackGround>
  );
}

export default SelectPageComponent;
