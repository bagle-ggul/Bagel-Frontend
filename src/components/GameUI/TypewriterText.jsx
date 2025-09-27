import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const TypewriterText = ({
  text,
  speed = 50,
  onComplete = () => {},
  showCursor = true,
  className = "",
  style = {}
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // 텍스트가 변경될 때마다 초기화
    setDisplayText('');
    setCurrentIndex(0);
    setIsComplete(false);
  }, [text]);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    } else if (!isComplete && currentIndex === text.length) {
      setIsComplete(true);
      onComplete();
    }
  }, [currentIndex, text, speed, onComplete, isComplete]);

  // 즉시 완성 기능 (클릭 시)
  const handleSkip = () => {
    if (!isComplete) {
      setDisplayText(text);
      setCurrentIndex(text.length);
      setIsComplete(true);
      onComplete();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onClick={handleSkip}
      style={{
        cursor: isComplete ? 'default' : 'pointer',
        lineHeight: 1.6,
        ...style
      }}
      className={className}
    >
      {text.split('\n').map((line, lineIndex) => {
        const lineStartIndex = text.split('\n')
          .slice(0, lineIndex)
          .join('\n').length + (lineIndex > 0 ? 1 : 0);
        const lineEndIndex = lineStartIndex + line.length;

        const lineDisplayText = displayText.slice(
          Math.max(0, lineStartIndex),
          Math.min(displayText.length, lineEndIndex)
        );

        return (
          <div key={lineIndex} style={{ minHeight: '1.6em' }}>
            {lineDisplayText}
            {!isComplete &&
             currentIndex >= lineStartIndex &&
             currentIndex <= lineEndIndex &&
             showCursor && (
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
                style={{ color: 'rgba(200, 182, 226, 0.8)' }}
              >
                ▋
              </motion.span>
            )}
          </div>
        );
      })}

      {/* 클릭 힌트 (타이핑 중일 때만 표시) */}
      {!isComplete && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 0.8] }}
          transition={{
            repeat: Infinity,
            duration: 2,
            delay: 1
          }}
          style={{
            fontSize: '0.8rem',
            color: 'rgba(255, 255, 255, 0.5)',
            marginTop: '0.5rem',
            textAlign: 'right'
          }}
        >
          클릭하여 스킵 →
        </motion.div>
      )}
    </motion.div>
  );
};

export default TypewriterText;