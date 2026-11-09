import { Calendar3, Clock, Controller, PersonCircle } from "react-bootstrap-icons";

import { Modal } from "../../components/ui";
import TimeUtil from "../../utils/TimeUtil";

import {
  ModalDetailLabel,
  ModalDetailRow,
  ModalDetailSection,
  ModalDetailValue,
  ModalHeader,
  ModalRankIcon,
  ModalUserRank,
} from "./UserDetailModal.styled";

/**
 * 랭킹 사용자 상세 모달: 순위·점수 요약 + MBTI, 게임 날짜, 진행 시간, 상세 정보
 * 공용 Modal 사용 (제목은 닉네임)
 */
function UserDetailModal({ user, onClose, getRankIcon }) {
  return (
    <Modal title={user.characterName} onClose={onClose} maxWidth="500px">
      <ModalHeader>
        <ModalRankIcon>{getRankIcon(user.rank)}</ModalRankIcon>
        <ModalUserRank>
          {user.rank}위 • {user.finalScore}점
        </ModalUserRank>
      </ModalHeader>

      <ModalDetailSection>
        <ModalDetailRow>
          <PersonCircle size={20} />
          <ModalDetailLabel>MBTI</ModalDetailLabel>
          <ModalDetailValue>{user.mbti}</ModalDetailValue>
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
            {user.gamePlaySeconds > 0 ? TimeUtil.formatPlayTime(user.gamePlaySeconds) : "기록 없음"}
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
    </Modal>
  );
}

export default UserDetailModal;
