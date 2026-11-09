import { AnimatePresence } from "framer-motion";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { X } from "react-bootstrap-icons";

import {
  GalleryCloseButton,
  GalleryModalContent,
  GalleryModalOverlay,
  GalleryTitle,
  ImageGrid,
  ImageThumbnail,
} from "./ImageGallery.styled";
import ImageViewer from "./ImageViewer";

// 프로젝트 이미지 목록 (01부터 순서대로)
const PROJECT_IMAGES = [
  "/img/bagel_team_01.webp",
  "/img/bagel_team_02.webp",
  "/img/bagel_team_03.webp",
  "/img/bagel_team_04.webp",
  "/img/bagel_team_05.webp",
  "/img/bagel_team_06.webp",
  "/img/bagel_team_07.webp",
  "/img/bagel_team_08.webp",
  "/img/bagel_team_09.webp",
];

/**
 * 프로젝트 이미지 갤러리: 썸네일 목록 모달 + 확대 뷰어
 * 확대 중인 이미지는 인덱스로만 관리 (null이면 뷰어 닫힘)
 */
function ImageGallery({ isOpen, onClose }) {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleCloseViewer = () => setSelectedIndex(null);

  const handleModalClose = () => {
    setSelectedIndex(null);
    onClose();
  };

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
                    key={image}
                    src={image}
                    alt={`프로젝트 이미지 ${index + 1}`}
                    onClick={() => setSelectedIndex(index)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.3,
                      delay: index * 0.05,
                      type: "spring",
                      damping: 20,
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

      <ImageViewer
        images={PROJECT_IMAGES}
        selectedIndex={selectedIndex}
        onChangeIndex={setSelectedIndex}
        onClose={handleCloseViewer}
      />
    </>
  );
}

ImageGallery.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ImageGallery;
