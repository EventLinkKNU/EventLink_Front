import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Mypage.css"; 

const Mypage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [userInfo, setUserInfo] = useState({ name: "", email: "" });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/user/profile", {
          withCredentials: true,
        });
        const user = res.data.result || res.data;
        setUserInfo({
          name: user.name || "Unknown",
          email: user.email || "No email",
        });
      } catch (err) {
        console.error("회원 정보 가져오기 실패:", err);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:8080/logout", {}, { withCredentials: true });
      toast.success("로그아웃 되었습니다 👋");
      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      toast.error("로그아웃 실패 😢");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.");
    if (!confirmDelete) return;

    try {
      const res = await axios.delete("http://localhost:8080/api/user/delete", {
        withCredentials: true,
      });

      if (res.status === 200) {
        toast.success("탈퇴되었습니다. 😢");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        toast.error("탈퇴 실패. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("탈퇴 실패:", error);
      toast.error("탈퇴 실패. 다시 시도해 주세요.");
    }
  };

  return (
    <div className="mypage-container">
      <div className="mypage-card">
        <h2 className="mypage-title">마이페이지</h2>
        
        <div className="mypage-info">
          <p> {userInfo.name}</p>
          <p> {userInfo.email}</p>
        </div>
        
        <hr style={{ margin: "1rem 0" }} />

        <div className="mypage-buttons outlined">
          <button onClick={() => navigate("/myinfo")}>계정 관리</button>
          <button onClick={() => navigate("/get-myEvents")}>내 이벤트 관리</button>
          <button onClick={() => navigate("/get_allEvents")}>모든 이벤트 조회</button>
          <button onClick={() => navigate("/myscrap")}>스크랩</button>
          <button onClick={() => navigate("/event-create")}>이벤트 생성</button>
        </div>

        <div>
          <h3>이번달, 참여 예정 이벤트</h3>

        </div>

        <div className="mypage-buttons bottom-buttons">
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
          <button className="delete-button" onClick={handleDelete}>회원 탈퇴하기</button>
        </div>

      </div>

      <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} />
    </div>
  );
};

export default Mypage;