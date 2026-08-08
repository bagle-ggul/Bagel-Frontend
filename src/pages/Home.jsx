import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useEffect } from "react";
import { Images } from "react-bootstrap-icons";

import ImageGallery from "../components/ImageGallery";
import { APP_VERSION } from "../constants/version";
import { clearTokens, isAuthenticated as checkAuthenticated, setRefreshToken } from "../utils/auth";
import axios from "../utils/axios";
import { logger } from "../utils/logger";
import { isMusicMuted, setMusicMuted } from "../utils/storage";

import CreditsModal from "./Home/CreditsModal";
import LoginModal from "./Home/LoginModal";
import LoginRequiredModal from "./Home/LoginRequiredModal";
import SignupModal from "./Home/SignupModal";
import {
  BottomCreditsButton,
  BottomRightButtonGroup,
  BottomVersionInfo,
  ButtonGroup,
  ButtonWrapper,
  ChangelogLink,
  CharacterWrapper,
  IconControlGroup,
  ImageGalleryButton,
  LogoutButton,
  MainWrapper,
  MobileCharacterWrapper,
  MobileContainer,
  MobileMainWrapper,
  MusicControlButton,
  PrimaryButton,
  SecondaryButton,
  SecondaryButtonModal,
  Subtitle,
  Title,
  Wrapper,
} from "./Home.styled";

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showCredits, setShowCredits] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [showLoginRequired, setShowLoginRequired] = useState(false);
  const [showImageGallery, setShowImageGallery] = useState(false);
  const [characterImage, setCharacterImage] = useState("/img/her_home_v1.png");

  // 로그인 폼 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // 회원가입 폼 상태
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupPasswordConfirm, setSignupPasswordConfirm] = useState("");
  const [characterName, setCharacterName] = useState("");
  const [mbti, setMbti] = useState("");
  // MBTI 단계별 선택 상태
  const [mbtiE, setMbtiE] = useState(""); // E/I
  const [mbtiS, setMbtiS] = useState(""); // S/N
  const [mbtiT, setMbtiT] = useState(""); // T/F
  const [mbtiJ, setMbtiJ] = useState(""); // J/P
  // 생일 개별 선택 상태
  const [birthYear, setBirthYear] = useState("");
  const [birthMonth, setBirthMonth] = useState("");
  const [birthDay, setBirthDay] = useState("");
  const [gender, setGender] = useState("");
  const [signupError, setSignupError] = useState("");

  // 배경음악 컨트롤 상태
  const [isMuted, setIsMuted] = useState(() => {
    return isMusicMuted();
  });
  const [audioRef] = useState(new Audio("/audio/main_once-again.m4a"));

  useEffect(() => {
    if (checkAuthenticated()) {
      setIsAuthenticated(true);
    }
  }, []);

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
      if (window.innerWidth <= 768) {
        setCharacterImage("/img/her_home_v1_mobile.png");
      } else {
        setCharacterImage("/img/her_home_v1.png");
      }
    };

    // 초기 설정
    updateCharacterImage();

    // 리사이즈 이벤트 리스너 추가
    window.addEventListener("resize", updateCharacterImage);

    // 클린업 함수
    return () => window.removeEventListener("resize", updateCharacterImage);
  }, []);

  // MBTI 자동 조합
  useEffect(() => {
    if (mbtiE && mbtiS && mbtiT && mbtiJ) {
      setMbti(mbtiE + mbtiS + mbtiT + mbtiJ);
    } else {
      setMbti("");
    }
  }, [mbtiE, mbtiS, mbtiT, mbtiJ]);

  const handleLogout = () => {
    clearTokens();
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(""); // 에러 메시지 초기화

    const userData = {
      email,
      password,
    };

    try {
      const response = await axios.post("/api/login", userData);
      const { refreshToken } = response.data;
      setRefreshToken(refreshToken);
      setIsAuthenticated(true);
      setShowLogin(false);
      // 폼 초기화
      setEmail("");
      setPassword("");
      setError("");
    } catch (error) {
      logger.error("로그인 실패:", error);
      setError("아이디 또는 비밀번호를 확인해주세요");
    }
  };

  const openLoginModal = () => {
    setShowLogin(true);
    setError("");
    setEmail("");
    setPassword("");
  };

  const closeLoginModal = () => {
    setShowLogin(false);
    setError("");
    setEmail("");
    setPassword("");
  };

  // 하위 선택 컴포넌트는 "어떤 축/필드가 바뀌었는지"만 알려준다.
  // 상태 setter와의 연결은 화면이 담당한다.
  const handleMbtiChange = (axis, selected) => {
    const setters = { e: setMbtiE, s: setMbtiS, t: setMbtiT, j: setMbtiJ };
    setters[axis]?.(selected);
  };

  const handleBirthChange = (field, value) => {
    const setters = { year: setBirthYear, month: setBirthMonth, day: setBirthDay };
    setters[field]?.(value);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setSignupError(""); // 에러 메시지 초기화

    // 비밀번호 확인 검증
    if (signupPassword !== signupPasswordConfirm) {
      setSignupError("비밀번호가 일치하지 않습니다.");
      return;
    }

    // MBTI 검증
    if (!mbtiE || !mbtiS || !mbtiT || !mbtiJ) {
      setSignupError("MBTI를 모두 선택해주세요.");
      return;
    }

    // 생일 검증
    if (!birthYear || !birthMonth || !birthDay) {
      setSignupError("생년월일을 모두 선택해주세요.");
      return;
    }

    const userData = {
      email: signupEmail,
      password: signupPassword,
      characterName,
      mbti,
      birthDate: `${birthYear}-${birthMonth.padStart(2, "0")}-${birthDay.padStart(2, "0")}`,
      gender,
    };

    try {
      await axios.post("/api/signup", userData);
      setShowSignup(false);
      // 회원가입 성공 후 로그인 모달 열기
      setShowLogin(true);
      // 폼 초기화
      setSignupEmail("");
      setSignupPassword("");
      setSignupPasswordConfirm("");
      setCharacterName("");
      setMbti("");
      setMbtiE("");
      setMbtiS("");
      setMbtiT("");
      setMbtiJ("");
      setBirthYear("");
      setBirthMonth("");
      setBirthDay("");
      setGender("");
      setSignupError("");
    } catch (error) {
      logger.error("회원가입 실패:", error);
      setSignupError("회원가입에 실패했습니다. 다시 시도해주세요.");
    }
  };

  const openSignupModal = () => {
    setShowSignup(true);
    setSignupError("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setCharacterName("");
    setMbti("");
    setMbtiE("");
    setMbtiS("");
    setMbtiT("");
    setMbtiJ("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setGender("");
  };

  const closeSignupModal = () => {
    setShowSignup(false);
    setSignupError("");
    setSignupEmail("");
    setSignupPassword("");
    setSignupPasswordConfirm("");
    setCharacterName("");
    setMbti("");
    setMbtiE("");
    setMbtiS("");
    setMbtiT("");
    setMbtiJ("");
    setBirthYear("");
    setBirthMonth("");
    setBirthDay("");
    setGender("");
  };

  const handleRankingClick = () => {
    if (isAuthenticated) {
      window.location.href = "/board";
    } else {
      setShowLoginRequired(true);
    }
  };

  const closeLoginRequiredModal = () => {
    setShowLoginRequired(false);
  };

  // 배경음악 토글 함수
  const toggleMusic = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    setMusicMuted(newMutedState);

    if (newMutedState) {
      audioRef.pause();
    } else {
      audioRef.play().catch(() => {
        // 재생 실패시 다시 음소거 상태로
        setIsMuted(true);
        setMusicMuted(true);
      });
    }
  };

  return (
    <div>
      <Wrapper />

      {/* 데스크톱용 캐릭터 */}
      <CharacterWrapper>
        <motion.img
          src={characterImage}
          alt="Save Her - 그녀"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.5,
            delay: 0.3,
            ease: "easeOut",
          }}
        />
      </CharacterWrapper>

      {/* 데스크톱용 메인 */}
      <MainWrapper>
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Title>Re: WAVE</Title>
          <Subtitle>선택의 순간, 그녀의 운명이 갈린다.</Subtitle>
          <IconControlGroup>
            <ChangelogLink
              href="https://github.com/bagle-ggul"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub 저장소"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </ChangelogLink>
            <ImageGalleryButton
              onClick={() => setShowImageGallery(true)}
              aria-label="프로젝트 갤러리 열기"
              title="프로젝트 갤러리"
            >
              <Images size={20} />
            </ImageGalleryButton>
            <MusicControlButton
              onClick={toggleMusic}
              aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
              title={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
            >
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                  <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                  <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                </svg>
              )}
            </MusicControlButton>
          </IconControlGroup>
        </motion.div>
        <ButtonGroup>
          {isAuthenticated ? (
            <>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <PrimaryButton to="/intro">게임 시작</PrimaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/profile">내 정보</SecondaryButton>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButton to="/board">랭킹 보기</SecondaryButton>
              </ButtonWrapper>
            </>
          ) : (
            <>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={openSignupModal}>회원가입</SecondaryButtonModal>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={openLoginModal}>로그인</SecondaryButtonModal>
              </ButtonWrapper>
              <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <SecondaryButtonModal onClick={handleRankingClick}>랭킹 보기</SecondaryButtonModal>
              </ButtonWrapper>
            </>
          )}
        </ButtonGroup>
      </MainWrapper>

      {/* 모바일용 통합 컨테이너 */}
      <MobileContainer>
        <MobileCharacterWrapper>
          <motion.img
            src={characterImage}
            alt="Save Her - 그녀"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              delay: 0.3,
              ease: "easeOut",
            }}
          />
        </MobileCharacterWrapper>

        <MobileMainWrapper>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Title>Re: WAVE</Title>
            <Subtitle>선택의 순간, 그녀의 운명이 갈린다.</Subtitle>
            <IconControlGroup>
              <ChangelogLink
                href="https://github.com/bagle-ggul"
                target="_blank"
                rel="noopener noreferrer"
                title="GitHub 저장소"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                  <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                </svg>
              </ChangelogLink>
              <ImageGalleryButton
                onClick={() => setShowImageGallery(true)}
                aria-label="프로젝트 갤러리 열기"
                title="프로젝트 갤러리"
              >
                <Images size={20} />
              </ImageGalleryButton>
              <MusicControlButton
                onClick={toggleMusic}
                aria-label={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
                title={isMuted ? "배경음악 켜기" : "배경음악 끄기"}
              >
                {isMuted ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06zM6 5.04 4.312 6.39A.5.5 0 0 1 4 6.5H2v3h2a.5.5 0 0 1 .312.11L6 10.96V5.04zm7.854.606a.5.5 0 0 1 0 .708L12.207 8l1.647 1.646a.5.5 0 0 1-.708.708L11.5 8.707l-1.646 1.647a.5.5 0 0 1-.708-.708L10.793 8 9.146 6.354a.5.5 0 1 1 .708-.708L11.5 7.293l1.646-1.647a.5.5 0 0 1 .708 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M11.536 14.01A8.473 8.473 0 0 0 14.026 8a8.473 8.473 0 0 0-2.49-6.01l-.708.707A7.476 7.476 0 0 1 13.025 8c0 2.071-.84 3.946-2.197 5.303l.708.707z" />
                    <path d="M10.121 12.596A6.48 6.48 0 0 0 12.025 8a6.48 6.48 0 0 0-1.904-4.596l-.707.707A5.483 5.483 0 0 1 11.025 8a5.483 5.483 0 0 1-1.61 3.89l.706.706z" />
                    <path d="M8.707 11.182A4.486 4.486 0 0 0 10.025 8a4.486 4.486 0 0 0-1.318-3.182L8 5.525A3.489 3.489 0 0 1 9.025 8 3.49 3.49 0 0 1 8 10.475l.707.707zM6.717 3.55A.5.5 0 0 1 7 4v8a.5.5 0 0 1-.812.39L3.825 10.5H1.5A.5.5 0 0 1 1 10V6a.5.5 0 0 1 .5-.5h2.325l2.363-1.89a.5.5 0 0 1 .529-.06z" />
                  </svg>
                )}
              </MusicControlButton>
            </IconControlGroup>
          </motion.div>
          <ButtonGroup>
            {isAuthenticated ? (
              <>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <PrimaryButton to="/intro">게임 시작</PrimaryButton>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButton to="/profile">내 정보</SecondaryButton>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButton to="/board">랭킹 보기</SecondaryButton>
                </ButtonWrapper>
              </>
            ) : (
              <>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={openSignupModal}>회원가입</SecondaryButtonModal>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={openLoginModal}>로그인</SecondaryButtonModal>
                </ButtonWrapper>
                <ButtonWrapper whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <SecondaryButtonModal onClick={handleRankingClick}>
                    랭킹 보기
                  </SecondaryButtonModal>
                </ButtonWrapper>
              </>
            )}
          </ButtonGroup>
        </MobileMainWrapper>
      </MobileContainer>

      {isAuthenticated ? (
        <BottomRightButtonGroup>
          <BottomCreditsButton onClick={() => setShowCredits(true)}>크레딧</BottomCreditsButton>
          <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
        </BottomRightButtonGroup>
      ) : (
        <BottomRightButtonGroup>
          <BottomCreditsButton onClick={() => setShowCredits(true)}>크레딧</BottomCreditsButton>
        </BottomRightButtonGroup>
      )}

      <AnimatePresence>
        {showCredits && <CreditsModal onClose={() => setShowCredits(false)} />}
        {showSignup && (
          <SignupModal
            email={signupEmail}
            password={signupPassword}
            passwordConfirm={signupPasswordConfirm}
            characterName={characterName}
            mbti={{ e: mbtiE, s: mbtiS, t: mbtiT, j: mbtiJ }}
            mbtiResult={mbti}
            birth={{ year: birthYear, month: birthMonth, day: birthDay }}
            gender={gender}
            error={signupError}
            onEmailChange={(e) => setSignupEmail(e.target.value)}
            onPasswordChange={(e) => setSignupPassword(e.target.value)}
            onPasswordConfirmChange={(e) => setSignupPasswordConfirm(e.target.value)}
            onCharacterNameChange={(e) => setCharacterName(e.target.value)}
            onMbtiChange={handleMbtiChange}
            onBirthChange={handleBirthChange}
            onGenderChange={setGender}
            onSubmit={handleSignup}
            onClose={closeSignupModal}
          />
        )}
        )}
        {showLogin && (
          <LoginModal
            email={email}
            password={password}
            error={error}
            onEmailChange={(e) => setEmail(e.target.value)}
            onPasswordChange={(e) => setPassword(e.target.value)}
            onSubmit={handleLogin}
            onClose={closeLoginModal}
          />
        )}
        {showLoginRequired && (
          <LoginRequiredModal
            onClose={closeLoginRequiredModal}
            onGoLogin={() => {
              setShowLoginRequired(false);
              setShowLogin(true);
            }}
            onGoSignup={() => {
              setShowLoginRequired(false);
              setShowSignup(true);
            }}
          />
        )}
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
