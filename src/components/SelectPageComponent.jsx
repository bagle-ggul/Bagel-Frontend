import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  width: 20rem;
  height: 30rem;
  img {
    width: 100%;
    height: 100%;
    z-index: 10;
    border-radius: 10px;
  }
`;

const StyledTextWrap = styled.div`
  width: 90%;
  height: 40%;
  background-color: white;
  border-radius: 10px;
  padding: 1%;
  border: 1px solid grey;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledSelectButton = styled.div`
  height: 30%;
  width: 40%;
  border-radius: 10px;
  border: 1px solid grey;
  margin: 0.3%;
  cursor: pointer;
`;

const StyledChatWrap = styled.div`
  width: 90%;
  height: 20%;
  background-color: white;
  border-radius: 10px;
  padding: 1%;
  border: 1px solid grey;
  justify-content: center;
  display: flex;
  align-items: center;
`;

const NextButton = styled.button`
  padding: 5rem 10rem;
  border-radius: 10px;
  background-color: red;
  font-size: 3rem;
  margin: 0.3%;
  cursor: pointer;
`;

function SelectPageComponent({
  backgroundImage,
  characterImage,
  buttonSelects,
  chatting,
}) {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const onClicked = () => {
    setIndex((prev) => prev + 1);
  };

  return (
    <StyledBackGround bgImage={backgroundImage}>
      <StyledCharacterBackground>
        <img src={characterImage} alt="Character" />
      </StyledCharacterBackground>
      {index <= 2 ? (
        <>
          <StyledChatWrap>{chatting.plot[index].text}</StyledChatWrap>
          <StyledTextWrap>
            {buttonSelects.plot[index].text.map((text, i) => (
              <StyledSelectButton key={i} onClick={onClicked}>
                {text.ans}
              </StyledSelectButton>
            ))}
          </StyledTextWrap>
        </>
      ) : (
        <NextButton>
          <Link to={"/"}>다음 스테이지로...</Link>
        </NextButton>
      )}
    </StyledBackGround>
  );
}

export default SelectPageComponent;
