import React from "react";

import {
  MbtiButton,
  MbtiButtonGroup,
  MbtiCompactContainer,
  MbtiLabel,
  MbtiResult,
  MbtiRow,
  MbtiTitle,
} from "../Home.styled";

/**
 * MBTI 4개 축. 원래는 같은 마크업이 4번 복사돼 있어 92줄이었다.
 * 축이 늘거나 라벨이 바뀌면 이 배열만 고치면 된다.
 */
const MBTI_AXES = [
  {
    key: "e",
    label: "에너지",
    options: [
      ["E", "E 외향"],
      ["I", "I 내향"],
    ],
  },
  {
    key: "s",
    label: "인식",
    options: [
      ["S", "S 감각"],
      ["N", "N 직관"],
    ],
  },
  {
    key: "t",
    label: "판단",
    options: [
      ["T", "T 사고"],
      ["F", "F 감정"],
    ],
  },
  {
    key: "j",
    label: "생활",
    options: [
      ["J", "J 계획"],
      ["P", "P 자율"],
    ],
  },
];

/**
 * MBTI 선택 UI.
 *
 * @param {Object} value 축별 선택값 `{ e, s, t, j }`
 * @param {Function} onChange `(axisKey, selected) => void`
 * @param {string} [result] 완성된 MBTI 문자열. 있으면 하단에 표시
 */
function MbtiSelect({ value, onChange, result }) {
  return (
    <MbtiCompactContainer>
      <MbtiTitle>성격 유형 (MBTI)</MbtiTitle>

      {MBTI_AXES.map((axis) => (
        <MbtiRow key={axis.key}>
          <MbtiLabel>{axis.label}</MbtiLabel>
          <MbtiButtonGroup>
            {axis.options.map(([code, text]) => (
              <MbtiButton
                key={code}
                type="button"
                selected={value[axis.key] === code}
                onClick={() => onChange(axis.key, code)}
              >
                {text}
              </MbtiButton>
            ))}
          </MbtiButtonGroup>
        </MbtiRow>
      ))}

      {result && (
        <MbtiResult>
          <span>{result}</span>
        </MbtiResult>
      )}
    </MbtiCompactContainer>
  );
}

export default MbtiSelect;
