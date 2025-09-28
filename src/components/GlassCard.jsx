import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { glassCard } from '../styles/theme';

const BaseCard = styled(motion.div)`
  ${({ theme }) => theme.background && `background: ${theme.background};`}
  ${({ theme }) => theme.backdropFilter && `backdrop-filter: ${theme.backdropFilter};`}
  ${({ theme }) => theme.border && `border: ${theme.border};`}
  ${({ theme }) => theme.boxShadow && `box-shadow: ${theme.boxShadow};`}
  ${({ theme }) => theme.borderRadius && `border-radius: ${theme.borderRadius};`}
  ${({ theme }) => theme.transition && `transition: ${theme.transition};`}

  padding: 3rem 2.5rem;
  color: white;
  max-width: 500px;
  width: 100%;
  cursor: pointer;

  &:hover {
    ${({ theme }) => theme.hover?.background && `background: ${theme.hover.background};`}
    ${({ theme }) => theme.hover?.borderColor && `border-color: ${theme.hover.borderColor};`}
    ${({ theme }) => theme.hover?.boxShadow && `box-shadow: ${theme.hover.boxShadow};`}
    ${({ theme }) => theme.hover?.transform && `transform: ${theme.hover.transform};`}
  }

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 90vw;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1.2rem;
    max-width: 95vw;
    &:hover {
      transform: translateY(-2px);
    }
  }
`;

const GlassCard = ({ children, center = false, ...props }) => {
  return (
    <BaseCard
      theme={glassCard}
      style={{
        textAlign: center ? 'center' : 'left',
        ...props.style
      }}
      {...props}
    >
      {children}
    </BaseCard>
  );
};

export default GlassCard;