import React, { useState } from "react";

import { GlassInput, PasswordInputWrapper, PasswordToggleButton } from "../Home.styled";

const EyeOpenIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeClosedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

/**
 * 표시/숨김 토글이 달린 비밀번호 입력 필드.
 *
 * 로그인·회원가입 모달이 같은 마크업(아이콘 SVG 포함)을 각자 복사해 갖고 있어 하나로 모았다.
 * 표시 여부는 필드 내부 상태다 — 바깥에서 관리할 이유가 없다.
 */
function PasswordField({
  value,
  onChange,
  placeholder = "비밀번호를 입력해주세요",
  required = true,
}) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <PasswordInputWrapper>
      <GlassInput
        type={isVisible ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
      <PasswordToggleButton
        type="button"
        onClick={() => setIsVisible((prev) => !prev)}
        aria-label={isVisible ? "비밀번호 숨기기" : "비밀번호 표시"}
      >
        {isVisible ? <EyeOpenIcon /> : <EyeClosedIcon />}
      </PasswordToggleButton>
    </PasswordInputWrapper>
  );
}

export default PasswordField;
