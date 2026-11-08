import { AnimatePresence, motion } from "framer-motion";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ImageGallery from "../components/ImageGallery";
import { ROUTES } from "../constants/routes";
import { APP_VERSION } from "../constants/version";
import { resetProgress } from "../game/progress";
import { clearTokens, isAuthenticated as checkAuthenticated } from "../utils/auth";
import { isMusicMuted, setMusicMuted } from "../utils/storage";

import CreditsModal from "./Home/CreditsModal";
import GuestStartModal from "./Home/GuestStartModal";
import HomeMenu from "./Home/HomeMenu";
import {
  BottomCreditsButton,
  BottomRightButtonGroup,
  BottomVersionInfo,
  CharacterWrapper,
  LogoutButton,
  MainWrapper,
  MobileCharacterWrapper,
  MobileContainer,
  MobileMainWrapper,
  Wrapper,
} from "./Home.styled";

const DESKTOP_CHARACTER_IMAGE = "/img/her_home_v1.webp";
const MOBILE_CHARACTER_IMAGE = "/img/her_home_v1_mobile.webp";
const MOBILE_MAX_WIDTH_PIXELS = 768;
const RESET_CONFIRM_TIMEOUT_MILLISECONDS = 3000;

const RANKING_GUEST_DESCRIPTION = "랭킹을 보려면 먼저 닉네임과 MBTI를 정해주세요.";

const characterImageTransition = { duration: 1.5, delay: 0.3, ease: "easeOut" };

function Home() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(checkAuthenticated);
  const [showCredits, setShowCredits] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [characterImage, setCharacterImage] = useState(DESKTOP_CHARACTER_IMAGE);

  // 시작 모달 요청: null이면 닫힘, 있으면 시작 후 이동할 경로와 안내 문구
  const [guestStartRequest, setGuestStartRequest] = useState(null);

  // "새로 시작" 오발 방지: 첫 클릭은 확인 단계, 시간 안에 한 번 더 눌러야 실행
  const [isResetPending, setIsResetPending] = useState(false);

  // 배경음악 컨트롤 상태
  const [isMuted, setIsMuted] = useState(isMusicMuted);
  const [audioRef] = useState(() => new Audio("/audio/main_once-again.m4a"));

  // 배경음악 초기 설정 및 정리
  useEffect(() => {
    audioRef.loop = true;
    audioRef.volume = 0.3;

    // 음소거 상태가 아니면 재생 시도
    if (!isMuted) {
      const playPromise = audioRef.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // 자동재생이 차단된 경우 음소거 상태로 설정
          setIsMuted(true);
          setMusicMuted(true);
        });
      }
    }

    return () => {
      audioRef.pause();
      audioRef.currentTime = 0;
    };
  }, [audioRef, isMuted]);

  // 화면 크기에 따른 캐릭터 이미지 변경
  useEffect(() => {
    const updateCharacterImage = () => {
      setCharacterImage(
        window.innerWidth <= MOBILE_MAX_WIDTH_PIXELS
          ? MOBILE_CHARACTER_IMAGE
          : DESKTOP_CHARACTER_IMAGE
      );
    };

    updateCharacterImage();
    window.addEventListener("resize", updateCharacterImage);
    return () => window.removeEventListener("resize", updateCharacterImage);
  }, []);

  // 확인 단계는 시간이 지나면 자동 해제
  useEffect(() => {
    if (!isResetPending) return undefined;
    const timeoutId = setTimeout(
      () => setIsResetPending(false),
      RESET_CONFIRM_TIMEOUT_MILLISECONDS
    );
    return () => clearTimeout(timeoutId);
  }, [isResetPending]);

  const toggleMusic = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    setMusicMuted(nextMuted);

    if (nextMuted) {
      audioRef.pause();
    } else {
      audioRef.play().catch(() => {
        // 재생 실패시 다시 음소거 상태로
        setIsMuted(true);
        setMusicMuted(true);
      });
    }
  };

  const openGuestStartForGame = () => setGuestStartRequest({ destination: ROUTES.INTRO });

  const openGuestStartForRanking = () =>
    setGuestStartRequest({
      destination: ROUTES.BOARD,
      description: RANKING_GUEST_DESCRIPTION,
    });

  const closeGuestStart = useCallback(() => setGuestStartRequest(null), []);

  // 시작 성공: 토큰은 폼 훅이 저장함 > 모달 닫기 > 목적지로 이동
  const handleGuestStarted = () => {
    const { destination } = guestStartRequest;
    setIsAuthenticated(true);
    setGuestStartRequest(null);
    navigate(destination);
  };

  // 새로 시작: 토큰과 진행 기록을 지우고 새 플레이어로 다시 시작
  const handleResetClick = () => {
    if (!isResetPending) {
      setIsResetPending(true);
      return;
    }
    clearTokens();
    resetProgress();
    setIsAuthenticated(false);
    window.location.reload();
  };

  const menu = (
    <HomeMenu
      isAuthenticated={isAuthenticated}
      isMuted={isMuted}
      onToggleMusic={toggleMusic}
      onOpenGallery={() => setShowImageGallery(true)}
      onStartClick={openGuestStartForGame}
      onRankingClick={openGuestStartForRanking}
    />
  );

  const characterImageElement = (
    <motion.img
      src={characterImage}
      alt="Save Her - 그녀"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={characterImageTransition}
    />
  );

  return (
    <div>
      <Wrapper />

      {/* 데스크톱 배치 */}
      <CharacterWrapper>{characterImageElement}</CharacterWrapper>
      <MainWrapper>{menu}</MainWrapper>

      {/* 모바일 배치 */}
      <MobileContainer>
        <MobileCharacterWrapper>{characterImageElement}</MobileCharacterWrapper>
        <MobileMainWrapper>{menu}</MobileMainWrapper>
      </MobileContainer>

      <BottomRightButtonGroup>
        <BottomCreditsButton onClick={() => setShowCredits(true)}>크레딧</BottomCreditsButton>
        {isAuthenticated && (
          <LogoutButton onClick={handleResetClick}>
            {isResetPending ? "진행 기록이 지워져요. 한 번 더 누르세요" : "새로 시작"}
          </LogoutButton>
        )}
      </BottomRightButtonGroup>

      <AnimatePresence>
        {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}
        {guestStartRequest && (
          <GuestStartModal
            description={guestStartRequest.description}
            onStarted={handleGuestStarted}
            onClose={closeGuestStart}
          />
        )}
      </AnimatePresence>

      {/* 이미지 갤러리 모달 */}
      <ImageGallery isOpen={showImageGallery} onClose={() => setShowImageGallery(false)} />

      {/* 왼쪽 아래 버전 정보 */}
      <BottomVersionInfo
        href="https://github.com/bagle-ggul/Bagel-Frontend/blob/main/CHANGELOG.md"
        target="_blank"
        rel="noopener noreferrer"
        title="Changelog 확인"
      >
        v{APP_VERSION}
      </BottomVersionInfo>
    </div>
  );
}

export default Home;
