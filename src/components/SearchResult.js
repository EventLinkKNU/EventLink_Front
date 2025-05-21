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
    if (keyword) {
      axios
      .get(`http://localhost:8080/api/v1/search?keyword=${encodeURIComponent(keyword)}`, {
        withCredentials: true, 
      })        
      .then((res) => setResults(res.data))
        .catch((err) => console.error("검색 실패", err));
    }
  }, [keyword]);

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
