import styled from "styled-components";
import { Link } from "react-router-dom";

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
  border-radius: 20px;
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
  a {
    font-size: 3rem;
    margin-top: 15px;
  }
  span:hover {
    transition: all 0.3s;
    color: skyblue;
  }
`;

function Home() {
  return (
    <div>
      <Wrapper>
        <img src="/img/image1.png" alt="" />
        <img src="/img/image2.png" alt="" />
        <img src="/img/image3.png" alt="" />
      </Wrapper>
      <MainWrapper>
        <h1>SAVE ME</h1>
        <Config>
          <Link to={"/signup"}>
            <span>회원가입</span>
          </Link>
          <Link to={"/login"}>
            <span>로그인</span>
          </Link>
        </Config>
      </MainWrapper>
    </div>
  );
}

export default Home;
