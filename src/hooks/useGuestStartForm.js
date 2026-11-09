import { useCallback, useEffect, useRef, useState } from "react";

import { setRefreshToken } from "../utils/auth";
import { fetchSuggestedNickname, startAsGuest } from "../utils/guestApi";
import { logger } from "../utils/logger";
import { combineMbti, EMPTY_MBTI_AXES } from "../utils/mbti";
import { getNicknameError } from "../utils/nickname";

const MBTI_REQUIRED_MESSAGE = "MBTI를 모두 선택해주세요.";
const START_FAILED_MESSAGE = "시작하지 못했어요. 잠시 후 다시 시도해주세요.";

/**
 * 게스트 시작 폼: 닉네임 추천, 입력 검증, 시작 요청, 토큰 저장
 * 추천 > 검증 > 요청 > 저장 순, 닉네임을 비워 보내면 서버가 자동 생성
 */
export const useGuestStartForm = ({ onStarted }) => {
  const [characterName, setCharacterName] = useState("");
  const [mbtiAxes, setMbtiAxes] = useState(EMPTY_MBTI_AXES);
  // 마운트 직후 추천 요청이 바로 시작되므로 처음부터 로딩 상태로 둔다
  const [isNicknameLoading, setIsNicknameLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 모달이 닫힌 뒤 도착한 응답으로 상태를 갱신하지 않기 위함
  const isMountedRef = useRef(true);
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadSuggestedNickname = useCallback(async () => {
    setIsNicknameLoading(true);
    try {
      const suggestedNickname = await fetchSuggestedNickname();
      if (isMountedRef.current) {
        setCharacterName(suggestedNickname);
      }
    } catch (error) {
      // 추천 실패해도 시작은 가능 (비워 두면 서버가 자동 생성)
      logger.warn("닉네임 추천 실패:", error);
    } finally {
      if (isMountedRef.current) {
        setIsNicknameLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadSuggestedNickname();
  }, [loadSuggestedNickname]);

  const selectMbtiAxis = useCallback((axisKey, selectedCode) => {
    setMbtiAxes((previousAxes) => ({ ...previousAxes, [axisKey]: selectedCode }));
  }, []);

  const changeCharacterName = useCallback((newCharacterName) => {
    setCharacterName(newCharacterName);
    setErrorMessage("");
  }, []);

  const submit = async (event) => {
    event?.preventDefault();

    // 입력 검증 (닉네임 규칙, MBTI 4축)
    const mbti = combineMbti(mbtiAxes);
    const nicknameError = getNicknameError(characterName);
    if (nicknameError) {
      setErrorMessage(nicknameError);
      return;
    }
    if (!mbti) {
      setErrorMessage(MBTI_REQUIRED_MESSAGE);
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);
    try {
      const startedGuest = await startAsGuest({ characterName, mbti });
      if (!startedGuest?.refreshToken) {
        throw new Error("시작 응답에 토큰이 없습니다.");
      }
      setRefreshToken(startedGuest.refreshToken);
      onStarted(startedGuest);
    } catch (error) {
      logger.error("게스트 시작 실패:", error);
      if (isMountedRef.current) {
        setErrorMessage(START_FAILED_MESSAGE);
      }
    } finally {
      if (isMountedRef.current) {
        setIsSubmitting(false);
      }
    }
  };

  return {
    characterName,
    changeCharacterName,
    mbtiAxes,
    mbtiResult: combineMbti(mbtiAxes),
    selectMbtiAxis,
    rerollNickname: loadSuggestedNickname,
    isNicknameLoading,
    isSubmitting,
    errorMessage,
    submit,
  };
};

export default useGuestStartForm;
