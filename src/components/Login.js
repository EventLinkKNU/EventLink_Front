import React, { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = () => {
  const [userName, setUserName] = useState(null);

  const checkLoginStatus = () => {
    fetch("http://localhost:8080/api/user", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error("User not logged in");
      })
      .then((data) => setUserName(data.user_nm))
      .catch(() => {
        setUserName(null);
        toast.info("로그인 되어 있지 않습니다.");
      });
  };

  const handleLogin = () => {
    window.location.href = "http://localhost:8080/oauth2/authorization/google";
  };

  const handleLogout = () => {
    fetch("http://localhost:8080/logout", {
      method: "POST",
      credentials: "include",
    })
      .then((response) => {
        if (response.ok) {
          setUserName(null);
          toast.success("로그아웃 되었습니다 👋");
        } else {
          toast.error("로그아웃 실패 😢");
        }
      })
      .catch((error) => {
        console.error("로그아웃 실패:", error);
        toast.error("로그아웃 실패 😢");
      });
  };

  return (
    <div>
      {userName ? (
        <div>
          <h2>{userName}님, 로그인 되어 있습니다!</h2>
          <button onClick={handleLogout}>Logout</button>
        </div>
      ) : (
        <div>
          <h2>로그인</h2>
          <button onClick={handleLogin}>Login with Google</button>
          <br />
          <button onClick={checkLoginStatus}>로그인 상태 확인</button>
        </div>
      )}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Login;
