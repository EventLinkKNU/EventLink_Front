import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
  });
  // 사용자 정보 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", { withCredentials: true }) // 사용자 정보 가져오는 API 호출
      .then((res) => {
        setUserInfo({
          name: res.data.name || "", // 이름이 없다면 빈 문자열로 초기화
          email: res.data.email || "", // 이메일이 없다면 빈 문자열로 초기화
          gender: res.data.gender || "", // 성별이 없다면 빈 문자열로 초기화
          country: res.data.country || "", // 국가가 없다면 빈 문자열로 초기화
        });
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패", err);
      });
  }, []);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/get-all-events", {
        withCredentials: true,
      })
      .then((res) => {
        setEvents(res.data);
      })
      .catch((err) => {
        console.error("이벤트 조회 실패", err);
      });
  }, []);

  const handleViewEvent = (id) => {
    navigate(`/event-detail/${id}`);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontSize: "14px", marginBottom: "20px" }}>{userInfo.name}님이 원하는 이벤트 링크를 골라보세요.</h2>
      {events.length === 0 ? (
        <p style={{ fontSize: "14px" }}>이벤트가 없습니다.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleViewEvent(event.id)}
            style={{
              width: "66%", // 2/3 너비
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "8px",
              }}
            >
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>{event.title}</h3>
              <span style={{ color: "#333" }}>
                👥 {event.currentParticipants} / {event.maxParticipants}
              </span>
            </div>

            <p style={{ marginBottom: "3px", color: "#333" }}>
              📍 여행지: {event.country} ({event.city})
            </p>
            <p style={{ marginBottom: "3px", color: "#333" }}>
              🎒 여행 스타일: {event.styleFilter}
            </p>
            <p style={{ marginBottom: "3px", color: "#333" }}>
              🙋‍♂️ 성별 제한: {event.genderFilter}
            </p>

            <p style={{ fontSize: "12px", color: "#888", marginTop: "10px", marginBottom: "2px" }}>
              {event.creatorName} / {event.creatorGender} / {event.creatorCountry}
            </p>
            <p style={{ fontSize: "12px", color: "#555" }}>
              📅 {event.startDate} ~ {event.closeDate}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default AllEvents;
