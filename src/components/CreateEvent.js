import React, { useState } from "react";
import axios from "axios";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    country: "",
    city: "",
    genderFilter: "",
    styleFilter: "",
    minParticipants: "",
    maxParticipants: "",
    startDate: "",
    closeDate: "",
    categoryId: "",
  });

  const [contentReviewStatus, setContentReviewStatus] = useState(null);
  const [isReviewChecked, setIsReviewChecked] = useState(false);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [showCountryPopup, setShowCountryPopup] = useState(false);
  const [showCityPopup, setShowCityPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

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
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        const result = res.data.status;
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
        headers: { "Content-Type": "application/json" },
      })
      .then(() => {
        alert("이벤트가 성공적으로 생성되었습니다!");
      })
      .catch((err) => {
        console.error("이벤트 생성 실패", err);
        alert("이벤트 생성에 실패했습니다.");
      });
  };

  const fetchCountries = () => {
    axios
      .get("http://localhost:8080/api/locations/countries", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setCountries(res.data);
        setShowCountryPopup(true);
        setShowCityPopup(false);
      })
      .catch((err) => {
        console.error("국가 목록 요청 실패", err);
      });
  };

  const fetchCities = (country) => {
    axios
      .get(`http://localhost:8080/api/locations/countries/${encodeURIComponent(country)}/cities`, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then((res) => {
        setCities(res.data);
        setShowCityPopup(true);
      })
      .catch((err) => {
        console.error("도시 목록 요청 실패", err);
      });
  };

  const handleCountrySelect = (country) => {
    setFormData((prev) => ({ ...prev, country, city: "" }));
    setShowCountryPopup(false);
    fetchCities(country);
  };

  const handleCitySelect = (city) => {
    setFormData((prev) => ({ ...prev, city }));
    setShowCityPopup(false);
  };

  return (
    <div className="event-create-form">
      <h2>이벤트 만들기</h2>
      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div>
          <label>제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        {/* 내용 + 검열 */}
        <div>
          <label>내용</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required></textarea>
          <button type="button" onClick={handleContentReview}>검열하기</button>
          {isReviewChecked && (
            <span style={{ marginLeft: "10px", color: contentReviewStatus === "통과" ? "green" : "red" }}>
              {contentReviewStatus}
            </span>
          )}
        </div>

        {/* 인원수 */}
        <div>
          <label>최소 인원</label>
          <input type="number" name="minParticipants" value={formData.minParticipants} onChange={handleChange} min="1" required />
        </div>
        <div>
          <label>최대 인원</label>
          <input type="number" name="maxParticipants" value={formData.maxParticipants} onChange={handleChange} min="1" required />
        </div>

        {/* 날짜 */}
        <div>
          <label>시작일</label>
          <input type="datetime-local" name="startDate" value={formData.startDate} onChange={handleChange} required />
        </div>
        <div>
          <label>마감일</label>
          <input type="datetime-local" name="closeDate" value={formData.closeDate} onChange={handleChange} required />
        </div>

        {/* 카테고리 */}
        <div>
          <label>카테고리 ID</label>
          <input type="number" name="categoryId" value={formData.categoryId} onChange={handleChange} required />
        </div>

        {/* 필터 */}
        <div>
          <label>성별 필터</label>
          <select name="genderFilter" value={formData.genderFilter} onChange={handleChange} required>
            <option value="">선택 안 함</option>
            <option value="MALE">남성만</option>
            <option value="FEMALE">여성만</option>
          </select>
        </div>
        <div>
          <label>여행 스타일</label>
          <select name="styleFilter" value={formData.styleFilter} onChange={handleChange} required>
            <option value="">선택 안 함</option>
            <option value="QUIET">조용한</option>
            <option value="COMMUNICATIVE">소통</option>
          </select>
        </div>

        {/* 국가 선택 */}
        <div>
          <label>국가</label>
          <div>
            <button type="button" onClick={fetchCountries}>국가 선택</button>
            {formData.country && <span style={{ marginLeft: "10px" }}>{formData.country}</span>}
          </div>
        </div>
        {showCountryPopup && (
          <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
            <strong>국가 선택</strong>
            <ul style={{ maxHeight: "200px", overflowY: "auto" }}>
              {countries.map((country) => (
                <li key={country} style={{ cursor: "pointer", margin: "5px 0" }} onClick={() => handleCountrySelect(country)}>
                  {country}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* 도시 선택 */}
        <div>
          <label>도시</label>
          <div>
            <button
              type="button"
              onClick={() => {
                if (formData.country) fetchCities(formData.country);
                else alert("먼저 국가를 선택하세요.");
              }}
            >
              도시 선택
            </button>
            {formData.city && <span style={{ marginLeft: "10px" }}>{formData.city}</span>}
          </div>
        </div>
        {showCityPopup && (
          <div style={{ border: "1px solid #ccc", padding: "10px", marginTop: "10px" }}>
            <strong>도시 선택</strong>
            <ul style={{ maxHeight: "200px", overflowY: "auto" }}>
              {cities.map((city) => (
                <li key={city} style={{ cursor: "pointer", margin: "5px 0" }} onClick={() => handleCitySelect(city)}>
                  {city}
                </li>
              ))}
            </ul>
          </div>
        )}

        <button type="submit">이벤트 생성</button>
      </form>
    </div>
  );
};

export default CreateEvent;
