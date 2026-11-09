import { motion } from "framer-motion";
import React from "react";
import styled from "styled-components";

import { border, text } from "../styles/semantic";
import { componentStyles } from "../styles/theme";
import { media } from "../styles/theme";
import { shadow } from "../styles/tokens";

import { DetailRow, DetailTitle, DetailValue } from "./DetailRow.styled";

const ProfileImage = styled(motion.img)`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  margin-bottom: 1.5rem;
  border: 3px solid ${border.strong};
  box-shadow: ${shadow.avatar};
  object-fit: cover;
  object-position: center 30%;
  transition: opacity 0.3s ease;
  transform: translateY(-10px);

  &:hover {
    border-color: ${border.accentStrong};
    box-shadow: ${shadow.avatarHover};
  }

  ${media.tablet} {
    width: 120px;
    height: 120px;
    transform: translateY(-8px);
  }

  ${media.mobile} {
    width: 100px;
    height: 100px;
    margin-bottom: 1rem;
    transform: translateY(-6px);
  }
`;

const UserName = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${text.primary};
  margin-bottom: 1.5rem;
  text-shadow: ${shadow.text};
  letter-spacing: -0.02em;

  ${media.tablet} {
    font-size: 2rem;
    margin-bottom: 1.2rem;
  }

  ${media.mobile} {
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

const ProfileContent = ({ profile, itemVariants, containerVariants }) => {
  return (
    <>
      <ProfileImage
        src={"/img/mc_profile_main.webp"}
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
            <DetailTitle>MBTI</DetailTitle>
            <DetailValue>{profile?.mbti}</DetailValue>
          </DetailRow>
        </UserDetailContainer>
      </motion.div>
    </>
  );
};

export default ProfileContent;
