import React from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import { ROUTES } from "../constants/routes";
import { colors, glassmorphism, media } from "../styles/theme";

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: url("/img/bg_beach_main.png") no-repeat center center;
  background-size: cover;
  padding: 2rem;
`;

const Panel = styled.div`
  ${glassmorphism};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  padding: 3rem 2.5rem;
  max-width: 30rem;
  text-align: center;

  ${media.mobile} {
    padding: 2rem 1.5rem;
  }
`;

const Code = styled.p`
  margin: 0;
  font-size: 3.5rem;
  font-weight: 700;
  color: ${colors.primary};
  line-height: 1;

  ${media.mobile} {
    font-size: 2.5rem;
  }
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.4rem;
  color: ${colors.textPrimary};

  ${media.mobile} {
    font-size: 1.15rem;
  }
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.6;
  color: ${colors.textSecondary};
`;

const HomeLink = styled(Link)`
  margin-top: 0.5rem;
  padding: 0.75rem 2rem;
  border-radius: 12px;
  background: ${colors.primary};
  border: 1px solid ${colors.glassBorder};
  color: ${colors.textPrimary};
  font-size: 1rem;
  text-decoration: none;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(200, 182, 226, 1);
    transform: translateY(-2px);
  }
`;

/**
 * 라우터의 errorElement.
 * 이전에는 없는 주소로 들어가면 아무 안내 없는 빈 화면이 떴다.
 */
function NotFound() {
  return (
    <Wrapper>
      <Panel>
        <Code>404</Code>
        <Title>길을 잃으셨군요</Title>
        <Description>
          찾으시는 페이지가 없습니다.
          <br />
          주소가 바뀌었거나 잘못 입력하셨을 수 있어요.
        </Description>
        <HomeLink to={ROUTES.HOME}>처음으로 돌아가기</HomeLink>
      </Panel>
    </Wrapper>
  );
}

export default NotFound;
