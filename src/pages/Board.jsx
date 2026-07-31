import { motion, AnimatePresence } from "framer-motion";
import React, { useState, useCallback } from "react";
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
import { Link } from "react-router-dom";
import styled from "styled-components";

import {
  useInfiniteScrollObserver,
  useScrollProgress,
  useScrollToTop,
  useTouchSwipe,
} from "../hooks/useInfiniteScroll";
import { useRankingData } from "../hooks/useRankingData";
import TimeUtil from "../utils/TimeUtil";

import {
  BoardWrapper,
  ButtonContainer,
  ButtonSpan,
  ErrorContainer,
  ErrorText,
  GlassContainer,
  LoadMoreTrigger,
  LoadingMoreIndicator,
  LoadingSpinner,
  LoadingText,
  MobileCardContainer,
  MobileMetaInfo,
  MobileMetaItem,
  MobileRankDisplay,
  MobileRankNumber,
  MobileScore,
  MobileScoreLabel,
  MobileScoreValue,
  MobileUserInfo,
  MobileUserName,
  RankCard,
  RankCell,
  RetryButton,
  ScoreCell,
  ScrollProgressBar,
  ScrollToTopButton,
  ScrollableTableContainer,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Title,
} from "./Board.styled";

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
      <ScrollProgressBar $progress={scrollProgress} />

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
