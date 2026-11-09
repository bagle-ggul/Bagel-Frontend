import { useEffect } from "react";
import { useRecoilState } from "recoil";

import { characterNameAtom } from "../atom/atom";
import axios from "../utils/axios";
import { logger } from "../utils/logger";

/**
 * 플레이어 닉네임: atom 값 반환, 비었으면(새로고침 등) 프로필 조회로 보충
 * shouldRefresh: 값이 있어도 1회 다시 조회 (게임 시작 시점)
 * 조회 실패 시 빈 값 유지 > 대본은 기본 이름(주인공)으로 진행
 */
export function usePlayerName({ shouldRefresh = false } = {}) {
  const [characterName, setCharacterName] = useRecoilState(characterNameAtom);
  const shouldFetch = shouldRefresh || !characterName;

  useEffect(() => {
    if (!shouldFetch) return undefined;
    let isActive = true;
    const fetchCharacterName = async () => {
      try {
        const response = await axios.get("/api/my-page");
        if (isActive && response.data?.characterName) {
          setCharacterName(response.data.characterName);
        }
      } catch (error) {
        logger.error("[player name] profile fetch failed:", error);
      }
    };
    fetchCharacterName();
    return () => {
      isActive = false;
    };
    // shouldFetch는 진입 시 1회 판단 (조회 성공으로 값이 생겨도 재조회하지 않음)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setCharacterName]);

  return characterName;
}
