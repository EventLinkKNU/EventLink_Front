import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [scrapMessage, setScrapMessage] = useState("");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/events/get-event?eventId=${id}`, {
        withCredentials: true,
      })
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("이벤트 상세 조회 실패", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/events/event/apply/get-my-apply?eventId=${id}`, {
        withCredentials: true,
      })
      .then((res) => setParticipations(res.data))
      .catch((err) => console.error("신청서 조회 실패", err));
  }, [id]);

  const handleScrap = () => {
    axios
      .post("http://localhost:8080/api/scraps", null, {
        params: { eventId: id },
        withCredentials: true,
      })
      .then((res) => setScrapMessage(res.data))
      .catch((err) => {
        if (err.response) {
          setScrapMessage(err.response.data);
        } else {
          setScrapMessage("스크랩 중 오류가 발생했습니다.");
        }
      });
  };

  const updateStatus = (status, username) => {
    axios
      .patch(
        "http://localhost:8080/api/v1/events/event/apply/update-status",
        null,
        {
          params: { eventId: id, status, username },
          withCredentials: true,
        }
      )
      .then(() => {
        alert(`신청서가 ${status === "APPROVED" ? "승인" : "거절"}되었습니다.`);
        window.location.reload(); // 상태 갱신을 위해 새로고침
      })
      .catch((err) => {
        console.error("상태 업데이트 실패", err);
        alert("상태 변경 중 오류가 발생했습니다.");
      });
  };

  if (!event) return <p>불러오는 중...</p>;

  return (
    <div>
      <h2>{event.title}</h2>
      <p>작성자: {event.creatorName}</p>
      <p>카테고리: {event.categoryName}</p>
      <p>나라 : {event.country}</p>
      <p>도시 : {event.city}</p>
      <p>성별 제한 : {event.genderFilter}</p>
      <p>여행 스타일 : {event.styleFilter}</p>
      <p>내용: {event.content}</p>
      <p>인원: {event.minParticipants} ~ {event.maxParticipants}</p>
      <p>현재 참여 인원: {event.currentParticipants}</p>
      <p>시작일: {event.startDate}</p>
      <p>마감일: {event.closeDate}</p>

      <button onClick={handleScrap}>⭐ 스크랩 하기</button>
      {scrapMessage && <p>{scrapMessage}</p>}

      <hr />
      <h3>신청서 목록</h3>
      {participations.length === 0 ? (
        <p>신청서가 없습니다.</p>
      ) : (
        <ul>
          {participations.map((p, index) => (
            <li key={index}>
              <p>🧑 신청자: {p.username}</p>
              <p>📄 신청 내용: {p.content}</p>
              <p>📌 상태: {p.applicationStatus}</p>
              <button onClick={() => updateStatus("APPROVED", p.username)}>승인</button>
              <button onClick={() => updateStatus("REJECTED", p.username)}>거절</button>
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default EventDetail;