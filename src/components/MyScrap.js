import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MyScrap.css";

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

  // ✅ useEffect 바깥으로 이동
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

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (scrapId) => {
    console.log("삭제 요청 ID:", scrapId);
    if (!scrapId) {
      alert("삭제할 ID가 없습니다.");
      return;
    }

    if (window.confirm("정말 이 스크랩을 삭제하시겠습니까?")) {
      try {
        await axios.delete(`http://localhost:8080/api/scraps/deleteScrap/${scrapId}`, {
          withCredentials: true,
        });
        alert("삭제 완료");

        fetchData();
      } catch (err) {
        console.error("스크랩 삭제 실패:", err);
        alert("삭제 중 오류 발생");
      }
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="myscrap-container">
      <h2 className="myscrap-title">내 스크랩</h2>
      <table className="myscrap-table">
        <thead>
          <tr>
            <th>제목</th>
            <th>카테고리</th>
            <th>날짜</th>
            <th>D-Day</th>
            <th>삭제</th>
          </tr>
        </thead>
        <tbody>
          {scrapData.length === 0 ? (
            <tr>
              <td colSpan="5" className="myscrap-no-data">스크랩이 없습니다.</td>
            </tr>
          ) : (
            scrapData.map((scrap) => (
              <tr key={scrap.scrapId}>
                <td>{scrap.eventTitle || "이벤트 없음"}</td>
                <td>{scrap.categoryName || scrap.eventCreatorName || "정보 없음"}</td>
               <td>
                {scrap.eventStartDate && scrap.eventCloseDate
                  ? `${new Date(scrap.eventStartDate).toLocaleDateString()} ~ ${new Date(scrap.eventCloseDate).toLocaleDateString()}`
                  : "정보 없음"}
               </td>

                <td>{scrap.eventStartDate ? calculateDday(scrap.eventStartDate) : "정보 없음"}</td>
                <td>
                  <button onClick={() => handleDelete(scrap.scrapId)}>삭제</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MyScrap;
