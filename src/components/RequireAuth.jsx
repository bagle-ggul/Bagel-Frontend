import React from "react";
import { Navigate } from "react-router-dom";

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem("accessToken");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  // 토큰 유효성 검사는 선택 사항으로 추가 가능
  // 예: 토큰 만료 확인 및 refresh token 사용 등

  return children;
};

export default RequireAuth;
