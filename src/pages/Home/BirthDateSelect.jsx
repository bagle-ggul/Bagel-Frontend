import React from "react";

import { BirthDateContainer, BirthDateRow, BirthDateTitle, BirthSelect } from "../Home.styled";

/** 선택 가능한 연도 범위 (올해부터 과거 50년) */
const YEAR_RANGE = 50;

const range = (length, start = 1) => Array.from({ length }, (_, i) => i + start);

/**
 * 생년월일 선택.
 *
 * 일(day)은 월과 무관하게 31일까지 제공한다. 존재하지 않는 날짜(2월 30일 등)를
 * 고를 수 있으므로, 정확성이 필요해지면 월별 일수 계산을 추가해야 한다.
 *
 * @param {Object} value `{ year, month, day }`
 * @param {Function} onChange `(field, value) => void`
 */
function BirthDateSelect({ value, onChange }) {
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: YEAR_RANGE }, (_, i) => currentYear - i);

  return (
    <BirthDateContainer>
      <BirthDateTitle>생년월일</BirthDateTitle>
      <BirthDateRow>
        <BirthSelect value={value.year} onChange={(e) => onChange("year", e.target.value)} required>
          <option value="" disabled>
            년도
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </BirthSelect>

        <BirthSelect
          value={value.month}
          onChange={(e) => onChange("month", e.target.value)}
          required
        >
          <option value="" disabled>
            월
          </option>
          {range(12).map((month) => (
            <option key={month} value={month}>
              {month}월
            </option>
          ))}
        </BirthSelect>

        <BirthSelect value={value.day} onChange={(e) => onChange("day", e.target.value)} required>
          <option value="" disabled>
            일
          </option>
          {range(31).map((day) => (
            <option key={day} value={day}>
              {day}일
            </option>
          ))}
        </BirthSelect>
      </BirthDateRow>
    </BirthDateContainer>
  );
}

export default BirthDateSelect;
