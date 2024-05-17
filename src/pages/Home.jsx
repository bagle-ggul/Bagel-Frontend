import React, { useState, useEffect } from "react";
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
  color: white;
  background: rgba(0, 0, 0, 0.5);
  padding: 20px;
  border-radius: 10px;
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

const ProfileButton = styled(Link)`
  position: absolute;
  bottom: 20px;
  left: 20px;
  background-color: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 10px 20px;
  border-radius: 10px;
  font-size: 1.5rem;
  text-decoration: none;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #444;
    transform: translateY(0);
  }
`;
const EmphasizedHeading = styled.h1`
  font-weight: 400;
  font-style: normal;
  font-size: 3rem; /* 큰 폰트 크기 */
  color: #ff4757; /* 강조된 색상 */
  text-align: center; /* 가운데 정렬 */
  margin: 2rem 0; /* 상하 여백 */
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2); /* 텍스트 그림자 효과 */
`;

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("refreshToken");
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  return (
    <div>
      <Wrapper>
        <img src="/img/image1.png" alt="" />
        <img src="/img/image2.png" alt="" />
        <img src="/img/image3.png" alt="" />
      </Wrapper>
      <MainWrapper>
        <EmphasizedHeading>그녀를 구해라</EmphasizedHeading>
        <Config>
          {isAuthenticated ? (
            <Link to={"/intro"}>
              <span>게임 시작</span>
            </Link>
          ) : (
            <>
              <Link to={"/signup"}>
                <span>회원가입</span>
              </Link>
              <Link to={"/login"}>
                <span>로그인</span>
              </Link>
            </>
          )}
        </Config>
      </MainWrapper>
      {isAuthenticated && (
        <ProfileButton to={"/profile"}>내 정보</ProfileButton>
      )}
    </div>
  );
}

export default Home;
