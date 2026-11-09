import styled from "styled-components";

import { border, surface, text } from "../../styles/semantic";
import { radius } from "../../styles/tokens";

// 크레딧 모달 내용: 팀 정보 카드, 팀원 목록

export const TeamInfo = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: ${surface.faint};
  border-radius: ${radius.md};
  border: 1px solid ${border.subtle};

  @media (max-width: 768px) {
    padding: 1.2rem;
    margin-bottom: 1.5rem;
  }
`;

export const TeamName = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: ${text.accent};

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

export const TeamDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 1rem;
  opacity: 0.85;
  line-height: 1.6;

  @media (max-width: 768px) {
    font-size: 0.9rem;
  }
`;

export const DetailRow = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;

  strong {
    opacity: 1;
    font-weight: 600;
  }
`;

export const TeamList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const TeamMember = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.2rem 1.5rem;
  background: ${surface.raised};
  border-radius: ${radius.md};
  transition: all 0.3s ease;
  gap: 0.5rem;

  &:hover {
    background: ${surface.raisedHover};
    transform: translateX(5px);
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const MemberName = styled.span`
  font-size: 1.3rem;
  font-weight: 700;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const MemberRole = styled.span`
  font-size: 0.95rem;
  opacity: 0.85;
  line-height: 1.5;

  @media (max-width: 768px) {
    font-size: 0.85rem;
  }
`;
