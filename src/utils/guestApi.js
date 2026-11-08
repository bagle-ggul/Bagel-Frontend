import axios from "./axios";

/**
 * 시작 화면 초기값으로 쓸 닉네임 추천 (서버에 저장하지 않음)
 * @returns {Promise<string>}
 */
export const fetchSuggestedNickname = async () => {
  const response = await axios.get("/api/guest/nickname");
  return response.data.characterName;
};

/**
 * 가입·로그인 없이 닉네임(선택)과 MBTI로 플레이 시작
 * 닉네임이 비어 있으면 필드를 보내지 않아 서버가 자동 생성
 * @param {{characterName?: string, mbti: string}} startRequest
 * @returns {Promise<{id: number, characterName: string, mbti: string, refreshToken: string}>}
 */
export const startAsGuest = async ({ characterName, mbti }) => {
  const trimmedCharacterName = (characterName ?? "").trim();
  const requestBody = trimmedCharacterName
    ? { characterName: trimmedCharacterName, mbti }
    : { mbti };

  const response = await axios.post("/api/guest/start", requestBody);
  return response.data;
};
