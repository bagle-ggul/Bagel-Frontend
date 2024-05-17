import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ProfileWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url("/img/community.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
`;

const ProfileCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 30px;
  width: 90%;
  max-width: 400px;
  text-align: center;
`;

const ProfileImage = styled(motion.img)`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-bottom: 20px;
`;

const UserName = styled(motion.h2)`
  font-size: 2em;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
`;

const UserDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DetailRow = styled(motion.div)`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 5px 0;
`;

const DetailTitle = styled.span`
  font-weight: bold;
  color: #333;
`;

const DetailValue = styled.span`
  color: black;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 10px;
`;

const ButtonSpan = styled.span`
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-left: 10px;
  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #444;
    transform: translateY(0);
  }
`;

function Profile() {
  const accessToken = localStorage.getItem("refreshToken");
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "https://api.she-is-newyork-bagel.co.kr/api/my-page",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 토큰을 적절하게 설정
            },
          }
        );
        setProfile(response?.data);
        console.log(profile);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, [accessToken]);

  if (!profile) return <div>Loading...</div>;

  return (
    <ProfileWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <ProfileCard
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.div whileHover={{ scale: 1.1 }}>
          <ProfileImage
            src={profile.profileImageUrl || "/img/character.png"}
            alt="Profile"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          />
          <UserName
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {profile.characterName}
          </UserName>
          <UserDetailContainer>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <DetailTitle>이메일:</DetailTitle>
              <DetailValue>{profile.email}</DetailValue>
            </DetailRow>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.4 }}
            >
              <DetailTitle>생일:</DetailTitle>
              <DetailValue>
                {new Date(profile.birthDate).toLocaleDateString()}
              </DetailValue>
            </DetailRow>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.6 }}
            >
              <DetailTitle>성별:</DetailTitle>
              <DetailValue>{profile.gender}</DetailValue>
            </DetailRow>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.8 }}
            >
              <DetailTitle>MBTI:</DetailTitle>
              <DetailValue>{profile.mbti.toUpperCase()}</DetailValue>
            </DetailRow>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <DetailTitle>총 획득 호감도:</DetailTitle>
              <DetailValue>{profile.totalScore}</DetailValue>
            </DetailRow>
            <DetailRow
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 2 }}
            >
              <DetailTitle>총 회귀수:</DetailTitle>
              <DetailValue>{profile.totalRegressionCount}</DetailValue>
            </DetailRow>
          </UserDetailContainer>
        </motion.div>
      </ProfileCard>
      <ButtonContainer>
        <Link to={"/"}>
          <ButtonSpan>홈</ButtonSpan>
        </Link>
        <Link to={"/board/1"}>
          <ButtonSpan>랭킹 보기</ButtonSpan>
        </Link>
        <Link to={"/intro"}>
          <ButtonSpan>다시하기</ButtonSpan>
        </Link>
      </ButtonContainer>
    </ProfileWrapper>
  );
}

export default Profile;
