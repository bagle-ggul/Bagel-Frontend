import React, { useState, useCallback } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  TrophyFill,
  Award,
  Star,
  StarFill,
  Envelope,
  Calendar3,
  Controller,
  XLg,
  Person,
  House,
  PersonCircle,
  Clock,
  ChevronUp,
  ArrowRepeat,
} from "react-bootstrap-icons";
import TimeUtil from "../utils/TimeUtil";
import { useRankingData } from "../hooks/useRankingData";
import {
  useInfiniteScrollObserver,
  useScrollProgress,
  useScrollToTop,
  useTouchSwipe,
} from "../hooks/useInfiniteScroll";

// 배경 이미지 URL
const backgroundImageUrl = "/img/bg_community_main.png";

const BoardWrapper = styled.div`
  background-image: url(${backgroundImageUrl});
  background-size: cover;
  background-position: center;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    padding: 15px;
  }

  @media (max-width: 480px) {
    padding: 10px;
  }
`;

const Title = styled.h1`
  font-size: 3em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.8);
  margin: 60px 0 20px 0;
  display: flex;
  align-items: center;
  gap: 15px;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 2.2em;
    margin: 50px 0 15px 0;
    gap: 10px;
  }

  @media (max-width: 480px) {
    font-size: 1.8em;
    margin: 40px 0 10px 0;
    gap: 8px;
  }
`;

// 스크롤 진행 표시기
const ScrollProgressBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${(props) => props.progress}%;
  height: 3px;
  background: linear-gradient(90deg, rgba(200, 182, 226, 0.9), rgba(200, 182, 226, 0.6));
  z-index: 1000;
  transition: width 0.3s ease;
  box-shadow: 0 2px 10px rgba(200, 182, 226, 0.3);
`;

// 글라스모피즘 컨테이너
const GlassContainer = styled.div`
  width: 90%;
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  border-radius: 20px;
  overflow: hidden;
  max-height: 75vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 80vh;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-height: 85vh;
    border-radius: 12px;
  }
`;

// 스크롤 가능한 테이블 컨테이너
const ScrollableTableContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(200, 182, 226, 0.5);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(200, 182, 226, 0.8);
  }

  @media (max-width: 768px) {
    display: none;
  }
`;

// 데스크톱 테이블
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;
`;

const TableHead = styled.thead`
  background: rgba(200, 182, 226, 0.3);
  color: white;
  position: sticky;
  top: 0;
  z-index: 10;
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  cursor: pointer;

  &:nth-child(even) {
    background: rgba(255, 255, 255, 0.05);
  }

  &:hover {
    background: rgba(200, 182, 226, 0.2);
    transform: translateX(5px);
  }
`;

const TableHeader = styled.th`
  padding: 15px;
  font-size: 1em;
  font-weight: 600;
  text-align: center;
  color: white;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 1em;
  text-align: center;
  color: white;
  font-weight: 500;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
`;

// 랭킹 특별 표시 (1-5위)
const RankCell = styled(TableCell)`
  font-weight: 700;
  font-size: 1.2em;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;

  ${(props) => {
    if (props.rank === 1) {
      return `
        color: #FFD700;
        text-shadow: 0 0 10px rgba(255, 215, 0, 0.6);
        animation: pulse 2s infinite;
      `;
    } else if (props.rank === 2) {
      return `
        color: #C0C0C0;
        text-shadow: 0 0 8px rgba(192, 192, 192, 0.5);
      `;
    } else if (props.rank === 3) {
      return `
        color: #CD7F32;
        text-shadow: 0 0 8px rgba(205, 127, 50, 0.5);
      `;
    } else if (props.rank <= 5) {
      return `
        color: rgba(200, 182, 226, 1);
        text-shadow: 0 0 6px rgba(200, 182, 226, 0.4);
      `;
    }
  }}

  @keyframes pulse {
    0%,
    100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
  }
`;

// 점수 표시
const ScoreCell = styled(TableCell)`
  font-weight: 700;
  font-size: 1.3em;
  color: rgba(200, 182, 226, 1);
  text-shadow: 0 0 8px rgba(200, 182, 226, 0.4);
`;

// 모바일 카드 컨테이너
const MobileCardContainer = styled.div`
  display: none;
  flex-direction: column;
  gap: 10px;
  padding: 15px;
  overflow-y: auto;
  flex: 1;

  @media (max-width: 768px) {
    display: flex;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(200, 182, 226, 0.5);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: rgba(200, 182, 226, 0.8);
  }
`;

// 모바일 랭킹 카드
const RankCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 15px;
  padding: 15px;
  display: flex;
  align-items: center;
  gap: 15px;
  cursor: pointer;
  transition: all 0.3s ease;

  ${(props) => {
    if (props.rank <= 5) {
      return `
        border: 1px solid rgba(200, 182, 226, 0.3);
        background: rgba(200, 182, 226, 0.1);
      `;
    }
  }}

  &:hover {
    background: rgba(200, 182, 226, 0.2);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }
`;

// 모바일 랭킹 표시
const MobileRankDisplay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  gap: 5px;
`;

const MobileRankNumber = styled.div`
  font-size: 1.2em;
  font-weight: 700;

  ${(props) => {
    if (props.rank === 1) {
      return `
        color: #FFD700;
        text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);
      `;
    } else if (props.rank === 2) {
      return `
        color: #C0C0C0;
        text-shadow: 0 0 6px rgba(192, 192, 192, 0.5);
      `;
    } else if (props.rank === 3) {
      return `
        color: #CD7F32;
        text-shadow: 0 0 6px rgba(205, 127, 50, 0.5);
      `;
    } else if (props.rank <= 5) {
      return `
        color: rgba(200, 182, 226, 1);
        text-shadow: 0 0 6px rgba(200, 182, 226, 0.4);
      `;
    } else {
      return `color: white;`;
    }
  }}
`;

// 모바일 사용자 정보
const MobileUserInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MobileUserName = styled.div`
  font-size: 1.1em;
  font-weight: 600;
  color: white;
`;

const MobileMetaInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.9em;
  color: rgba(255, 255, 255, 0.7);
  flex-wrap: wrap;
`;

const MobileMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

// 모바일 점수 표시
const MobileScore = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 60px;
  gap: 2px;
`;

const MobileScoreValue = styled.div`
  font-size: 1.4em;
  font-weight: 700;
  color: rgba(200, 182, 226, 1);
  text-shadow: 0 0 8px rgba(200, 182, 226, 0.4);
`;

const MobileScoreLabel = styled.div`
  font-size: 0.8em;
  color: rgba(255, 255, 255, 0.6);
`;

// 로딩 인디케이터
const LoadingMoreIndicator = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px;
  gap: 15px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
`;

const LoadingSpinner = styled(motion.div)`
  width: 40px;
  height: 40px;
  border: 3px solid rgba(200, 182, 226, 0.2);
  border-top: 3px solid rgba(200, 182, 226, 0.9);
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const LoadingText = styled.span`
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  font-weight: 500;
`;

// 에러 상태
const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 30px;
  background: rgba(220, 53, 69, 0.1);
  border: 1px solid rgba(220, 53, 69, 0.3);
  border-radius: 15px;
  margin: 20px;
`;

const ErrorText = styled.span`
  color: rgba(220, 53, 69, 0.9);
  font-size: 1rem;
  text-align: center;
`;

const RetryButton = styled(motion.button)`
  background: rgba(200, 182, 226, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 500;

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
  }
`;

// 맨 위로 버튼
const ScrollToTopButton = styled(motion.button)`
  position: fixed;
  bottom: 80px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: rgba(200, 182, 226, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.2);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(200, 182, 226, 0.3);

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(200, 182, 226, 0.4);
  }

  @media (max-width: 768px) {
    bottom: 70px;
    right: 15px;
    width: 48px;
    height: 48px;
  }

  @media (max-width: 480px) {
    bottom: 60px;
    right: 10px;
    width: 44px;
    height: 44px;
  }
`;

// 로딩 트리거 요소
const LoadMoreTrigger = styled.div`
  height: 1px;
  width: 100%;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 20px;
  gap: 10px;

  @media (max-width: 768px) {
    top: 15px;
    right: 15px;
  }

  @media (max-width: 480px) {
    top: 10px;
    right: 10px;
  }
`;

const ButtonSpan = styled.span`
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(200, 182, 226, 0.3);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8rem;
  }
`;

function Board() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // 모바일/데스크톱 구분
  const isMobile = window.innerWidth <= 768;
  const pageSize = isMobile ? 15 : 20;

  // 커스텀 훅들 사용
  const { data, loadNextPage, retryLoad } = useRankingData(pageSize);
  const scrollProgress = useScrollProgress();
  const { showScrollTop, scrollToTop } = useScrollToTop(300);
  const { loadMoreRef, isLoading: isLoadingMore } = useInfiniteScrollObserver(
    loadNextPage,
    data.hasNextPage
  );

  // 랭킹 아이콘 렌더링 함수
  const getRankIcon = useCallback((rank) => {
    if (rank === 1) return <TrophyFill size={24} color="white" />;
    if (rank === 2) return <Award size={20} color="white" />;
    if (rank === 3) return <Award size={20} color="white" />;
    if (rank <= 5) return <StarFill size={18} color="white" />;
    return <Star size={16} color="white" />;
  }, []);

  // 사용자 상세 정보 모달 열기
  const openUserModal = useCallback((userData, rank) => {
    setSelectedUser({ ...userData, rank });
    setShowModal(true);
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedUser(null);
  }, []);

  // 터치 제스처 (모바일용)
  const { handleTouchStart, handleTouchMove, handleTouchEnd } = useTouchSwipe(() => {
    if (data.hasNextPage && !data.isLoading) {
      loadNextPage();
    }
  }, 80);

  // 메모이제이션된 렌더링 함수들
  const renderDesktopRow = useCallback(
    (item, index) => {
      const rank = index + 1;
      return (
        <MemoizedTableRow
          key={`${item.memberEmail}-${index}`}
          item={item}
          rank={rank}
          onClick={openUserModal}
          getRankIcon={getRankIcon}
        />
      );
    },
    [openUserModal, getRankIcon]
  );

  const renderMobileCard = useCallback(
    (item, index) => {
      const rank = index + 1;
      return (
        <MemoizedRankCard
          key={`${item.memberEmail}-${index}`}
          item={item}
          rank={rank}
          onClick={openUserModal}
          getRankIcon={getRankIcon}
        />
      );
    },
    [openUserModal, getRankIcon]
  );

  return (
    <BoardWrapper>
      <Title>랭킹 보드</Title>

      <GlassContainer>
        {/* 데스크톱 테이블 */}
        <ScrollableTableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>순위</TableHeader>
                <TableHeader>점수</TableHeader>
                <TableHeader>캐릭터 이름</TableHeader>
                <TableHeader>MBTI</TableHeader>
                <TableHeader>이메일</TableHeader>
                <TableHeader>날짜</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>{data.rankings.map(renderDesktopRow)}</tbody>
          </Table>

          {/* 데스크톱 로딩 트리거 */}
          <LoadMoreTrigger ref={loadMoreRef} />
        </ScrollableTableContainer>

        {/* 모바일 카드 리스트 */}
        <MobileCardContainer
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {data.rankings.map(renderMobileCard)}

          {/* 모바일 로딩 트리거 */}
          <LoadMoreTrigger ref={loadMoreRef} />
        </MobileCardContainer>

        {/* 로딩 상태 표시 */}
        {(isLoadingMore || data.isLoading) && (
          <LoadingMoreIndicator
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <LoadingSpinner />
            <LoadingText>
              {data.isInitialLoading ? "랭킹을 불러오는 중..." : "더 많은 랭킹을 불러오는 중..."}
            </LoadingText>
          </LoadingMoreIndicator>
        )}

        {/* 에러 상태 표시 */}
        {data.error && (
          <ErrorContainer>
            <ErrorText>{data.error}</ErrorText>
            <RetryButton
              onClick={retryLoad}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowRepeat size={16} />
              다시 시도
            </RetryButton>
          </ErrorContainer>
        )}

        {/* 데이터 끝 표시 */}
        {!data.hasNextPage && data.rankings.length > 0 && !data.isInitialLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "20px",
              color: "rgba(255, 255, 255, 0.6)",
              borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            }}
          >
            모든 랭킹을 확인했습니다 ({data.rankings.length}명)
          </div>
        )}
      </GlassContainer>

      {/* 스크롤 진행 표시기 */}
      <ScrollProgressBar progress={scrollProgress} />

      {/* 맨 위로 버튼 */}
      {showScrollTop && (
        <ScrollToTopButton
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronUp size={20} />
        </ScrollToTopButton>
      )}

      <ButtonContainer>
        <Link to={"/"}>
          <ButtonSpan>
            <House size={16} />홈
          </ButtonSpan>
        </Link>
        <Link to={"/profile"}>
          <ButtonSpan>
            <Person size={16} />내 정보
          </ButtonSpan>
        </Link>
        <Link to={"/intro"}>
          <ButtonSpan>
            <Controller size={16} />
            다시하기
          </ButtonSpan>
        </Link>
      </ButtonContainer>

      {/* 사용자 상세 정보 모달 */}
      <UserDetailModal
        show={showModal}
        user={selectedUser}
        onClose={closeModal}
        getRankIcon={getRankIcon}
      />
    </BoardWrapper>
  );
}

// 메모이제이션된 컴포넌트들
const MemoizedTableRow = React.memo(({ item, rank, onClick, getRankIcon }) => (
  <TableRow onClick={() => onClick(item, rank)}>
    <RankCell rank={rank}>
      {getRankIcon(rank)}
      {rank}
    </RankCell>
    <ScoreCell>{item.finalScore}점</ScoreCell>
    <TableCell>{item.characterName}</TableCell>
    <TableCell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
        <PersonCircle size={16} />
        {item.mbti}
      </div>
    </TableCell>
    <TableCell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
        <Envelope size={14} />
        {item.memberEmail}
      </div>
    </TableCell>
    <TableCell>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
        <Clock size={14} />
        {TimeUtil.getRelativeTime(item.gameDate)}
      </div>
    </TableCell>
  </TableRow>
));

const MemoizedRankCard = React.memo(({ item, rank, onClick, getRankIcon }) => (
  <RankCard
    rank={rank}
    onClick={() => onClick(item, rank)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <MobileRankDisplay>
      {getRankIcon(rank)}
      <MobileRankNumber rank={rank}>{rank}위</MobileRankNumber>
    </MobileRankDisplay>

    <MobileUserInfo>
      <MobileUserName>{item.characterName}</MobileUserName>
      <MobileMetaInfo>
        <MobileMetaItem>
          <PersonCircle size={14} />
          {item.mbti}
        </MobileMetaItem>
        <MobileMetaItem>
          <Clock size={14} />
          {TimeUtil.getRelativeTime(item.gameDate)}
        </MobileMetaItem>
      </MobileMetaInfo>
    </MobileUserInfo>

    <MobileScore>
      <MobileScoreValue>{item.finalScore}</MobileScoreValue>
      <MobileScoreLabel>점</MobileScoreLabel>
    </MobileScore>
  </RankCard>
));

// 사용자 상세 정보 모달 컴포넌트
const ModalOverlay = styled(motion.div)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
`;

const ModalContent = styled(motion.div)`
  position: relative;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.5);
  color: white;

  @media (max-width: 768px) {
    padding: 1.5rem;
    margin: 10px;
  }
`;

const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
`;

const ModalUserInfo = styled.div`
  flex: 1;
`;

const ModalUserName = styled.h2`
  font-size: 1.8em;
  font-weight: 700;
  margin: 0 0 5px 0;
  color: rgba(200, 182, 226, 1);
`;

const ModalUserRank = styled.div`
  font-size: 1.2em;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ModalDetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ModalDetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
  }
`;

const ModalDetailLabel = styled.div`
  font-weight: 600;
  color: rgba(200, 182, 226, 1);
  min-width: 80px;
`;

const ModalDetailValue = styled.div`
  flex: 1;
  color: white;
  word-break: break-all;
`;

const CloseButton = styled(motion.button)`
  position: absolute;
  top: 15px;
  right: 15px;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    transform: scale(1.1);
  }
`;

function UserDetailModal({ show, user, onClose, getRankIcon }) {
  if (!show || !user) return null;

  return (
    <AnimatePresence>
      <ModalOverlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <ModalContent
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <CloseButton onClick={onClose} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <XLg size={18} />
          </CloseButton>

          <ModalHeader>
            <div style={{ fontSize: "2em" }}>{getRankIcon(user.rank)}</div>
            <ModalUserInfo>
              <ModalUserName>{user.characterName}</ModalUserName>
              <ModalUserRank>
                <Trophy size={18} color="white" />
                {user.rank}위 • {user.finalScore}점
              </ModalUserRank>
            </ModalUserInfo>
          </ModalHeader>

          <ModalDetailSection>
            <ModalDetailRow>
              <PersonCircle size={20} />
              <ModalDetailLabel>MBTI</ModalDetailLabel>
              <ModalDetailValue>{user.mbti}</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailRow>
              <Envelope size={20} />
              <ModalDetailLabel>이메일</ModalDetailLabel>
              <ModalDetailValue>{user.memberEmail}</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailRow>
              <Calendar3 size={20} />
              <ModalDetailLabel>게임 날짜</ModalDetailLabel>
              <ModalDetailValue>{TimeUtil.formatDetailedDateTime(user.gameDate)}</ModalDetailValue>
            </ModalDetailRow>

            <ModalDetailRow>
              <Clock size={20} />
              <ModalDetailLabel>진행 시간</ModalDetailLabel>
              <ModalDetailValue>
                {user.gamePlaySeconds > 0
                  ? TimeUtil.formatPlayTime(user.gamePlaySeconds)
                  : "기록 없음"}
              </ModalDetailValue>
            </ModalDetailRow>

            {user.details && user.details !== "string" && (
              <ModalDetailRow>
                <Controller size={20} />
                <ModalDetailLabel>상세 정보</ModalDetailLabel>
                <ModalDetailValue>{user.details}</ModalDetailValue>
              </ModalDetailRow>
            )}
          </ModalDetailSection>
        </ModalContent>
      </ModalOverlay>
    </AnimatePresence>
  );
}

export default Board;
