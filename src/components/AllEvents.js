import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ 이 줄 추가

const AllEvents = () => {
  const [events, setEvents] = useState([]);
  const navigate = useNavigate(); // ✅ navigate 사용 선언

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
    <div>
      <h2>모든 이벤트</h2>
      {events.length === 0 ? (
        <p>이벤트가 없습니다.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{event.title}</h3>
            {/* <p>작성자: {event.creatorName}</p> */}
            <p>카테고리 : {event.categoryName}</p>
            <p>나라 : {event.country}</p>
            <p>도시 : {event.city}</p>
            <p>성별 제한 : {event.genderFilter}</p>
            <p>여행 스타일 : {event.styleFilter}</p>
            {/* <p>내용 : {event.content}</p> */}
            <p>인원: {event.minParticipants} ~ {event.maxParticipants}</p>
            {/* <p>현재 참여 인원: {event.currentParticipants}</p> */}
            {/* <p>시작: {event.startDate}</p>
            <p>마감: {event.closeDate}</p> */}
            <button onClick={() => handleViewEvent(event.id)}>상세 보기</button>
          </div>
        ))
      )}
    </div>
  );
};

export default AllEvents;
