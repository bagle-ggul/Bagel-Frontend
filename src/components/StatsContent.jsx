import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { componentStyles } from '../styles/theme';

const StatsTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: rgba(200, 182, 226, 1);
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);

  @media (max-width: 768px) {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.3rem;
    margin-bottom: 1rem;
  }
`;

const StatsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const DetailRow = styled(motion.div)`
  ${({ theme }) => theme && Object.entries(theme).map(([key, value]) => `${key}: ${value};`).join(' ')}

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

const StatsContent = ({ profile, itemVariants, containerVariants }) => {
  return (
    <>
      <StatsTitle
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        게임 통계
      </StatsTitle>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.3 }}
        style={{ width: '100%' }}
      >
        <StatsContainer>
          <DetailRow
            theme={componentStyles.detailRow}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <DetailTitle>총 획득 호감도</DetailTitle>
            <DetailValue>{profile?.totalScore || 0}</DetailValue>
          </DetailRow>
          <DetailRow
            theme={componentStyles.detailRow}
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
          >
            <DetailTitle>총 회귀수</DetailTitle>
            <DetailValue>{profile?.totalRegressionCount || 0}</DetailValue>
          </DetailRow>
        </StatsContainer>
      </motion.div>
    </>
  );
};

export default StatsContent;