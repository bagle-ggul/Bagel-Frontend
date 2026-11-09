import { motion } from "framer-motion";
import React from "react";
import { Images } from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import { GITHUB_ORGANIZATION_URL } from "../../constants/externalLinks";
import { ROUTES } from "../../constants/routes";

import {
  ButtonGroup,
  ButtonWrapper,
  ChangelogLink,
  IconControlGroup,
  ImageGalleryButton,
  MenuButton,
  MusicControlButton,
  Subtitle,
  Title,
} from "./HomeMenu.styled";

const hoverProps = { whileHover: { scale: 1.02 }, whileTap: { scale: 0.98 } };

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
  </svg>
);

const MusicOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
  </svg>
);

const MusicOnIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
  </svg>
);

/**
 * 홈 메뉴: 제목, 아이콘 3개(GitHub, 갤러리, 음악), 주요 버튼 (데스크톱·모바일 공용)
 * 진입 전에는 버튼이 시작 모달을 열고, 진입 후에는 바로 이동
 */
function HomeMenu({
  isAuthenticated,
  isMuted,
  onToggleMusic,
  onOpenGallery,
  onStartClick,
  onRankingClick,
}) {
  const musicLabel = isMuted ? "배경음악 켜기" : "배경음악 끄기";

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Title>Re: WAVE</Title>
        <Subtitle>선택의 순간, 그녀의 운명이 갈린다.</Subtitle>
        <IconControlGroup>
          <ChangelogLink
            href={GITHUB_ORGANIZATION_URL}
            target="_blank"
            rel="noopener noreferrer"
            title="GitHub 저장소"
            aria-label="GitHub 저장소 열기"
          >
            <GithubIcon />
          </ChangelogLink>
          <ImageGalleryButton
            onClick={onOpenGallery}
            aria-label="프로젝트 갤러리 열기"
            title="프로젝트 갤러리"
          >
            <Images size={20} />
          </ImageGalleryButton>
          <MusicControlButton
            onClick={onToggleMusic}
            aria-label={musicLabel}
            title={musicLabel}
            aria-pressed={!isMuted}
          >
            {isMuted ? <MusicOffIcon /> : <MusicOnIcon />}
          </MusicControlButton>
        </IconControlGroup>
      </motion.div>

      <ButtonGroup>
        {isAuthenticated ? (
          <>
            <ButtonWrapper {...hoverProps}>
              <MenuButton as={Link} to={ROUTES.INTRO} size="lg">
                게임 시작
              </MenuButton>
            </ButtonWrapper>
            <ButtonWrapper {...hoverProps}>
              <MenuButton as={Link} to={ROUTES.PROFILE} variant="secondary" size="lg">
                내 정보
              </MenuButton>
            </ButtonWrapper>
            <ButtonWrapper {...hoverProps}>
              <MenuButton as={Link} to={ROUTES.BOARD} variant="secondary" size="lg">
                랭킹 보기
              </MenuButton>
            </ButtonWrapper>
          </>
        ) : (
          <>
            <ButtonWrapper {...hoverProps}>
              <MenuButton type="button" size="lg" onClick={onStartClick}>
                게임 시작
              </MenuButton>
            </ButtonWrapper>
            <ButtonWrapper {...hoverProps}>
              <MenuButton type="button" variant="secondary" size="lg" onClick={onRankingClick}>
                랭킹 보기
              </MenuButton>
            </ButtonWrapper>
          </>
        )}
      </ButtonGroup>
    </>
  );
}

export default HomeMenu;
