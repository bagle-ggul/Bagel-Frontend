import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import React, { useState, useEffect, useCallback } from "react";
import { Download, X, ChevronLeft, ChevronRight } from "react-bootstrap-icons";

import {
  DownloadButton,
  ExpandedImage,
  ImageControls,
  ImageCounter,
  ImageViewerContainer,
  ImageViewerOverlay,
  NextButton,
  PrevButton,
  ViewerCloseButton,
} from "./ImageViewer.styled";

// 스와이프로 인정하는 최소 이동 거리 (px)
const SWIPE_THRESHOLD_PIXELS = 50;

/**
 * 갤러리 이미지 풀스크린 뷰어: 이전·다음(버튼, 스와이프, 방향키), 다운로드, 닫기(Esc)
 * selectedIndex가 null이면 닫힌 상태
 */
function ImageViewer({ images, selectedIndex = null, onChangeIndex, onClose }) {
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);

  const isOpen = selectedIndex !== null;
  const selectedImage = isOpen ? images[selectedIndex] : null;

  // 키보드 이벤트 이펙트의 의존성이라 useCallback으로 안정화 (처음 <-> 마지막 순환)
  const goToPrevImage = useCallback(() => {
    onChangeIndex(selectedIndex > 0 ? selectedIndex - 1 : images.length - 1);
  }, [selectedIndex, images.length, onChangeIndex]);

  const goToNextImage = useCallback(() => {
    onChangeIndex(selectedIndex < images.length - 1 ? selectedIndex + 1 : 0);
  }, [selectedIndex, images.length, onChangeIndex]);

  const handleDownload = () => {
    if (!selectedImage) return;
    const link = document.createElement("a");
    link.href = selectedImage;
    // 실제 파일 형식과 확장자를 맞춘다 (webp를 .jpg로 저장하면 일부 뷰어가 열지 못함)
    const imageExtension = selectedImage.split(".").pop();
    link.download = `bagel-project-${Date.now()}.${imageExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 터치 스와이프 (왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전)
  const handleTouchStart = (e) => setTouchStart(e.targetTouches[0].clientX);
  const handleTouchMove = (e) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    if (distance > SWIPE_THRESHOLD_PIXELS) {
      goToNextImage();
    } else if (distance < -SWIPE_THRESHOLD_PIXELS) {
      goToPrevImage();
    }
  };

  // 키보드 네비게이션 (좌우 방향키, Esc)
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isOpen) return;

      if (e.key === "ArrowLeft") {
        goToPrevImage();
      } else if (e.key === "ArrowRight") {
        goToNextImage();
      } else if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyPress);
    return () => document.removeEventListener("keydown", handleKeyPress);
  }, [isOpen, goToNextImage, goToPrevImage, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <ImageViewerOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        >
          <ImageViewerContainer
            onClick={(e) => e.stopPropagation()}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            <ImageCounter>
              {selectedIndex + 1} / {images.length}
            </ImageCounter>

            <PrevButton
              onClick={goToPrevImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={images.length <= 1}
              aria-label="이전 이미지"
            >
              <ChevronLeft size={24} />
            </PrevButton>

            <NextButton
              onClick={goToNextImage}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              disabled={images.length <= 1}
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
                onClick={onClose}
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
  );
}

ImageViewer.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedIndex: PropTypes.number,
  onChangeIndex: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageViewer;
