import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    minParticipants: "",
    maxParticipants: "",
    startDate: "",
    closeDate: "",
    categoryId:"",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();

    axios
      .post("http://localhost:8080/api/v1/events/create", formData, {
        withCredentials: true, // ✅ JWT 쿠키 포함
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        
        alert('이벤트가 성공적으로 생성되었습니다!');
        // 필요시 navigate("/events") 등 이동 처리
      })
      .catch((err) => {
        console.error("이벤트 생성 실패", err);
        alert("이벤트 생성에 실패했습니다.");
      });
  };
  
  return (
    <div className="event-create-form">
      <h2>이벤트 만들기</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <div>
          <label>최소 인원</label>
          <input
            type="number"
            name="minParticipants"
            value={formData.minParticipants}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>최대 인원</label>
          <input
            type="number"
            name="maxParticipants"
            value={formData.maxParticipants}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <div>
          <label>시작일</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>마감일</label>
          <input
            type="datetime-local"
            name="closeDate"
            value={formData.closeDate}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>카테고리 아이디</label>
          <input
            type="number"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">이벤트 생성</button>
      </form>
    </div>
  );
}
export default CreateEvent;