import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { House, Trophy, Controller } from "react-bootstrap-icons";
import { Link } from "react-router-dom";
import styled from "styled-components";

import GlassCard from "../components/GlassCard";
import ProfileContent from "../components/ProfileContent";
import StatsContent from "../components/StatsContent";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

// 스켈레톤 로딩 UI — 원래 인라인 style로 4번 반복되던 것
const SkeletonList = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const SkeletonRow = styled(motion.div)`
  width: 100%;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.2rem;
`;

const ErrorPanel = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 2.5rem 2rem;
  max-width: 26rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
`;

const ErrorMessage = styled.p`
  margin: 0;
  font-size: 1rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.85);
`;

const RetryButton = styled.button`
  padding: 0.7rem 1.8rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(200, 182, 226, 0.9);
  color: white;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
  }
`;

/** 조회 실패 시 상황을 알리고 재시도 동선을 제공한다 */
const ErrorContent = ({ message, onRetry }) => (
  <ErrorPanel>
    <ErrorMessage>{message}</ErrorMessage>
    <RetryButton type="button" onClick={onRetry}>
      다시 시도
    </RetryButton>
  </ErrorPanel>
);

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
  /* 자리표시자 너비는 행마다 달라서 prop으로 받는다.
     transient prop($ 접두사)이라 DOM으로 전달되지 않는다 */
  width: ${(props) => props.$width || "100%"};
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
  const [loadError, setLoadError] = useState(null);

  // 조회에 실패해도 에러 상태가 없으면 스켈레톤이 영원히 표시된다.
  // 사용자는 계속 로딩 중이라고 여기고 기다리게 된다.
  const fetchProfile = useCallback(async () => {
    setLoadError(null);
    try {
      // 토큰은 axios 인터셉터가 주입한다
      const response = await axios.get("/api/my-page");
      setProfile(response?.data);
    } catch (error) {
      logger.error("프로필 조회 실패:", error);
      setLoadError("내 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.");
    }
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

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
          <SkeletonList>
            {[...Array(4)].map((_, i) => (
              <SkeletonRow key={i}>
                <SkeletonText $width="30%" />
                <SkeletonText $width="40%" />
              </SkeletonRow>
            ))}
          </SkeletonList>
        </SkeletonCard>

        <SkeletonCard
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SkeletonTitle />
          <SkeletonList>
            {[...Array(2)].map((_, i) => (
              <SkeletonRow key={i}>
                <SkeletonText $width="50%" />
                <SkeletonText $width="30%" />
              </SkeletonRow>
            ))}
          </SkeletonList>
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
          <SkeletonList>
            {[...Array(4)].map((_, i) => (
              <SkeletonRow key={i}>
                <SkeletonText $width="30%" />
                <SkeletonText $width="40%" />
              </SkeletonRow>
            ))}
          </SkeletonList>
        </SkeletonCard>

        <SkeletonCard
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <SkeletonTitle />
          <SkeletonList>
            {[...Array(2)].map((_, i) => (
              <SkeletonRow key={i}>
                <SkeletonText $width="50%" />
                <SkeletonText $width="30%" />
              </SkeletonRow>
            ))}
          </SkeletonList>
        </SkeletonCard>
      </MobileContainer>
    </>
  );

  return (
    <ProfileWrapper initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1 }}>
      <AnimatePresence mode="wait">
        {loadError ? (
          <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <ErrorContent message={loadError} onRetry={fetchProfile} />
          </motion.div>
        ) : !profile ? (
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
              <House size={16} />홈
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
