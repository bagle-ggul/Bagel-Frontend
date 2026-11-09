import { AnimatePresence } from "framer-motion";
import React, { useState, useCallback } from "react";
import {
  TrophyFill,
  Award,
  Star,
  StarFill,
  Controller,
  Person,
  House,
  PersonCircle,
  Clock,
  ChevronUp,
  ArrowRepeat,
} from "react-bootstrap-icons";
import { Link } from "react-router-dom";

import { Button } from "../components/ui";
import {
  useInfiniteScrollObserver,
  useScrollProgress,
  useScrollToTop,
  useTouchSwipe,
} from "../hooks/useInfiniteScroll";
import { useRankingData } from "../hooks/useRankingData";
import TimeUtil from "../utils/TimeUtil";

import BoardEmptyState from "./Board/BoardEmptyState";
import {
  CellContent,
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
  ScoreCell,
  ScrollableTableContainer,
  Table,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./Board/BoardList.styled";
import UserDetailModal from "./Board/UserDetailModal";
import {
  BoardWrapper,
  ButtonContainer,
  EndOfListNotice,
  ErrorContainer,
  ErrorText,
  GlassContainer,
  LoadMoreTrigger,
  LoadingMoreIndicator,
  LoadingSpinner,
  LoadingText,
  ScrollProgressBar,
  ScrollToTopButton,
  Title,
  TopNavButton,
} from "./Board.styled";

function Board() {
  const [selectedUser, setSelectedUser] = useState(null);

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

  // 로딩과 에러가 끝났는데도 목록이 비어 있는 경우 (아직 아무도 기록을 남기지 않음)
  const isRankingEmpty =
    !data.isInitialLoading && !data.isLoading && !data.error && data.rankings.length === 0;

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
  }, []);

  // 모달 닫기
  const closeModal = useCallback(() => {
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
          key={item.gameResultId ?? index}
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
          key={item.gameResultId ?? index}
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
        {isRankingEmpty && <BoardEmptyState />}

        {/* 데스크톱 테이블 */}
        {!isRankingEmpty && (
          <ScrollableTableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableHeader>순위</TableHeader>
                  <TableHeader>점수</TableHeader>
                  <TableHeader>닉네임</TableHeader>
                  <TableHeader>MBTI</TableHeader>
                  <TableHeader>날짜</TableHeader>
                </TableRow>
              </TableHead>
              <tbody>{data.rankings.map(renderDesktopRow)}</tbody>
            </Table>

            {/* 데스크톱 로딩 트리거 */}
            <LoadMoreTrigger ref={loadMoreRef} />
          </ScrollableTableContainer>
        )}

        {/* 모바일 카드 리스트 */}
        {!isRankingEmpty && (
          <MobileCardContainer
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {data.rankings.map(renderMobileCard)}

            {/* 모바일 로딩 트리거 */}
            <LoadMoreTrigger ref={loadMoreRef} />
          </MobileCardContainer>
        )}

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
            <Button type="button" onClick={retryLoad}>
              <ArrowRepeat size={16} />
              다시 시도
            </Button>
          </ErrorContainer>
        )}

        {/* 데이터 끝 표시 */}
        {!data.hasNextPage && data.rankings.length > 0 && !data.isInitialLoading && (
          <EndOfListNotice>모든 랭킹을 확인했습니다 ({data.rankings.length}명)</EndOfListNotice>
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
        <TopNavButton as={Link} to="/" variant="ghost">
          <House size={16} />홈
        </TopNavButton>
        <TopNavButton as={Link} to="/profile" variant="ghost">
          <Person size={16} />내 정보
        </TopNavButton>
        <TopNavButton as={Link} to="/intro" variant="ghost">
          <Controller size={16} />
          다시하기
        </TopNavButton>
      </ButtonContainer>

      {/* 사용자 상세 정보 모달 */}
      <AnimatePresence>
        {selectedUser && (
          <UserDetailModal user={selectedUser} onClose={closeModal} getRankIcon={getRankIcon} />
        )}
      </AnimatePresence>
    </BoardWrapper>
  );
}

// 메모이제이션된 컴포넌트들
const MemoizedTableRow = React.memo(({ item, rank, onClick, getRankIcon }) => (
  <TableRow onClick={() => onClick(item, rank)}>
    <RankCell $rank={rank}>
      {getRankIcon(rank)}
      {rank}
    </RankCell>
    <ScoreCell>{item.finalScore}점</ScoreCell>
    <TableCell>{item.characterName}</TableCell>
    <TableCell>
      <CellContent>
        <PersonCircle size={16} />
        {item.mbti}
      </CellContent>
    </TableCell>
    <TableCell>
      <CellContent>
        <Clock size={14} />
        {TimeUtil.getRelativeTime(item.gameDate)}
      </CellContent>
    </TableCell>
  </TableRow>
));

const MemoizedRankCard = React.memo(({ item, rank, onClick, getRankIcon }) => (
  <RankCard
    $rank={rank}
    onClick={() => onClick(item, rank)}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    <MobileRankDisplay>
      {getRankIcon(rank)}
      <MobileRankNumber $rank={rank}>{rank}위</MobileRankNumber>
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

export default Board;
