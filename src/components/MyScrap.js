import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyScrap.css"; // CSS import 추가

const MyScrap = () => {
  const [scrapData, setScrapData] = useState([]);
  const [userInfo, setUserInfo] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  const calculateDday = (closeDate) => {
    const today = new Date();
    const target = new Date(closeDate);
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
        const userRes = await axios.get("http://localhost:8080/api/user/profile", {
          withCredentials: true,
        });
        const user = userRes.data.result || userRes.data;
        setUserInfo({
          name: user.name || "Unknown",
          email: user.email || "No email",
        });

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
    <div className="myscrap-container">
      <h2 className="myscrap-title">내 스크랩</h2>

      <div className="myscrap-userinfo">
        <p>회원명: {userInfo.name}</p>
        <p>이메일: {userInfo.email}</p>
      </div>

      <table className="myscrap-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>날짜</th>
            <th>D-Day</th>
          </tr>
        </thead>
        <tbody>
          {scrapData.length === 0 ? (
            <tr>
              <td colSpan="4" className="myscrap-no-data">
                스크랩이 없습니다.
              </td>
            </tr>
          ) : (
            scrapData.map((scrap, idx) => (
              <tr key={idx}>
                <td>{scrap.eventTitle || "이벤트 없음"}</td>
                <td>{scrap.categoryName || scrap.eventCreatorName || "정보 없음"}</td>
                <td>{scrap.eventStartDate ? new Date(scrap.eventStartDate).toLocaleDateString() : "정보 없음"}</td>
                <td>{scrap.eventCloseDate ? calculateDday(scrap.eventCloseDate) : "정보 없음"}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyScrap;
