import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { Images, Download, X, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

// 프로젝트 이미지 목록 (01부터 순서대로)
const PROJECT_IMAGES = [
  '/img/bagel_team_01.jpg',
  '/img/bagel_team_02.jpg',
  '/img/bagel_team_03.jpg',
  '/img/bagel_team_04.jpg',
  '/img/bagel_team_05.jpg',
  '/img/bagel_team_06.jpg',
  '/img/bagel_team_07.jpg',
  '/img/bagel_team_08.jpg',
  '/img/bagel_team_09.jpg'
];

// 갤러리 모달 오버레이
const GalleryModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1500;
  padding: 20px;
`;

// 갤러리 모달 콘텐츠
const GalleryModalContent = styled(motion.div)`
  position: relative;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  padding: 2.5rem 2rem;
  max-width: 900px;
  width: 100%;
  max-height: 85vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  color: white;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 95vw;
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
`;

// 모달 제목
const GalleryTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  margin-bottom: 2rem;
  text-align: center;
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  color: rgba(200, 182, 226, 1);

  @media (max-width: 768px) {
    font-size: 1.8rem;
    margin-bottom: 1.5rem;
  }

  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

// 이미지 그리드
const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.2rem;
  margin: 0 0 1.5rem 0;

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  @media (max-width: 480px) {
    gap: 0.8rem;
  }
`;

// 썸네일 이미지
const ImageThumbnail = styled(motion.img)`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;

  &:hover {
    transform: scale(1.03);
    filter: brightness(1.1) contrast(1.05);
    border-color: rgba(200, 182, 226, 0.5);
    box-shadow: 0 8px 25px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: scale(0.98);
  }
`;

// 갤러리 모달 닫기 버튼
const GalleryCloseButton = styled(motion.button)`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    color: white;
    transform: scale(1.1);
    box-shadow: 0 4px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: scale(0.95);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px rgba(200, 182, 226, 0.4);
  }

  @media (max-width: 768px) {
    top: 1rem;
    right: 1rem;
    width: 44px;
    height: 44px;
  }

  @media (max-width: 480px) {
    top: 0.8rem;
    right: 0.8rem;
    width: 40px;
    height: 40px;
  }
`;

// 이미지 뷰어 풀스크린 오버레이
const ImageViewerOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.95);
  backdrop-filter: blur(15px);
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;

// 이미지 뷰어 컨테이너
const ImageViewerContainer = styled.div`
  position: relative;
  max-width: 90vw;
  max-height: 90vh;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// 확대된 이미지 - 크기 조정
const ExpandedImage = styled(motion.img)`
  max-width: 85vw;
  max-height: 70vh;
  object-fit: contain;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7);

  @media (max-width: 768px) {
    max-width: 90vw;
    max-height: 60vh;
  }
`;

// 이미지 컨트롤 버튼들
const ImageControls = styled.div`
  position: absolute;
  bottom: -60px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    bottom: -50px;
    gap: 0.8rem;
  }
`;

// 다운로드 버튼
const DownloadButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: rgba(200, 182, 226, 0.8);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(200, 182, 226, 0.3);
  border-radius: 12px;
  color: white;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.4);
  }

  &:active {
    transform: scale(0.98);
  }

  @media (max-width: 768px) {
    padding: 0.7rem 1.2rem;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    gap: 0.4rem;
  }
`;

// 뷰어 닫기 버튼
const ViewerCloseButton = styled(motion.button)`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    color: white;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
  }

  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
  }
`;

// 네비게이션 버튼 (좌우)
const NavButton = styled(motion.button)`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 60px;
  height: 60px;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 10;

  &:hover {
    background: rgba(200, 182, 226, 0.7);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-50%) scale(1.1);
    box-shadow: 0 4px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(-50%) scale(0.95);
  }

  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    transform: translateY(-50%);
  }

  @media (max-width: 768px) {
    width: 50px;
    height: 50px;
  }

  @media (max-width: 480px) {
    width: 45px;
    height: 45px;
  }
`;

const PrevButton = styled(NavButton)`
  left: 20px;

  @media (max-width: 768px) {
    left: 15px;
  }

  @media (max-width: 480px) {
    left: 10px;
  }
`;

const NextButton = styled(NavButton)`
  right: 20px;

  @media (max-width: 768px) {
    right: 15px;
  }

  @media (max-width: 480px) {
    right: 10px;
  }
`;

// 이미지 인덱스 표시
const ImageCounter = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: white;
  font-size: 0.9rem;
  font-weight: 500;

  @media (max-width: 768px) {
    top: 15px;
    font-size: 0.8rem;
    padding: 0.4rem 0.8rem;
  }
`;

// 이미지 갤러리 컴포넌트
function ImageGallery({ isOpen, onClose }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const handleImageClick = (imageSrc, index) => {
    setSelectedImage(imageSrc);
    setCurrentImageIndex(index);
  };

  const handleCloseViewer = () => {
    setSelectedImage(null);
  };

  const handleDownload = () => {
    if (selectedImage) {
      const link = document.createElement('a');
      link.href = selectedImage;
      link.download = `bagel-project-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleModalClose = () => {
    setSelectedImage(null);
    onClose();
  };

  // 이미지 네비게이션 함수들
  const goToPrevImage = () => {
    const prevIndex = currentImageIndex > 0 ? currentImageIndex - 1 : PROJECT_IMAGES.length - 1;
    setCurrentImageIndex(prevIndex);
    setSelectedImage(PROJECT_IMAGES[prevIndex]);
  };

  const goToNextImage = () => {
    const nextIndex = currentImageIndex < PROJECT_IMAGES.length - 1 ? currentImageIndex + 1 : 0;
    setCurrentImageIndex(nextIndex);
    setSelectedImage(PROJECT_IMAGES[nextIndex]);
  };

  // 터치/스와이프 핸들러들
  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      goToNextImage();
    } else if (isRightSwipe) {
      goToPrevImage();
    }
  };

  // 키보드 네비게이션
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!selectedImage) return;

      if (e.key === 'ArrowLeft') {
        goToPrevImage();
      } else if (e.key === 'ArrowRight') {
        goToNextImage();
      } else if (e.key === 'Escape') {
        handleCloseViewer();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [selectedImage, currentImageIndex]);

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <GalleryModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleModalClose}
          >
            <GalleryModalContent
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              <GalleryTitle>프로젝트 갤러리</GalleryTitle>

              <ImageGrid>
                {PROJECT_IMAGES.map((image, index) => (
                  <ImageThumbnail
                    key={index}
                    src={image}
                    alt={`프로젝트 이미지 ${index + 1}`}
                    onClick={() => handleImageClick(image, index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20
                    }}
                  />
                ))}
              </ImageGrid>

              <GalleryCloseButton
                onClick={handleModalClose}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="갤러리 모달 닫기"
              >
                <X size={20} />
              </GalleryCloseButton>
            </GalleryModalContent>
          </GalleryModalOverlay>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedImage && (
          <ImageViewerOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseViewer}
          >
            <ImageViewerContainer
              onClick={(e) => e.stopPropagation()}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* 이미지 카운터 */}
              <ImageCounter>
                {currentImageIndex + 1} / {PROJECT_IMAGES.length}
              </ImageCounter>

              {/* 이전 버튼 */}
              <PrevButton
                onClick={goToPrevImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={PROJECT_IMAGES.length <= 1}
                aria-label="이전 이미지"
              >
                <ChevronLeft size={24} />
              </PrevButton>

              {/* 다음 버튼 */}
              <NextButton
                onClick={goToNextImage}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                disabled={PROJECT_IMAGES.length <= 1}
                aria-label="다음 이미지"
              >
                <ChevronRight size={24} />
              </NextButton>

              <ExpandedImage
                key={selectedImage} // 이미지 변경 시 애니메이션 트리거
                src={selectedImage}
                alt="확대된 이미지"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.2, type: "spring", damping: 25 }}
              />

              <ImageControls>
                <DownloadButton
                  onClick={handleDownload}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Download size={16} />
                  다운로드
                </DownloadButton>

                <ViewerCloseButton
                  onClick={handleCloseViewer}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="이미지 뷰어 닫기"
                >
                  <X size={20} />
                </ViewerCloseButton>
              </ImageControls>
            </ImageViewerContainer>
          </ImageViewerOverlay>
        )}
      </AnimatePresence>
    </>
  );
}

export default ImageGallery;