// MBTI 4개 축 키: e(에너지) s(인식) t(판단) j(생활)
export const MBTI_AXIS_KEYS = ["e", "s", "t", "j"];

export const EMPTY_MBTI_AXES = { e: "", s: "", t: "", j: "" };

/**
 * 축별 선택값 > MBTI 문자열 (예: { e: "E", s: "N", t: "F", j: "P" } > "ENFP")
 * @param {{e: string, s: string, t: string, j: string}} mbtiAxes
 * @returns {string} 4축을 모두 고르지 않았으면 빈 문자열
 */
export const combineMbti = (mbtiAxes) => {
  const hasAllAxes = MBTI_AXIS_KEYS.every((axisKey) => Boolean(mbtiAxes?.[axisKey]));
  return hasAllAxes ? MBTI_AXIS_KEYS.map((axisKey) => mbtiAxes[axisKey]).join("") : "";
};
