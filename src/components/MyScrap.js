import React, { useState, useEffect } from "react";
import axios from "axios";

const MyScrap = () => {
  const [scrapData, setScrapData] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

const calculateDday = (closeDate) => {
  const today = new Date();
  const target = new Date(closeDate);

  // 시간 제거 (자정 기준 비교)
  today.setHours(0, 0, 0, 0);
  target.setHours(0, 0, 0, 0);

  const diff = target - today;
  const diffDays = Math.ceil(diff / (1000 * 60 * 60 * 24));

  if (diffDays > 0) return `D-${diffDays}`;
  if (diffDays === 0) return "D-Day";
  return "마감";
};



  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 회원 정보 불러오기
        const userRes = await axios.get("http://localhost:8080/api/user/profile", {
          withCredentials: true,
        });
        const user = userRes.data.result || userRes.data;
        setUserInfo({
          name: user.name || "Unknown",
          email: user.email || "No email",
        });

        // 2. 내 스크랩 목록 불러오기 (이벤트 정보 포함)
        const scrapRes = await axios.get("http://localhost:8080/api/scraps/myscrap", {
          withCredentials: true,
        });
        const scrapList = scrapRes.data.result || scrapRes.data;

        setScrapData(scrapList);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="myscrap-container" style={{ padding: "2rem", textAlign: "center" }}>
      <h2 style={{ marginBottom: "1rem" }}>내 스크랩</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <p>회원명: {userInfo.name}</p>
        <p>이메일: {userInfo.email}</p>
      </div>

      <table style={{ margin: "0 auto", borderCollapse: "collapse", width: "80%" }}>
        <thead>
          <tr style={{ backgroundColor: "#f0f0f0" }}>
            <th style={thStyle}>제목</th>
            <th style={thStyle}>카테고리</th>
            <th style={thStyle}>날짜</th>
            <th style={thStyle}>D-Day</th>
          </tr>
        </thead>
        <tbody>
          {scrapData.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ padding: "1rem" }}>스크랩이 없습니다.</td>
            </tr>
          ) : (
            scrapData.map((scrap, idx) => (
              <tr key={idx}>
                <td style={tdStyle}>{scrap.eventTitle || "이벤트 없음"}</td>
                <td style={tdStyle}>{scrap.categoryName || scrap.eventCreatorName || "정보 없음"}</td>
                <td style={tdStyle}>
                  {scrap.eventStartDate
                    ? new Date(scrap.eventStartDate).toLocaleDateString()
                    : "정보 없음"}
                </td>
                <td style={tdStyle}>
                  {scrap.eventCloseDate ? calculateDday(scrap.eventCloseDate) : "정보 없음"}
                </td>
              </tr>
            ))
          )}
        </tbody>        

      </table>
    </div>
  );
};

// 스타일
const thStyle = {
  padding: "0.75rem",
  borderBottom: "1px solid #ccc",
};

const tdStyle = {
  padding: "0.75rem",
  textAlign: "center",
  borderBottom: "1px solid #eee",
};

export default MyScrap;
