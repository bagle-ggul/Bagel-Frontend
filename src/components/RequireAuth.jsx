import React from "react";
import { Navigate } from "react-router-dom";

import { isAuthenticated } from "../utils/auth";

/**
 * 인증이 필요한 라우트를 감싸는 가드.
 *
 * 토큰은 홈의 시작 모달(닉네임·MBTI)에서 발급되므로 토큰이 없으면 "/"로 보낸다.
 * replace를 쓰는 이유: 뒤로가기로 보호된 페이지에 다시 들어가지 못하게 한다.
 *
 * 토큰 존재 여부만 확인하며 만료 검증은 하지 않는다.
 * 만료된 토큰은 API 401 응답 시 axios 인터셉터가 정리한다.
 */
const RequireAuth = ({ children }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAuth;
