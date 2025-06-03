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
  const [thisMonthEvents, setThisMonthEvents] = useState([]);

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

    const fetchThisMonthEvents = async () => {
      try {
        const res = await axios.get("http://localhost:8080/api/v1/events/applications/me", {
          withCredentials: true,
        });

        const events = res.data;
        const currentMonth = new Date().getMonth(); // 0 ~ 11 (5월이면 4)
        const filtered = events.filter((event) => {
          const eventDate = new Date(event.dateTime);
          return eventDate.getMonth() === currentMonth;
        });

        setThisMonthEvents(filtered.slice(0, 5));
      } catch (err) {
        console.error("이달의 참여 예정 이벤트 조회 실패:", err);
      }
    };

    fetchUserInfo();
    fetchThisMonthEvents();
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


  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mypage-container">
      <div className="mypage-card">
        <h2 className="mypage-title">마이페이지</h2>
        
        <div className="mypage-info">
          <p>{userInfo.name}</p>
          <p>{userInfo.email}</p>
        </div>

        <hr style={{ margin: "1rem 0" }} />

        <div className="mypage-buttons outlined">
          <button onClick={() => navigate("/myinfo")}>계정 관리</button>
          <button onClick={() => navigate("/get-myEvents")}>내 이벤트 관리</button>
          <button onClick={() => navigate("/myapplication")}>참여 신청 이벤트</button>
          <button onClick={() => navigate("/myscrap")}>스크랩</button>
        </div>

        <div>
          <h3>이번달, 참여 예정 이벤트</h3>
          {thisMonthEvents.length === 0 ? (
            <p style={{ color: "#999" }}>이번 달 참여 예정 이벤트가 없습니다.</p>
          ) : (
            <table className="myscrap-table">
              <thead>
                <tr>
                  <th>내용</th>
                  <th>신청일시</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {thisMonthEvents.map((event) => (
                  <tr
                    key={event.eventId}
                    onClick={() => navigate(`/event-detail/${event.eventId}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <td>{event.content}</td>
                    <td>{formatDateTime(event.dateTime)}</td>
                    <td>{event.applicationStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="mypage-buttons bottom-buttons">
          <button className="logout-button" onClick={handleLogout}>로그아웃</button>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={1500} hideProgressBar={false} />
    </div>
  );
};

export default Mypage;