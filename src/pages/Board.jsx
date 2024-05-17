import React from "react";
import styled from "styled-components";
import { useState, useEffect } from "react";
import axios from "axios";

// 배경 이미지 URL
const backgroundImageUrl = "/img/Background.png";

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
  font-size: 2em;
  color: black; /* 타이틀 텍스트 색상을 흰색으로 설정 */
`;
const PostWrap = styled.div`
  display: flex;
  flex-direction: row;
`;
const Post = styled.div`
  background-color: rgba(255, 255, 255, 0.8); /* 투명한 흰색 배경 */
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 100%;
  padding: 15px;
  margin: 10px 0;
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const PostTitle = styled.h2`
  font-size: 1.5em;
  margin-bottom: 10px;
`;

const PostDetail = styled.p`
  font-size: 1em;
  margin: 5px 0;
  color: #333; /* 텍스트 색상을 어두운 회색으로 설정 */
`;

function Board() {
  const [data, setData] = useState([
    {
      characterName: "민서",
      finalScore: 3000,
      mbti: "mbti",
      gameDate: "2024-05-17T13:10:56.937Z",
      gamePlaySeconds: 300,
      details: "아직 사용계획 없음",
    },
    {
        characterName: "민서",
        finalScore: 3000,
        mbti: "mbti",
        gameDate: "2024-05-17T13:10:56.937Z",
        gamePlaySeconds: 300,
        details: "아직 사용계획 없음",
      },
  ]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://api.she-is-newyork-bagel.co.kr/api/signup"
        ); // 데이터를 가져올 API의 URL을 넣어주세요.
        console.log(response);
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    // 페이지가 로드될 때와 일정 시간 간격으로 데이터를 가져오도록 설정
    fetchData();
    const interval = setInterval(fetchData, 5000); // 5초마다 데이터를 가져옴

    // Clean-up 함수를 이용하여 컴포넌트가 언마운트 될 때 interval을 정리
    return () => clearInterval(interval);
  }, []);
  return (
    <BoardWrapper>
      <Title>랭킹 게시판</Title>

      {data.map((item, index) => (
        <Post key={index}>
          <PostTitle>{item.characterName}</PostTitle>
          <PostDetail>점수: {item.finalScore}</PostDetail>
          <PostDetail>MBTI: {item.mbti}</PostDetail>
          <PostDetail>
            게임 날짜: {new Date(item.gameDate).toLocaleString()}
          </PostDetail>
          <PostDetail>게임 시간: {item.gamePlaySeconds}초</PostDetail>
          <PostDetail>세부 사항: {item.details}</PostDetail>
        </Post>
      ))}
    </BoardWrapper>
  );
}

export default Board;
