import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  Person,
  House,
  PersonCircle,
  Clock
} from "react-bootstrap-icons";
import axios from "../utils/axios";
import TimeUtil from "../utils/TimeUtil";

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
  max-height: 70vh;
  display: flex;
  flex-direction: column;

  @media (max-width: 768px) {
    width: 95%;
    max-height: 75vh;
    border-radius: 15px;
  }

  @media (max-width: 480px) {
    width: 100%;
    max-height: 80vh;
    border-radius: 12px;
  }
`;

// 데스크톱 테이블
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background: transparent;

  @media (max-width: 768px) {
    display: none;
  }
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

  ${props => {
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
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.1); }
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

  ${props => {
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

  ${props => {
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

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  padding: 20px;
  background: rgba(0, 0, 0, 0.2);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 15px;

  @media (max-width: 768px) {
    padding: 15px;
    gap: 10px;
  }

  @media (max-width: 480px) {
    padding: 10px;
    gap: 8px;
  }
`;

const PaginationButton = styled.button`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 10px 20px;
  border-radius: 12px;
  font-size: 1em;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;

  &:hover:not(:disabled) {
    background: rgba(200, 182, 226, 0.3);
    border-color: rgba(200, 182, 226, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(200, 182, 226, 0.2);
  }

  &:disabled {
    background: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.1);
  }

  @media (max-width: 768px) {
    padding: 8px 16px;
    font-size: 0.9em;
  }

  @media (max-width: 480px) {
    padding: 6px 12px;
    font-size: 0.8em;
  }
`;

const PaginationInfo = styled.span`
  font-size: 1.2em;
  color: white;
  font-weight: 500;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  min-width: 80px;
  text-align: center;

  @media (max-width: 768px) {
    font-size: 1em;
    min-width: 60px;
  }

  @media (max-width: 480px) {
    font-size: 0.9em;
    min-width: 50px;
  }
`;

function Board() {
  const { page } = useParams();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("refreshToken");
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const currentPage = parseInt(page, 10) || 1;
  const pageSize = 10;

  // 랭킹 아이콘 렌더링 함수
  const getRankIcon = (rank) => {
    if (rank === 1) return <TrophyFill size={24} color="white" />;
    if (rank === 2) return <Award size={20} color="white" />;
    if (rank === 3) return <Award size={20} color="white" />;
    if (rank <= 5) return <StarFill size={18} color="white" />;
    return <Star size={16} color="white" />;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "/api/game/ranking",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            params: {
              page: currentPage - 1, // API 페이지는 0부터 시작
              size: pageSize,
            },
          }
        );
        setData(response.data.rankings || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalItems(response.data.totalItems || 0);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, accessToken, pageSize]);

  // 사용자 상세 정보 모달 열기
  const openUserModal = (userData, rank) => {
    setSelectedUser({ ...userData, rank });
    setShowModal(true);
  };

  // 모달 닫기
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const nextPage = () => {
    navigate(`/board/${currentPage + 1}`);
  };

  const prevPage = () => {
    if (currentPage > 1) {
      navigate(`/board/${currentPage - 1}`);
    }
  };

  return (
    <BoardWrapper>
      <Title>
        랭킹 보드
      </Title>

      <GlassContainer>
        {/* 데스크톱 테이블 */}
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
          <tbody>
            {data.map((item, index) => {
              const rank = (currentPage - 1) * pageSize + index + 1;
              return (
                <TableRow
                  key={index}
                  onClick={() => openUserModal(item, rank)}
                >
                  <RankCell rank={rank}>
                    {getRankIcon(rank)}
                    {rank}
                  </RankCell>
                  <ScoreCell>{item.finalScore}점</ScoreCell>
                  <TableCell>{item.characterName}</TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <PersonCircle size={16} />
                      {item.mbti}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Envelope size={14} />
                      {item.memberEmail}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
                      <Clock size={14} />
                      {TimeUtil.getRelativeTime(item.gameDate)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </tbody>
        </Table>

        {/* 모바일 카드 리스트 */}
        <MobileCardContainer>
          {data.map((item, index) => {
            const rank = (currentPage - 1) * pageSize + index + 1;
            return (
              <RankCard
                key={index}
                rank={rank}
                onClick={() => openUserModal(item, rank)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <MobileRankDisplay>
                  {getRankIcon(rank)}
                  <MobileRankNumber rank={rank}>
                    {rank}위
                  </MobileRankNumber>
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
            );
          })}
        </MobileCardContainer>

        <PaginationWrapper>
          <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
            <ChevronLeft size={16} />
            이전
          </PaginationButton>
          <PaginationInfo>
            {currentPage} / {totalPages}
          </PaginationInfo>
          <PaginationButton
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            다음
            <ChevronRight size={16} />
          </PaginationButton>
        </PaginationWrapper>
      </GlassContainer>

      <ButtonContainer>
        <Link to={"/"}>
          <ButtonSpan>
            <House size={16} />
            홈
          </ButtonSpan>
        </Link>
        <Link to={"/profile"}>
          <ButtonSpan>
            <Person size={16} />
            내 정보
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
      />
    </BoardWrapper>
  );
}

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

function UserDetailModal({ show, user, onClose }) {
  if (!show || !user) return null;

  const getRankIcon = (rank) => {
    if (rank === 1) return <TrophyFill size={24} color="white" />;
    if (rank === 2) return <Award size={20} color="white" />;
    if (rank === 3) return <Award size={20} color="white" />;
    if (rank <= 5) return <StarFill size={18} color="white" />;
    return <Star size={16} color="white" />;
  };

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
          <CloseButton
            onClick={onClose}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <XLg size={18} />
          </CloseButton>

          <ModalHeader>
            <div style={{ fontSize: '2em' }}>
              {getRankIcon(user.rank)}
            </div>
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
                  : '기록 없음'
                }
              </ModalDetailValue>
            </ModalDetailRow>

            {user.details && user.details !== 'string' && (
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
