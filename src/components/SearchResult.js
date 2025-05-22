import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const SearchResult = () => {
  const [results, setResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();

  const query = new URLSearchParams(location.search);
  const keyword = decodeURIComponent(query.get("keyword"));

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const keyword = decodeURIComponent(query.get("keyword") || "");
  
    if (!keyword || keyword.trim() === "") {
      // 🔍 전체 이벤트 조회
      axios
        .get("http://localhost:8080/api/v1/events/get-all-events", {
          withCredentials: true,
        })
        .then((res) => setResults(res.data))
        .catch((err) => console.error("전체 이벤트 조회 실패", err));
    } else {
      // 🔍 검색어 있을 때만 검색 API 호출
      axios
        .get(`http://localhost:8080/api/v1/search?keyword=${encodeURIComponent(keyword)}`, {
          withCredentials: true,
        })
        .then((res) => setResults(res.data))
        .catch((err) => console.error("검색 실패", err));
    }
  }, [location.search]);
  

  return (
    <div style={{ padding: "10px" }}>
      <h2 style={{ marginBottom: "10px" }}>
        🔍 "{keyword}" 검색 결과 ({results.length}건)
      </h2>
      {results.length === 0 ? (
        <p>검색 결과가 없습니다.</p>
      ) : (
        results.map((event) => (
          <div key={event.id}
          onClick={() => navigate(`/event-detail/${event.id}`)}
           style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "12px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer"
          }}>
            <h3>{event.title}</h3>
            <p>{event.content}</p>
            <p style={{ textAlign: "right", fontSize: "14px", color: "#666" }}>
      {new Date(event.createdAt).toLocaleString('ko-KR')}
    </p>
          </div>
        ))
      )}
    </div>
  );
};

export default SearchResult;
