import React, { useEffect, useState } from "react";
import axios from "axios";

const AllEvents = () => {
    const [events, setEvents] = useState([]);
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
              </div>
            ))
          )}
        </div>
      );



}

export default AllEvents;