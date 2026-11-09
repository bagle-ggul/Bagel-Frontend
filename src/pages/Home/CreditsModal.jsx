import { motion } from "framer-motion";
import React from "react";

import { Modal } from "../../components/ui";

import {
  DetailRow,
  MemberName,
  MemberRole,
  TeamDetails,
  TeamInfo,
  TeamList,
  TeamMember,
  TeamName,
} from "./CreditsModal.styled";

/** 팀 정보는 화면에만 쓰이는 고정 데이터라 컴포넌트 옆에 둔다 */
const TEAM_MEMBERS = [
  { name: "서새찬", role: "Backend, Frontend, 발표 및 Document 문서화" },
  { name: "이창규", role: "Frontend, 이미지 생성" },
  { name: "강인권", role: "Frontend" },
  { name: "신혁수", role: "Frontend" },
  { name: "김현서", role: "스토리 제작 및 전체 통괄, 이미지 생성" },
  { name: "김도현", role: "스토리 제작 및 전체 통괄, 이미지 생성" },
];

/** 팀·해커톤 정보를 보여주는 크레딧 모달 */
function CreditsModal({ onClose }) {
  return (
    <Modal title="크레딧" onClose={onClose} maxWidth="700px">
      <TeamInfo>
        <TeamName>그녀가사다준 뉴욕 베이글 (그뉴베)</TeamName>
        <TeamDetails>
          <DetailRow>
            <span>날짜: 2024.05.17 | 주제: 파도, 시간, 미로</span>
          </DetailRow>
          <DetailRow>
            <span>세종대학교 소프트웨어융합대학 해커톤</span>
          </DetailRow>
        </TeamDetails>
      </TeamInfo>
      <TeamList>
        {TEAM_MEMBERS.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <TeamMember>
              <MemberName>{member.name}</MemberName>
              <MemberRole>{member.role}</MemberRole>
            </TeamMember>
          </motion.div>
        ))}
      </TeamList>
    </Modal>
  );
}

export default CreditsModal;
