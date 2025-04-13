import React, { createContext, useState, useContext } from "react";

// 로그인 상태 관리용 Context
const LoginContext = createContext();

export const useLogin = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
  const [user, setUser] = useState(null); // 사용자 상태

  const login = (userData) => {
    setUser(userData); // 로그인된 사용자 정보 설정
  };

  const logout = () => {
    setUser(null); // 로그아웃 처리
  };

  return (
    <LoginContext.Provider value={{ user, login, logout }}>
      {children}
    </LoginContext.Provider>
  );
};
