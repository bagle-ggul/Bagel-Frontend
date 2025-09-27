import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const ChoiceContainer = styled(motion.button)`
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 1.5rem 2rem;
  min-height: 4rem;
  color: white;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 100%;
  margin: 0.5rem 0;
  text-align: left;
  line-height: 1.4;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);

  /* 호버 시 슬라이딩 효과 */
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(200, 182, 226, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    padding: 1.2rem 1.5rem;
    font-size: 1rem;
    margin: 0.3rem 0;
    gap: 0.8rem;
  }

  @media (max-width: 480px) {
    padding: 1rem 1.2rem;
    font-size: 0.9rem;
    margin: 0.2rem 0;
    gap: 0.6rem;
  }
`;

const ChoiceText = styled.span`
  flex: 1;
  word-break: keep-all;
  line-height: 1.5;
`;

const ChoiceIcon = styled.span`
  font-size: 1.2rem;
  opacity: 0.8;
  transition: all 0.3s ease;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

const BagelChoiceButton = ({
  text,
  onClick,
  index = 0,
  disabled = false,
  icon = "▶",
  variant = "default" // default, important, danger
}) => {
  const getVariantColors = () => {
    switch (variant) {
      case "important":
        return {
          background: "rgba(0, 0, 0, 0.8)",
          border: "rgba(255, 215, 0, 0.5)"
        };
      case "danger":
        return {
          background: "rgba(0, 0, 0, 0.8)",
          border: "rgba(220, 38, 38, 0.5)"
        };
      default:
        return {
          background: "rgba(0, 0, 0, 0.7)",
          border: "rgba(255, 255, 255, 0.15)"
        };
    }
  };

  const variantColors = getVariantColors();

  const variants = {
    idle: {
      scale: 1,
      background: variantColors.background,
      borderColor: variantColors.border,
      y: 0
    },
    hover: {
      scale: 1.02,
      background: variant === "default"
        ? "rgba(0, 0, 0, 0.9)"
        : variant === "important"
          ? "rgba(0, 0, 0, 0.9)"
          : "rgba(0, 0, 0, 0.9)",
      borderColor: variant === "default"
        ? "rgba(200, 182, 226, 0.5)"
        : variant === "important"
          ? "rgba(255, 215, 0, 0.7)"
          : "rgba(220, 38, 38, 0.7)",
      y: -2,
      boxShadow: [
        "0 10px 25px rgba(0, 0, 0, 0.4)",
        variant === "default"
          ? "0 0 20px rgba(200, 182, 226, 0.1)"
          : variant === "important"
            ? "0 0 20px rgba(255, 215, 0, 0.1)"
            : "0 0 20px rgba(220, 38, 38, 0.1)"
      ]
    },
    tap: {
      scale: 0.98,
      y: 0
    }
  };

  return (
    <ChoiceContainer
      variants={variants}
      initial="idle"
      whileHover={!disabled ? "hover" : "idle"}
      whileTap={!disabled ? "tap" : "idle"}
      onClick={onClick}
      disabled={disabled}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20
      }}
      style={{
        background: variantColors.background,
        borderColor: variantColors.border
      }}
    >
      <ChoiceText>{text}</ChoiceText>
      <ChoiceIcon>{icon}</ChoiceIcon>
    </ChoiceContainer>
  );
};

export default BagelChoiceButton;