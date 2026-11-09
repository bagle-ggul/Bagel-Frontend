import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect, useCallback } from "react";
import { House, Trophy, Controller } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import ProfileContent from "../components/ProfileContent";
import StatsContent from "../components/StatsContent";
import { Button } from "../components/ui";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

import {
  ButtonContainer,
  DesktopContainer,
  ErrorMessage,
  ErrorPanel,
  MobileContainer,
  ProfileCard,
  ProfileWrapper,
  SkeletonCard,
  SkeletonCircle,
  SkeletonList,
  SkeletonRow,
  SkeletonText,
  SkeletonTitle,
  TopNavButton,
} from "./Profile.styled";

/** 조회 실패 시 상황을 알리고 재시도 동선을 제공한다 */
const ErrorContent = ({ message, onRetry }) => (
  <ErrorPanel>
    <ErrorMessage>{message}</ErrorMessage>
    <Button type="button" onClick={onRetry}>
      다시 시도
    </Button>
  </ErrorPanel>
);

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
              <ProfileCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{
                  scale: 1.02,
                  rotate: [0, -0.5, 0.5, 0],
                  transition: { duration: 0.3 },
                }}
                $isCentered
              >
                <ProfileContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </ProfileCard>

              <ProfileCard
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
              </ProfileCard>
            </DesktopContainer>

            {/* 모바일 레이아웃 */}
            <MobileContainer>
              <ProfileCard
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                whileHover={{ scale: 1.02 }}
                $isCentered
              >
                <ProfileContent
                  profile={profile}
                  itemVariants={itemVariants}
                  containerVariants={containerVariants}
                />
              </ProfileCard>

              <ProfileCard
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
              </ProfileCard>
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
          <TopNavButton as={Link} to="/" variant="ghost">
            <House size={16} />홈
          </TopNavButton>
          <TopNavButton as={Link} to="/board" variant="ghost">
            <Trophy size={16} />
            랭킹 보기
          </TopNavButton>
          <TopNavButton as={Link} to="/intro" variant="ghost">
            <Controller size={16} />
            다시하기
          </TopNavButton>
        </ButtonContainer>
      </motion.div>
    </ProfileWrapper>
  );
}

export default Profile;
