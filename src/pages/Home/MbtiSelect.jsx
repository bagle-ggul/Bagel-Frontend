import React from "react";

import {
  MbtiButton,
  MbtiButtonGroup,
  MbtiCompactContainer,
  MbtiLabel,
  MbtiResultBadge,
  MbtiRow,
  MbtiTitle,
} from "./MbtiSelect.styled";

/**
 * MBTI 4개 축. 축이 늘거나 라벨이 바뀌면 이 배열만 고치면 된다.
 * key는 utils/mbti.js의 MBTI_AXIS_KEYS와 같아야 한다.
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
 * MBTI 선택 UI: 축별 선택값 { e, s, t, j } > onChange(axisKey, selected)
 * 4축을 모두 고르면 제목 옆에 결과 배지 표시
 */
function MbtiSelect({ value, onChange, result }) {
  return (
    <MbtiCompactContainer role="group" aria-label="성격 유형 MBTI 선택">
      <MbtiTitle>
        성격 유형 (MBTI)
        {result && <MbtiResultBadge aria-live="polite">{result}</MbtiResultBadge>}
      </MbtiTitle>

      {MBTI_AXES.map((axis) => (
        <MbtiRow key={axis.key}>
          <MbtiLabel>{axis.label}</MbtiLabel>
          <MbtiButtonGroup>
            {axis.options.map(([code, text]) => (
              <MbtiButton
                key={code}
                type="button"
                $isSelected={value[axis.key] === code}
                aria-pressed={value[axis.key] === code}
                onClick={() => onChange(axis.key, code)}
              >
                {text}
              </MbtiButton>
            ))}
          </MbtiButtonGroup>
        </MbtiRow>
      ))}
    </MbtiCompactContainer>
  );
}

export default MbtiSelect;
