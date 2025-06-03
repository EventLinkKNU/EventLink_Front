import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css"; 

const Login = () => {
  const [userName, setUserName] = useState(null);

  // const checkLoginStatus = () => {
  //   fetch("http://localhost:8080/api/user", {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       if (!res.ok) throw new Error("User not logged in");
  //       return res.json();
  //     })
  //     .then((data) => setUserName(data.user_nm))
  //     .catch(() => {
  //       setUserName(null);
  //       toast.info("로그인 되어 있지 않습니다.");
  //     });
  // };

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Logout failed");
        setUserName(null);
        toast.success("로그아웃 되었습니다 👋");
      })
      .catch((err) => {
        console.error("Logout error:", err);
        toast.error("로그아웃 실패 😢");
      });
  };

  return (
    <div className="login-screen">
      <div className="login-box">
        <h1 className="login-title">EventLink에 오신 것을 환영합니다!</h1>
        {userName ? (
          <>
            <p className="welcome-msg">안녕하세요, <strong>{userName}</strong>님!</p>
            <button className="logout-btn" onClick={handleLogout}>
              로그아웃
            </button>
          </>
        ) : (
          <>
            <button className="google-login-btn" onClick={handleLogin}>
              <img src="/images/google.png" alt="Google" className="google-icon" />
              Google로 로그인
            </button>
            {/* <button className="status-btn" onClick={checkLoginStatus}>
              로그인 상태 확인
            </button> */}
          </>
        )}
      </div>
      <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} />
    </div>
  );
};

export default Login;