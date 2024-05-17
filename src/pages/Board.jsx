import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

// 배경 이미지 URL
const backgroundImageUrl = "/img/분기2.png";

const BoardWrapper = styled.div`
  background-image: url(${backgroundImageUrl});
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  width: 100vw;
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 3em;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.6);
  margin-bottom: 20px;
`;

const Table = styled.table`
  width: 80%;
  max-width: 1200px;
  margin: 0 auto;
  border-collapse: collapse;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const TableHead = styled.thead`
  background-color: #333;
  color: white;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: #f2f2f2;
  }
`;

const TableHeader = styled.th`
  padding: 15px;
  font-size: 1em;
`;

const TableCell = styled.td`
  padding: 15px;
  font-size: 1em;
  text-align: center;
  color: #333;
`;

const MenuLink = styled(Link)`
  text-decoration: none;
`;

const ButtonContainer = styled.div`
  display: flex;
  position: absolute;
  top: 20px;
  right: 10px;
`;

const ButtonSpan = styled.span`
  background-color: #333;
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
  transition: background-color 0.3s ease, transform 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: inline-block;
  margin-left: 10px;
  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #444;
    transform: translateY(0);
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
`;

const PaginationButton = styled.button`
  background-color: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  margin: 0 5px;
  border-radius: 5px;
  font-size: 1em;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #555;
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: #aaa;
    cursor: not-allowed;
  }
`;

const PaginationInfo = styled.span`
  font-size: 1.2em;
  color: white;
`;

function Board() {
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.she-is-newyork-bagel.co.kr/api/game/ranking", {
          params: {
            page: currentPage - 1, // API 페이지는 0부터 시작
            size: pageSize,
          },
        });
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  const indexOfLastPost = currentPage * pageSize;
  const indexOfFirstPost = indexOfLastPost - pageSize;
  const currentData = data.slice(indexOfFirstPost, indexOfLastPost);

  const nextPage = () => {
    if (currentPage < Math.ceil(data.length / pageSize)) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <BoardWrapper>
      <Title>랭킹 게시판</Title>
      <Table>
        <TableHead>
          <TableRow>
            <TableHeader>순위</TableHeader>
            <TableHeader>캐릭터 이름</TableHeader>
            <TableHeader>점수</TableHeader>
            <TableHeader>MBTI</TableHeader>
            <TableHeader>날짜</TableHeader>
            <TableHeader>플레이 시간</TableHeader>
            <TableHeader>세부 사항</TableHeader>
          </TableRow>
        </TableHead>
        <tbody>
          {currentData.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{indexOfFirstPost + index + 1}</TableCell>
              <TableCell>{item.characterName}</TableCell>
              <TableCell>{item.finalScore}</TableCell>
              <TableCell>{item.mbti}</TableCell>
              <TableCell>{new Date(item.gameDate).toLocaleString()}</TableCell>
              <TableCell>{item.gamePlaySeconds}초</TableCell>
              <TableCell>{item.details}</TableCell>
            </TableRow>
          ))}
        </tbody>
      </Table>
      <PaginationWrapper>
        <PaginationButton onClick={prevPage} disabled={currentPage === 1}>
          이전
        </PaginationButton>
        <PaginationInfo>
          {currentPage} / {Math.ceil(data.length / pageSize)}
        </PaginationInfo>
        <PaginationButton
          onClick={nextPage}
          disabled={currentPage === Math.ceil(data.length / pageSize)}
        >
          다음
        </PaginationButton>
      </PaginationWrapper>
      <ButtonContainer>
        <Link to={"/"}>
          <ButtonSpan>홈</ButtonSpan>
        </Link>
        <Link to={"/profile"}>
          <ButtonSpan>내 정보</ButtonSpan>
        </Link>
        <Link to={"/intro"}>
          <ButtonSpan>다시하기</ButtonSpan>
        </Link>
      </ButtonContainer>
    </BoardWrapper>
  );
}

export default Board;
