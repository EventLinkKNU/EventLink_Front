import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import MyPage from "./components/Mypage"; // 마이페이지 추가
import { LoginProvider } from "./contexts/LoginContext"; // LoginContext import

function App() {
  return (
    <LoginProvider>
      {" "}
      {/* LoginProvider로 앱 감싸기 */}
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/welcome" element={<Welcome />} />
            <Route path="/mypage" element={<MyPage />} />{" "}
            {/* 마이페이지 추가 */}
          </Routes>
        </div>
      </Router>
    </LoginProvider>
  );
}

export default App;
