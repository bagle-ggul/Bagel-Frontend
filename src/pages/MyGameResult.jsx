// src/components/MyGameResults.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import { motion } from "framer-motion";

const ResultsWrapper = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100vw;
  height: 100vh;
  background: url("/img/community.png") no-repeat center center;
  background-size: cover;
  padding: 20px;
`;

const ResultCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 20px;
  width: 90%;
  max-width: 500px;
  margin-bottom: 20px;
  text-align: center;
  position: relative;
`;

const DeleteButton = styled(motion.button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: #e74c3c;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  cursor: pointer;
  transition: background-color 0.3s ease, transform 0.3s ease;

  &:hover {
    background-color: #c0392b;
    transform: translateY(-2px);
  }

  &:active {
    background-color: #a93226;
    transform: translateY(0);
  }
`;

const ResultDetail = styled(motion.p)`
  font-size: 1em;
  color: #666;
  margin: 5px 0;
`;

function MyGameResults() {
  const accessToken = localStorage.getItem("refreshToken");
  const [results, setResults] = useState([]);
  console.log(accessToken);
  useEffect(() => {
    console.log(accessToken);
    const fetchResults = async () => {
      try {
        const response = await axios.get(
          "https://api.she-is-newyork-bagel.co.kr/api/game/my-results",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`, // 토큰을 적절하게 설정
            },
          }
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching game results:", error);
      }
    };

    fetchResults();
  }, []);

  const handleDelete = async (gameResultId) => {
    try {
      await axios.delete(
        `https://api.she-is-newyork-bagel.co.kr/api/game/my-results/${gameResultId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 토큰을 적절하게 설정
          },
        }
      );
      setResults(results.filter((result) => result.id !== gameResultId));
    } catch (error) {
      console.error("Error deleting game result:", error);
    }
  };

  return (
    <ResultsWrapper
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {results.map((result) => (
        <ResultCard
          key={result.id}
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <DeleteButton onClick={() => handleDelete(result.id)}>
            삭제
          </DeleteButton>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            ID: {result.id}
          </ResultDetail>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            Score: {result.finalScore}
          </ResultDetail>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            Success: {result.success ? "Yes" : "No"}
          </ResultDetail>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1 }}
          >
            Date: {new Date(result.gameDate).toLocaleString()}
          </ResultDetail>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.2 }}
          >
            Play Time: {result.gamePlaySeconds}초
          </ResultDetail>
          <ResultDetail
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.4 }}
          >
            Details: {result.details}
          </ResultDetail>
        </ResultCard>
      ))}
    </ResultsWrapper>
  );
}

export default MyGameResults;
