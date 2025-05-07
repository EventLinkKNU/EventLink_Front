import React, { useEffect, useState } from "react";
import axios from "axios";

const MyCreatedEvents = () => {
  const [events, setEvents] = useState([]);
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
          
          setEvents((prevEvents) => prevEvents.filter((e) => e.id !== eventId));
        })
        .catch((err) => {
          console.error("이벤트 삭제 실패", err);
        });
    }
  };

  return (
    <div>
      <h2>내가 만든 이벤트</h2>
      {events.length === 0 ? (
        <p>이벤트가 없습니다.</p>
      ) : (
        events.map((event) => (
          <div key={event.id} style={{ border: "1px solid #ccc", padding: "10px", marginBottom: "10px" }}>
            <h3>{event.title}</h3>
            <p>작성자: {event.creatorName}</p>
            <p>카테고리 : {event.categoryName}</p>
            <p>내용 : {event.content}</p>
            <p>인원: {event.minParticipants} ~ {event.maxParticipants}</p>
            <p>시작: {event.startDate}</p>
            <p>마감: {event.closeDate}</p>
            <button onClick={() => handleDelete(event.id)}>삭제</button>
          </div>
        ))
      )}
    </div>
  );
};

export default MyCreatedEvents;
