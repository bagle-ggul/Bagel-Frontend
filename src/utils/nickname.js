// 서버 GuestStartForm 닉네임 규칙과 동일해야 함 (2~12자, 한글·영문·숫자·밑줄)
export const NICKNAME_MIN_LENGTH = 2;
export const NICKNAME_MAX_LENGTH = 12;
const NICKNAME_ALLOWED_PATTERN = /^[가-힣a-zA-Z0-9_]+$/;

/**
 * 닉네임 입력값 검증: 비어 있으면 통과(서버가 자동 생성), 아니면 길이 > 문자 규칙 순
 * @param {string} nickname
 * @returns {string} 오류 메시지. 통과하면 빈 문자열
 */
export const getNicknameError = (nickname) => {
  const trimmedNickname = (nickname ?? "").trim();

  if (!trimmedNickname) {
    return "";
  }
  if (
    trimmedNickname.length < NICKNAME_MIN_LENGTH ||
    trimmedNickname.length > NICKNAME_MAX_LENGTH
  ) {
    return `닉네임은 ${NICKNAME_MIN_LENGTH}~${NICKNAME_MAX_LENGTH}자로 입력해주세요.`;
  }
  if (!NICKNAME_ALLOWED_PATTERN.test(trimmedNickname)) {
    return "닉네임은 한글, 영문, 숫자, 밑줄(_)만 사용할 수 있어요.";
  }
  return "";
};
