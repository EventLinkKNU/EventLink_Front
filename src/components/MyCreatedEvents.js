import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ 추가
import "./MyCreatedEvents.css"; 

const MyCreatedEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // ✅ 추가

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/get-my-events", {
        withCredentials: true,
      })
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("작성자 이벤트 조회 실패", err);
      });
  }, []);

  const handleDelete = (eventId) => {
    if (window.confirm("정말 이 이벤트를 삭제하시겠습니까?")) {
      axios
        .delete(`http://localhost:8080/api/v1/events/delete-event`, {
          params: { eventId: eventId },
          withCredentials: true,
        })
        .then(() => {
          setEvents((prevEvents) =>
            prevEvents.filter((e) => e.id !== eventId)
          );
        })
        .catch((err) => {
          console.error("이벤트 삭제 실패", err);
        });
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const calculateDDay = (startDate) => {
    const today = new Date();
    const start = new Date(startDate);
    const diffTime = start.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays > 0) return `D-${diffDays}`;
    if (diffDays === 0) return "D-DAY";
    return `D+${Math.abs(diffDays)}`;
  };

  const handleRowClick = (eventId) => {
    navigate(`/event-detail/${eventId}`); 
  };

  return (
    <div className="myscrap-container">
      <h2 className="myscrap-title">내 이벤트 관리</h2>
      {events.length === 0 ? (
        <p className="myscrap-no-data">이벤트가 없습니다.</p>
      ) : (
        <table className="myscrap-table">
          <thead>
            <tr>
              <th>제목</th>
              <th>국가</th>
              <th>날짜</th>
              <th>D-DAY</th>
              <th>삭제</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr
                key={event.id}
                onClick={() => handleRowClick(event.id)}
                style={{ cursor: "pointer" }}
              >
                <td>{event.title}</td>
                <td>{event.country}</td>
                <td>
                  {formatDate(event.startDate)} ~ {formatDate(event.closeDate)}
                </td>
                <td>{calculateDDay(event.startDate)}</td>
                <td onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => handleDelete(event.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyCreatedEvents;
