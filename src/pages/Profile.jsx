import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 5rem;
`;

const Main = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 5rem;
  text-align: center;
`;

const AvatarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
`;

const Avatar = styled.div`
  width: 8rem;
  height: 8rem;
  background-color: #111;
  border-radius: 50%;
`;

export default function Profile() {
  const [userData, setUserData] = useState(null);

  const fetchUserData = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      console.log(refreshToken);
      const response = await axios.post(
        "https://api.she-is-newyork-bagel.co.kr/api/token",
        { refreshToken: refreshToken }
      );
      setUserData(response.data);
    } catch (error) {
      console.error("Failed to authenticate:", error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  if (!userData) return <div>Loading...</div>;
  return (
    <Wrapper>
      <Main>
        <AvatarWrapper>
          <Avatar />
          <span>User name</span>
        </AvatarWrapper>
        <AvatarWrapper>
          <span>호감도 ❤️ : </span>
        </AvatarWrapper>
      </Main>
    </Wrapper>
  );
}
