import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "../utils/axios";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { House, Trophy, Controller } from "react-bootstrap-icons";
import { getAuthToken } from "../utils/auth";
import GlassCard from "../components/GlassCard";
import ProfileContent from "../components/ProfileContent";
import StatsContent from "../components/StatsContent";

const ProfileWrapper = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: url("/img/bg_community_main.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
`;

// 데스크톱 레이아웃 컨테이너
const DesktopContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  height: 100%;
  align-items: center;
  justify-content: center;
  max-width: 1400px;
  margin: 0 auto;
  padding-top: 76px; /* 버튼(44px) + 여백(16px) + 패딩(16px) */

  @media (max-width: 768px) {
    display: none;
  }
`;

// 모바일 레이아웃 컨테이너
const MobileContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    height: 100%;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    padding-top: 71px; /* 버튼(39px) + 여백(16px) + 패딩(16px) */
  }

  @media (max-width: 480px) {
    padding-top: 66px; /* 버튼(34px) + 여백(16px) + 패딩(16px) */
  }
`;





// 로딩 상태를 위한 스켈레톤 컴포넌트
const SkeletonCard = styled(motion.div)`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  padding: 3rem 2.5rem;
  text-align: center;
  color: white;
  max-width: 500px;
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 90vw;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    max-width: 95vw;
  }
`;

const SkeletonElement = styled(motion.div)`
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.1) 0%,
    rgba(255, 255, 255, 0.2) 50%,
    rgba(255, 255, 255, 0.1) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;

  @keyframes shimmer {
    0% {
      background-position: -200% 0;
    }
    100% {
      background-position: 200% 0;
    }
  }
`;

const SkeletonCircle = styled(SkeletonElement)`
  width: 150px;
  height: 150px;
  border-radius: 50%;

  @media (max-width: 768px) {
    width: 120px;
    height: 120px;
  }

  @media (max-width: 480px) {
    width: 100px;
    height: 100px;
  }
`;

const SkeletonText = styled(SkeletonElement)`
  height: 20px;
  border-radius: 4px;
`;

const SkeletonTitle = styled(SkeletonElement)`
  height: 32px;
  width: 200px;
  border-radius: 6px;

  @media (max-width: 480px) {
    width: 150px;
    height: 28px;
  }
`;








const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 20px;
  gap: 10px;
  z-index: 100;

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

const ButtonSpan = styled.span`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          "/api/my-page",
          {
            headers: {
              Authorization: `Bearer ${getAuthToken()}`,
            },
          }
        );
        setProfile(response?.data);
      } catch (error) {
        // 프로필 로딩 실패 시 처리 (로그는 제거)
      }
    };

    fetchProfile();
  }, []);

  // 스태거 애니메이션을 위한 variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1],
      },
    },
  };

  // 로딩 컴포넌트
  const LoadingContent = () => (
    <>
      <DesktopContainer>
        <SkeletonCard
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SkeletonCircle />
          <SkeletonTitle />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1.2rem',
                }}
              >
                <SkeletonText style={{ width: '30%' }} />
                <SkeletonText style={{ width: '40%' }} />
              </motion.div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SkeletonTitle />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1.2rem',
                }}
              >
                <SkeletonText style={{ width: '50%' }} />
                <SkeletonText style={{ width: '30%' }} />
              </motion.div>
            ))}
          </div>
        </SkeletonCard>
      </DesktopContainer>

      <MobileContainer>
        <SkeletonCard
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <SkeletonCircle />
          <SkeletonTitle />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1.2rem',
                }}
              >
                <SkeletonText style={{ width: '30%' }} />
                <SkeletonText style={{ width: '40%' }} />
              </motion.div>
            ))}
          </div>
        </SkeletonCard>

        <SkeletonCard
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SkeletonTitle />
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            {[...Array(2)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  width: '100%',
                  height: '48px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 1.2rem',
                }}
              >
                <SkeletonText style={{ width: '50%' }} />
                <SkeletonText style={{ width: '30%' }} />
              </motion.div>
            ))}
          </div>
        </SkeletonCard>
      </MobileContainer>
    </>
  );

  return (
    <ProfileWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <AnimatePresence mode="wait">
        {!profile ? (
          <motion.div key="loading" exit={{ opacity: 0, scale: 0.95 }}>
            <LoadingContent />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* 데스크톱 레이아웃 */}
            <DesktopContainer>
              <GlassCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.02,
                  rotate: [0, -0.5, 0.5, 0],
                  transition: { duration: 0.3 },
                }}
                center
              >
                <ProfileContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </GlassCard>

              <GlassCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                whileHover={{
                  scale: 1.02,
                  rotate: [0, 0.5, -0.5, 0],
                  transition: { duration: 0.3 },
                }}
              >
                <StatsContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </GlassCard>
            </DesktopContainer>

            {/* 모바일 레이아웃 */}
            <MobileContainer>
              <GlassCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                center
              >
                <ProfileContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </GlassCard>

              <GlassCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.02 }}
              >
                <StatsContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </GlassCard>
            </MobileContainer>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1 }}
      >
        <ButtonContainer>
          <Link to={"/"}>
            <ButtonSpan>
              <House size={16} />
              홈
            </ButtonSpan>
          </Link>
          <Link to={"/board"}>
            <ButtonSpan>
              <Trophy size={16} />
              랭킹 보기
            </ButtonSpan>
          </Link>
          <Link to={"/intro"}>
            <ButtonSpan>
              <Controller size={16} />
              다시하기
            </ButtonSpan>
          </Link>
        </ButtonContainer>
      </motion.div>
    </ProfileWrapper>
  );
}

export default Profile;
