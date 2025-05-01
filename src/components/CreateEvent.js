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
    categoryId: "",
  });

  const [contentReviewStatus, setContentReviewStatus] = useState(null); // '통과', '비통과', 또는 null
  const [isReviewChecked, setIsReviewChecked] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // 내용이 바뀌면 검열 상태 초기화
    if (name === "content") {
      setContentReviewStatus(null);
      setIsReviewChecked(false);
    }
  };

  const handleContentReview = () => {
    axios
      .post(
        "http://localhost:8080/gpt/review",
        { content: formData.content },
        {
          withCredentials: true, // ✅ 쿠키 기반 인증 위해 추가
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        const result = res.data.status; // ✅ 서버 응답에 맞게 'status' 사용
        setContentReviewStatus(result);
        setIsReviewChecked(true);
        alert(`검열 결과: ${result}`);
      })
      .catch((err) => {
        console.error("검열 요청 실패", err);
        setContentReviewStatus("비통과");
        setIsReviewChecked(true);
        alert("검열에 실패했습니다.");
      });
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!isReviewChecked) {
      alert("내용 검열을 먼저 진행해주세요.");
      return;
    }

    if (contentReviewStatus !== "통과") {
      alert("내용 검열을 통과하지 못했습니다.");
      return;
    }

    axios
      .post("http://localhost:8080/api/v1/events/create", formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(() => {
        alert("이벤트가 성공적으로 생성되었습니다!");
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
          <button type="button" onClick={handleContentReview}>
            검열하기
          </button>
          {isReviewChecked && (
            <span style={{ marginLeft: "10px", color: contentReviewStatus === "통과" ? "green" : "red" }}>
              {contentReviewStatus}
            </span>
          )}
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
};

export default CreateEvent;

