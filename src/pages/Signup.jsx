import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  position: relative;
  grid-template-columns: repeat(3, 1fr);
  height: 100vh;
  img {
    width: 100%;
    height: 100vh;
    object-fit: cover;
    object-position: center;
  }
`;

const MainWrapper = styled.div`
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute; /* Position it absolutely within the Wrapper */
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%); /* Center the MainWrapper div */
  color: white; /* Add text color for visibility, adjust as needed */
  font-size: 3rem; /* Adjust font size as needed */
  background: rgba(0, 0, 0, 0.5); /* 배경을 반투명하게 설정하여 가독성 향상 */
  h1 {
    font-size: 8rem;
    font-weight: 500;
  }
`;

function Signup() {
  return (
    <div>
      <Wrapper>
        <img src="/image1.png" alt="" />
        <img src="/image2.png" alt="" />
        <img src="/image3.png" alt="" />
        <MainWrapper>
          <input placeholder="name"></input>
        </MainWrapper>
      </Wrapper>
    </div>
  );
}

export default Signup;
