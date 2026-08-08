import React from "react";

import { GenderButton, GenderButtonGroup, GenderContainer, GenderTitle } from "../Home.styled";

const GENDERS = ["남성", "여성"];

/**
 * 성별 선택.
 *
 * @param {string} value 선택된 값
 * @param {Function} onChange `(gender) => void`
 */
function GenderSelect({ value, onChange }) {
  return (
    <GenderContainer>
      <GenderTitle>성별</GenderTitle>
      <GenderButtonGroup>
        {GENDERS.map((gender) => (
          <GenderButton
            key={gender}
            type="button"
            selected={value === gender}
            onClick={() => onChange(gender)}
          >
            {gender}
          </GenderButton>
        ))}
      </GenderButtonGroup>
    </GenderContainer>
  );
}

export default GenderSelect;
