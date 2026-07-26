import { logger } from "./logger";

/**
 * 시간 관련 유틸리티 함수들
 */
export class TimeUtil {
  /**
   * ISO 날짜 문자열을 상대 시간으로 변환
   * @param {string} isoDateString - ISO 형식의 날짜 문자열
   * @returns {string} - "몇 일 전", "몇 시간 전" 형태의 문자열
   */
  static getRelativeTime(isoDateString) {
    try {
      const now = new Date();
      const past = new Date(isoDateString);

      // 유효하지 않은 날짜 체크
      if (isNaN(past.getTime())) {
        return "알 수 없음";
      }

      const diffTime = Math.abs(now - past);
      const diffMinutes = Math.floor(diffTime / (1000 * 60));
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const diffWeeks = Math.floor(diffDays / 7);
      const diffMonths = Math.floor(diffDays / 30);

      if (diffMonths > 0) {
        return `${diffMonths}개월 전`;
      } else if (diffWeeks > 0) {
        return `${diffWeeks}주 전`;
      } else if (diffDays > 0) {
        return `${diffDays}일 전`;
      } else if (diffHours > 0) {
        return `${diffHours}시간 전`;
      } else if (diffMinutes > 0) {
        return `${diffMinutes}분 전`;
      } else {
        return "방금 전";
      }
    } catch (error) {
      logger.error("시간 변환 오류:", error);
      return "알 수 없음";
    }
  }

  /**
   * ISO 날짜 문자열을 한국 형식으로 변환
   * @param {string} isoDateString - ISO 형식의 날짜 문자열
   * @returns {string} - "YYYY년 MM월 DD일" 형태의 문자열
   */
  static formatKoreanDate(isoDateString) {
    try {
      const date = new Date(isoDateString);

      if (isNaN(date.getTime())) {
        return "알 수 없음";
      }

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      return `${year}년 ${month}월 ${day}일`;
    } catch (error) {
      logger.error("날짜 형식 변환 오류:", error);
      return "알 수 없음";
    }
  }

  /**
   * ISO 날짜 문자열을 상세 시간으로 변환
   * @param {string} isoDateString - ISO 형식의 날짜 문자열
   * @returns {string} - "YYYY년 MM월 DD일 HH시 MM분" 형태의 문자열
   */
  static formatDetailedDateTime(isoDateString) {
    try {
      const date = new Date(isoDateString);

      if (isNaN(date.getTime())) {
        return "알 수 없음";
      }

      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const hours = date.getHours();
      const minutes = date.getMinutes();

      return `${year}년 ${month}월 ${day}일 ${hours}시 ${minutes.toString().padStart(2, "0")}분`;
    } catch (error) {
      logger.error("상세 시간 변환 오류:", error);
      return "알 수 없음";
    }
  }

  /**
   * 게임 플레이 시간을 포맷팅
   * @param {number} seconds - 초 단위의 플레이 시간
   * @returns {string} - "MM분 SS초" 형태의 문자열
   */
  static formatPlayTime(seconds) {
    if (typeof seconds !== "number" || seconds < 0) {
      return "0초";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    if (minutes > 0) {
      return `${minutes}분 ${remainingSeconds}초`;
    } else {
      return `${remainingSeconds}초`;
    }
  }
}

export default TimeUtil;
