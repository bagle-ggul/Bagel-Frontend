import styled from "styled-components";

import { border, surface, text } from "../../styles/semantic";

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid ${border.subtle};
`;

export const ModalRankIcon = styled.div`
  font-size: 2em;
`;

export const ModalUserRank = styled.div`
  font-size: 1.2em;
  font-weight: 600;
  color: ${text.muted};
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ModalDetailSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

export const ModalDetailRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: ${surface.faint};
  border-radius: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: ${surface.raised};
  }
`;

export const ModalDetailLabel = styled.div`
  font-weight: 600;
  color: ${text.accent};
  min-width: 80px;
`;

export const ModalDetailValue = styled.div`
  flex: 1;
  color: ${text.primary};
  word-break: break-all;
`;
