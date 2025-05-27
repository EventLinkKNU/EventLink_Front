import React, { useEffect, useState } from "react";
import axios from "axios";
import "./MyCreatedEvents.css"; // 재사용

const MyComplaint = () => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/complaints/me", {
        withCredentials: true,
      })
      .then((res) => {
        setComplaints(res.data);
      })
      .catch((err) => {
        console.error("신고 내역 조회 실패", err);
      });
  }, []);

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    return date.toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="myscrap-container">
      <h2 className="myscrap-title">내 신고 내역</h2>
      {complaints.length === 0 ? (
        <p className="myscrap-no-data">신고한 내역이 없습니다.</p>
      ) : (
        <table className="myscrap-table">
          <thead>
            <tr>
              <th>신고 대상</th>
              <th>사유</th>
              <th>신고일시</th>
              <th>처리 상태</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((item) => (
              <tr key={item.id}>
                <td>{item.targetUsername}</td>
                <td>{item.reason}</td>
                <td>{formatDateTime(item.createdAt)}</td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default MyComplaint;
