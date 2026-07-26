import React from "react";
import styled from "styled-components";
import { motion } from "framer-motion";
import { componentStyles } from "../styles/theme";

const ProfileImage = styled(motion.img)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 3px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  object-fit: cover;
  object-position: center 30%;
  transition: opacity 0.3s ease;
  transform: translateY(-10px);

  &:hover {
    border-color: rgba(200, 182, 226, 0.6);
    box-shadow: 0 12px 30px rgba(200, 182, 226, 0.2);
  }

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
    transform: translateY(-8px);
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
    transform: translateY(-6px);
  }
`;

const UserName = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1.5rem;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  letter-spacing: -0.02em;

  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }

  @media (max-width: 480px) {
    font-size: 1.8rem;
    margin-bottom: 1rem;
  }
`;

const UserDetailContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.8rem;
  width: 100%;
`;

const DetailRow = styled(motion.div)`
  ${({ theme }) =>
    theme &&
    Object.entries(theme)
      .map(([key, value]) => `${key}: ${value};`)
      .join(" ")}

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    flex-direction: column;
    gap: 0.3rem;
    text-align: center;

    &:hover {
      transform: translateY(-2px) scale(1.01);
    }
  }
`;

const DetailTitle = styled.span`
  font-weight: 600;
  color: rgba(200, 182, 226, 1);
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const DetailValue = styled.span`
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
  font-size: 1rem;

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const ProfileContent = ({ profile, itemVariants, containerVariants }) => {
  return (
    <>
      <ProfileImage
        src={"/img/mc_profile_main.png"}
        alt="Profile"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.6,
          delay: 0.3,
        }}
      />
      <UserName
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        {profile?.characterName}
      </UserName>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        style={{ width: "100%" }}
      >
        <UserDetailContainer>
          <DetailRow
            theme={componentStyles.detailRow}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <DetailTitle>이메일</DetailTitle>
            <DetailValue>{profile?.email}</DetailValue>
          </DetailRow>
          <DetailRow
            theme={componentStyles.detailRow}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <DetailTitle>생일</DetailTitle>
            <DetailValue>{new Date(profile?.birthDate).toLocaleDateString()}</DetailValue>
          </DetailRow>
          <motion.div
            variants={itemVariants}
            style={{
              display: "flex",
              gap: "12px",
              width: "100%",
            }}
          >
            <DetailRow
              theme={componentStyles.detailRow}
              style={{ flex: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <DetailTitle>성별</DetailTitle>
              <DetailValue>{profile?.gender}</DetailValue>
            </DetailRow>
            <DetailRow
              theme={componentStyles.detailRow}
              style={{ flex: 1 }}
              whileHover={{ scale: 1.02 }}
            >
              <DetailTitle>MBTI</DetailTitle>
              <DetailValue>{profile?.mbti}</DetailValue>
            </DetailRow>
          </motion.div>
        </UserDetailContainer>
      </motion.div>
    </>
  );
};

export default ProfileContent;
