import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./EventDetail.css"; // CSS import

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [participations, setParticipations] = useState([]);
  const [scrapMessage, setScrapMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const [applicationContent, setApplicationContent] = useState("");
  const [isScrapped, setIsScrapped] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/get-current-user", { withCredentials: true })
      .then((res) => setCurrentUser(res.data))
      .catch((err) => console.error("현재 사용자 정보 조회 실패", err));
  }, []);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/events/get-event?eventId=${id}`, { withCredentials: true })
      .then((res) => setEvent(res.data))
      .catch((err) => console.error("이벤트 상세 조회 실패", err));
  }, [id]);

  useEffect(() => {
    axios
      .get(`http://localhost:8080/api/v1/events/applications/event?eventId=${id}`, { withCredentials: true })
      .then((res) => setParticipations(res.data))
      .catch((err) => console.error("신청서 조회 실패", err));
  }, [id]);

  useEffect(() => {
  if (currentUser) {
    axios
      .get("http://localhost:8080/api/scraps/is-scrapped", {
        params: { eventId: id },
        withCredentials: true,
      })
      .then((res) => {
        setIsScrapped(res.data); 
      })
      .catch((err) => {
        console.error("스크랩 상태 조회 실패", err);
      });
  }
}, [id, currentUser]);

const handleScrap = () => {
  axios
    .post("http://localhost:8080/api/scraps", null, {
      params: { eventId: id },
      withCredentials: true,
    })
    .then((res) => {
      setScrapMessage(res.data);

      setIsScrapped((prev) => !prev);
    })
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
        "http://localhost:8080/api/v1/events/applications/event/update-status",
        null,
        {
          params: { eventId: id, status, username },
          withCredentials: true,
        }
      )
      .then(() => {
        alert(`신청서가 ${status === "APPROVED" ? "승인" : "거절"}되었습니다.`);
        window.location.reload();
      })
      .catch((err) => {
        console.error("상태 업데이트 실패", err);
        alert("상태 변경 중 오류가 발생했습니다.");
      });
  };

  const handleApply = () => {
    axios
      .post(
        "http://localhost:8080/api/v1/events/apply",
        {
          eventId: id,
          content: applicationContent,
        },
        { withCredentials: true }
      )
      .then(() => {
        alert("신청이 완료되었습니다.");
        window.location.reload();
      })
      .catch((err) => {
        console.error("신청 실패", err);
        alert("이미 신청한 이벤트입니다.");
      });
  };

  const handleChat = () => {
    if (!event?.creatorId || !currentUser) {
      alert("채팅 대상 정보 또는 사용자 정보가 없습니다.");
      return;
    }

    axios
      .post(
        `http://localhost:8080/api/v1/chats/create/${currentUser.id}`,
        { receiveId: event.creatorId },
        { withCredentials: true }
      )
      .then((res) => {
        const chatRoom = res.data;
        console.log("채팅방 생성 성공:", chatRoom);

        // ✅ receiverId까지 포함해서 navigate!
        navigate(`/chatroom/${chatRoom.chatId}/${currentUser.id}/${chatRoom.receiveId}`);
      })
      .catch((err) => {
        console.error("채팅 생성 실패", err);
        alert("채팅 생성 중 오류가 발생했습니다.");
      });
  };

  if (!event) return <p>불러오는 중...</p>;

  const isCreator = currentUser?.username === event.creatorUsername;

  return (
    <div className="event-detail-container">
      <h2 className="event-title">{event.title}</h2>

      <div className="event-header">
      <button
        onClick={handleScrap}
        className="scrap-button"
        title="스크랩 하기"
      >
        {isScrapped ? "✪" : "✩"}
      </button>

        <div className="event-meta">
          <div className="gender-filter">
            {event.genderFilter === "MALE"
              ? "남자만"
              : event.genderFilter === "FEMALE"
              ? "여자만"
              : "성별 무관"}
          </div>
          <span>모집인원 ({event.currentParticipants} / {event.maxParticipants})</span>
        </div>
      </div>

      <div className="schedule-box">
        <p className="box-title">여행 일정</p>
        <p>📅 {event.startDate} ~ {event.closeDate}</p>
        <p>📍 {event.city}, {event.country}</p>
      </div>

      {scrapMessage && <p>{scrapMessage}</p>}

      <h3 className="section-title">작성자 정보</h3>
      <div className="creator-info">
        <div className="creator-avatar">👤</div>
        <div>
          <p className="creator-name">{event.creatorName}</p>
          <p className="creator-meta">
            {event.genderFilter === "MALE" ? "남자" : event.genderFilter === "FEMALE" ? "여자" : "성별 무관"}{" "}
            <span className="style-filter">
              {event.styleFilter === "COMMUNICATIVE" ? "소통" : event.styleFilter === "QUIET" ? "조용한" : "무관"}
            </span>
          </p>
        </div>
      </div>

      {/* ✅ 채팅하기 버튼 추가 */}
      {!isCreator && event.creatorId && (
        <button
          onClick={handleChat}
          className="chat-button"
          style={{
            marginTop: "10px",
            padding: "8px 16px",
            backgroundColor: "#4CAF50",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          💬 채팅하기
        </button>
      )}

      <h3 className="section-title">상세 정보</h3>
      <p className="category-info">🗂️ 카테고리: {event.categoryName}</p>
      <p className="event-content">{event.content}</p>

      {!isCreator && (
        <div>
          <h3>📨 이벤트 신청</h3>
          <textarea
            placeholder="신청 내용을 입력하세요"
            value={applicationContent}
            onChange={(e) => setApplicationContent(e.target.value)}
            className="application-textarea"
          />
          <button onClick={handleApply} className="apply-button">신청하기</button>
        </div>
      )}

      <hr style={{ margin: "30px 0" }} />

      {isCreator && (
        <div>
          <h3>신청서 목록</h3>
          {participations.length === 0 ? (
            <p>신청서가 없습니다.</p>
          ) : (
            <ul>
              {participations
                .filter((p) => p.applicationStatus !== "REJECTED") // 거절된 신청서 제외
                .map((p, index) => (
                  <li key={index} className="participation-item">
                    <p>🧑 신청자: {p.username}</p>
                    <p>📄 신청 내용: {p.content}</p>
                    <p>
                      📌 상태:{" "}
                      {p.applicationStatus === "APPROVED"
                        ? "승인 완료"
                        : p.applicationStatus === "REJECTED"
                        ? "거절됨"
                        : "대기"}
                    </p>

                    <button
                      onClick={() => updateStatus("APPROVED", p.username)}
                      className={`approve-button ${
                        p.applicationStatus === "APPROVED" ? "disabled-button" : ""
                      }`}
                      disabled={p.applicationStatus === "APPROVED"}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => updateStatus("REJECTED", p.username)}
                      className={`reject-button ${
                        p.applicationStatus === "APPROVED" ? "disabled-button" : ""
                      }`}
                      disabled={p.applicationStatus === "APPROVED"}
                    >
                      거절
                    </button>
                  </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default EventDetail;
