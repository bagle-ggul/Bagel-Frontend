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
  display: flex;
  flex-direction: column;
  gap: 3rem;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  font-size: x-large;
  color: white; /* 텍스트 색상을 배경과 대조되도록 설정 */
  background: rgba(0, 0, 0, 0.5); /* 배경을 반투명하게 설정하여 가독성 향상 */
  padding: 20px; /* 텍스트 주위에 여백 추가 */
  border-radius: 10px; /* 모서리를 둥글게 설정 */
  width: 50rem;
  h1 {
    font-size: 8rem;
    font-weight: 500;
  }
`;

const Config = styled.div`
  display: flex;
  flex-direction: column;
  span {
    font-size: 3rem;
  }
`;

function Home() {
  return (
    <div>
      <Wrapper>
        <img src="/image1.png" alt="" />
        <img src="/image2.png" alt="" />
        <img src="/image3.png" alt="" />
      </Wrapper>
      <MainWrapper>
        <h1>SAVE ME</h1>
        <Config>
          <span>게임시작</span>
          <span>도움말</span>
        </Config>
      </MainWrapper>
    </div>
  );
}

export default Home;
