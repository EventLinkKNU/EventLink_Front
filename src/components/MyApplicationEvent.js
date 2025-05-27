// MyApplicationEvent.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./MyCreatedEvents.css"; 

const MyApplicationEvent = () => {
  const [applications, setApplications] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/applications/me", {
        withCredentials: true,
      })
      .then((res) => {
        setApplications(res.data);
      })
      .catch((err) => {
        console.error("신청한 이벤트 조회 실패", err);
      });
  }, []);

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

  const handleRowClick = (eventId) => {
    navigate(`/event-detail/${eventId}`);
  };

  return (
    <div className="myscrap-container">
      <h2 className="myscrap-title">내가 신청한 이벤트</h2>
      {applications.length === 0 ? (
        <p className="myscrap-no-data">신청한 이벤트가 없습니다.</p>
      ) : (
        <table className="myscrap-table">
          <thead>
            <tr>
              <th>이벤트 ID</th>
              <th>작성자</th>
              <th>신청 내용</th>
              <th>신청 시간</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.eventId}
                onClick={() => handleRowClick(app.eventId)}
                style={{ cursor: "pointer" }}
              >
                <td>{app.eventId}</td>
                <td>{app.username}</td>
                <td>{app.content}</td>
                <td>{formatDateTime(app.dateTime)}</td>
                <td>{app.applicationStatus}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyApplicationEvent;
