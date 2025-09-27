import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import TypewriterText from './TypewriterText';

const DialogContainer = styled(motion.div)`
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 2.5rem 3rem;
  position: relative;
  color: white;
  box-shadow:
    0 8px 32px rgba(0, 0, 0, 0.6),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  margin-bottom: 1rem;
  min-height: 140px;
  height: 140px;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 800px;

  /* 상단 그라데이션 라인 */
  &::before {
    content: '';
    position: absolute;
    top: -1px;
    left: 2rem;
    right: 2rem;
    height: 4px;
    background: linear-gradient(90deg,
      rgba(200, 182, 226, 0.8),
      rgba(200, 182, 226, 0.2),
      rgba(200, 182, 226, 0.8)
    );
    border-radius: 2px;
  }

  /* 화자 표시를 위한 좌측 강조선 */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 20%;
    bottom: 20%;
    width: 4px;
    background: linear-gradient(180deg,
      transparent,
      rgba(200, 182, 226, 0.6),
      transparent
    );
    border-radius: 0 2px 2px 0;
  }

  @media (max-width: 768px) {
    padding: 1.5rem 2rem;
    font-size: 0.95rem;
    min-height: 120px;
  }

  @media (max-width: 480px) {
    padding: 1.2rem 1.5rem;
    font-size: 0.9rem;
    min-height: 100px;
  }
`;

const SpeakerName = styled.div`
  position: absolute;
  top: -15px;
  left: 2rem;
  background: rgba(200, 182, 226, 0.9);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 15px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);

  @media (max-width: 768px) {
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
    left: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 0.75rem;
    padding: 0.3rem 0.6rem;
    left: 1rem;
  }
`;

const DialogContent = styled.div`
  width: 100%;
  line-height: 1.6;
  font-size: 1.1rem;

  @media (max-width: 768px) {
    font-size: 1rem;
    line-height: 1.5;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
    line-height: 1.4;
  }
`;

const CharacterIcon = styled.div`
  position: absolute;
  top: -20px;
  right: 2rem;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(200, 182, 226, 0.5);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);

  @media (max-width: 768px) {
    width: 35px;
    height: 35px;
    font-size: 1rem;
    right: 1.5rem;
  }

  @media (max-width: 480px) {
    width: 30px;
    height: 30px;
    font-size: 0.9rem;
    right: 1rem;
  }
`;

const BagelDialogBox = ({
  text,
  speaker = null,
  characterIcon = "💬",
  enableTypewriter = true,
  typingSpeed = 50,
  onTypeComplete = () => {},
  onClick = () => {}
}) => {
  return (
    <DialogContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      onClick={onClick}
    >
      {speaker && <SpeakerName>{speaker}</SpeakerName>}
      <CharacterIcon>{characterIcon}</CharacterIcon>

      <DialogContent>
        {enableTypewriter ? (
          <TypewriterText
            text={text}
            speed={typingSpeed}
            onComplete={onTypeComplete}
          />
        ) : (
          <div>
            {text.split('\n').map((line, index) => (
              <div key={index} style={{ minHeight: '1.6em' }}>
                {line}
              </div>
            ))}
          </div>
        )}
      </DialogContent>
    </DialogContainer>
  );
};

export default BagelDialogBox;