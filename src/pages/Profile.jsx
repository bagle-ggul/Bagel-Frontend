// src/components/Profile.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

const ProfileWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url("/img/background.png") no-repeat center center;
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
  color: #333;
  margin-bottom: 10px;
`;

const UserDetail = styled(motion.p)`
  font-size: 1em;
  color: #666;
  margin: 5px 0;
`;

/*
{
  "id": 1,
  "email": "string",
  "characterName": "string",
  "role": "USER",
  "status": "ACTIVE",
  "profileImageUrl": null,
  "totalScore": 0,
  "birthDate": "1999-10-29",
  "gender": "male",
  "mbti": "estj",
  "totalRegressionCount": 0,
  "gameProgress": "NOT_STARTED",
  "refreshToken": null
}
*/
function Profile() {
  const [profile, setProfile] = useState({
    id: 1,
    email: "string",
    characterName: "string",
    role: "USER",
    status: "ACTIVE",
    profileImageUrl: null,
    totalScore: 0,
    birthDate: "1999-10-29",
    gender: "male",
    mbti: "estj",
    totalRegressionCount: 0,
  });

  // Uncomment this block to fetch profile data from an API
  // useEffect(() => {
  //   const fetchProfile = async () => {
  //     try {
  //       const response = await axios.get(
  //         "https://api.she-is-newyork-bagel.co.kr/api/signup"
  //       ); // Replace with your API endpoint
  //       setProfile(response.data);
  //     } catch (error) {
  //       console.error("Error fetching profile:", error);
  //     }
  //   };

  //   fetchProfile();
  // }, []);

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
          src={"/img/character.png"}
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
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          Email: {profile.email}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          Role: {profile.role}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
        >
          Status: {profile.status}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          Total Score: {profile.totalScore}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          Birth Date: {new Date(profile.birthDate).toLocaleDateString()}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.6 }}
        >
          Gender: {profile.gender}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
        >
          MBTI: {profile.mbti.toUpperCase()}
        </UserDetail>
        <UserDetail
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 2 }}
        >
          Total Regression Count: {profile.totalRegressionCount}
        </UserDetail>
        </motion.div>
      </ProfileCard>
   
    </ProfileWrapper>
  );
}

export default Profile;
