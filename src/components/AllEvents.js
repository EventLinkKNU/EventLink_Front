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

  const [filters, setFilters] = useState({
    startDate: "",
    closeDate: "",
    minParticipants: "",
    maxParticipants: "",
  });

  const [showDateFilterModal, setShowDateFilterModal] = useState(false);
  const [showParticipantFilterModal, setShowParticipantFilterModal] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", { withCredentials: true })
      .then((res) => {
        setUserInfo({
          name: res.data.name || "",
          email: res.data.email || "",
          gender: res.data.gender || "",
          country: res.data.country || "",
        });
      })
      .catch((err) => console.error("유저 정보 불러오기 실패", err));
  }, []);

  useEffect(() => {
    fetchAllEvents();
  }, []);

  const fetchAllEvents = () => {
    axios
      .get("http://localhost:8080/api/v1/events/get-all-events", {
        withCredentials: true,
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("이벤트 조회 실패", err));
  };

  const fetchFilteredEvents = () => {
    axios
      .get("http://localhost:8080/api/v1/events/filter", {
        params: filters,
        withCredentials: true,
      })
      .then((res) => setEvents(res.data))
      .catch((err) => console.error("필터 이벤트 조회 실패", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateFilterApply = () => {
    fetchFilteredEvents();
    setShowDateFilterModal(false);
  };

  const handleParticipantFilterApply = () => {
    fetchFilteredEvents();
    setShowParticipantFilterModal(false);
  };

  const handleViewEvent = (id) => {
    navigate(`/event-detail/${id}`);
  };

  return (
    <div style={{ padding: "20px", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h2 style={{ fontSize: "14px", marginBottom: "20px" }}>
        {userInfo.name}님이 원하는 이벤트 링크를 골라보세요.
      </h2>

      {/* 필터 및 생성 버튼 */}
    <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
      <button
        onClick={() => setShowDateFilterModal(true)}
        style={{
          padding: "12px 24px",
          border: "1px solid #ccc",
          borderRadius: "16px",
          backgroundColor: "#fff",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        날짜 필터
      </button>
      <button
        onClick={() => setShowParticipantFilterModal(true)}
        style={{
          padding: "12px 24px",
          border: "1px solid #ccc",
          borderRadius: "16px",
          backgroundColor: "#fff",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        인원 필터
      </button>
      <button
        onClick={() => navigate("/event-create")}
        style={{
          padding: "12px 24px",
          backgroundColor: "#000",
          color: "#fff",
          border: "none",
          borderRadius: "16px",
          fontWeight: "bold",
          cursor: "pointer"
        }}
      >
        등록하기
      </button>
    </div>


      {/* 날짜 필터 모달 */}
      {showDateFilterModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>날짜 필터</h2>
            <div>
            <label>시작 날짜</label>
            <input type="datetime-local" name="startDate" value={filters.startDate} onChange={handleInputChange} />
            </div>
            <div>
            <label>종료 날짜</label>
            <input type="datetime-local" name="closeDate" value={filters.closeDate} onChange={handleInputChange} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setShowDateFilterModal(false)}>취소</button>
              <button onClick={handleDateFilterApply} style={{ marginLeft: "10px" }}>적용</button>
            </div>
          </div>
        </div>
      )}

      {/* 인원수 필터 모달 */}
      {showParticipantFilterModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h2>인원수 필터</h2>
            <div>
            <label>최소 참여자 수</label>
            <input type="number" name="minParticipants" value={filters.minParticipants} onChange={handleInputChange} />
            </div>
            <div>
            <label>최대 참여자 수</label>
            <input type="number" name="maxParticipants" value={filters.maxParticipants} onChange={handleInputChange} />
            </div>
            <div style={{ marginTop: "20px" }}>
              <button onClick={() => setShowParticipantFilterModal(false)}>취소</button>
              <button onClick={handleParticipantFilterApply} style={{ marginLeft: "10px" }}>적용</button>
            </div>
          </div>
        </div>
      )}

      {/* 이벤트 리스트 */}
      {events.length === 0 ? (
        <p style={{ fontSize: "14px" }}>이벤트가 없습니다.</p>
      ) : (
        events.map((event) => (
          <div
            key={event.id}
            onClick={() => handleViewEvent(event.id)}
            style={{
              width: "66%",
              border: "1px solid #ddd",
              borderRadius: "10px",
              padding: "16px",
              marginBottom: "20px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: 0 }}>{event.title}</h3>
              <span>👥 {event.currentParticipants} / {event.maxParticipants}</span>
            </div>
            <p>📍 여행지: {event.country} ({event.city})</p>
            <p>🎒 여행 스타일: {event.styleFilter}</p>
            <p>🙋‍♂️ 성별 제한: {event.genderFilter}</p>
            <p style={{ fontSize: "12px", color: "#888", marginTop: "10px" }}>
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

// 모달 스타일
const modalOverlayStyle = {
  position: "fixed",
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 9999,
};

const modalContentStyle = {
  background: "white",
  padding: "30px",
  borderRadius: "12px",
  width: "400px",
  maxHeight: "90vh",
  overflowY: "auto",
};

export default AllEvents;
