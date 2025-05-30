import React, { useState } from "react";
import axios from "axios";
import './CreateEvent.css'; // 스타일 파일 import

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    country: "",
    city: "",
    genderFilter: "",
    styleFilter: "",
    minParticipants: 1,
    maxParticipants: 10,
    startDate: "",
    closeDate: "",
    categoryId: "",
  });

  const [contentReviewStatus, setContentReviewStatus] = useState(null);
  const [isReviewChecked, setIsReviewChecked] = useState(false);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [popupStep, setPopupStep] = useState(null);

  const [countryPage, setCountryPage] = useState(0);
  const [cityPage, setCityPage] = useState(0);
  const ITEMS_PER_PAGE = 12;

  const currentCountries = countries.slice(
    countryPage * ITEMS_PER_PAGE,
    (countryPage + 1) * ITEMS_PER_PAGE
  );

  const currentCities = cities.slice(
    cityPage * ITEMS_PER_PAGE,
    (cityPage + 1) * ITEMS_PER_PAGE
  );

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
        setPopupStep("country");
        setCountryPage(0);
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
        setPopupStep("city");
        setCityPage(0);
      })
      .catch((err) => {
        console.error("도시 목록 요청 실패", err);
      });
  };

  return (
    <div className="event-create-form">
      <h2>이벤트 만들기</h2>
      <form onSubmit={handleSubmit}>
        {/* 제목 */}
        <div className="form-group">
          <label>제목</label>
          <input type="text" name="title" value={formData.title} onChange={handleChange} required />
        </div>

        {/* 내용 */}
        <div className="form-group">
          <label>내용</label>
          <textarea name="content" value={formData.content} onChange={handleChange} required />
          <button type="button" onClick={() => {
            axios.post("http://localhost:8080/gpt/review", { content: formData.content }, {
              withCredentials: true,
              headers: { "Content-Type": "application/json" },
            })
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
          }}>
            검열하기
          </button>
          {isReviewChecked && (
            <span style={{ marginLeft: "10px", color: contentReviewStatus === "통과" ? "green" : "red" }}>
              {contentReviewStatus}
            </span>
          )}
        </div>
                {/* 시작일 */}
        <div className="form-group">
          <label>시작일</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* 종료일 */}
        <div className="form-group">
          <label>종료일</label>
          <input
            type="datetime-local"
            name="closeDate"
            value={formData.closeDate}
            onChange={handleChange}
            required
          />
        </div>


        {/* 인원수 */}
        <div className="form-group">
          <label>참여 인원 (1~10명): {formData.minParticipants}명</label>
          <div className="range-group">
            <input
              type="range"
              name="minParticipants"
              min="1"
              max="10"
              value={formData.minParticipants}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* 성별 */}
        <div className="form-group">
          <label>성별</label>
          <div className="button-group">
            <button
              type="button"
              className={`select-button ${formData.genderFilter === '' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, genderFilter: '' }))}
            >
              선택 안 함
            </button>
            <button
              type="button"
              className={`select-button ${formData.genderFilter === 'MALE' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, genderFilter: 'MALE' }))}
            >
              남성만
            </button>
            <button
              type="button"
              className={`select-button ${formData.genderFilter === 'FEMALE' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, genderFilter: 'FEMALE' }))}
            >
              여성만
            </button>
          </div>
        </div>

        {/* 여행 스타일 */}
        <div className="form-group">
          <label>여행 스타일</label>
          <div className="button-group">
            <button
              type="button"
              className={`select-button ${formData.styleFilter === '' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, styleFilter: '' }))}
            >
              선택 안 함
            </button>
            <button
              type="button"
              className={`select-button ${formData.styleFilter === 'COMMUNICATIVE' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, styleFilter: 'COMMUNICATIVE' }))}
            >
              소통
            </button>
            <button
              type="button"
              className={`select-button ${formData.styleFilter === 'QUIET' ? 'active' : ''}`}
              onClick={() => setFormData((prev) => ({ ...prev, styleFilter: 'QUIET' }))}
            >
              조용한
            </button>
          </div>
        </div>

        {/* 카테고리 */}
        <div className="form-group">
          <label>카테고리</label>
          <select
            value={formData.categoryId}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                categoryId: e.target.value,
              }))
            }
            required
          >
            <option value="">카테고리 선택</option>
            <option value="1">액티비티&스포츠</option>
            <option value="2">문화</option>
            <option value="3">여행</option>
            <option value="4">취미</option>
            <option value="5">기타</option>
          </select>
        </div>

        {/* 국가 */}
        <div className="form-group">
          <label>국가</label>
          <button type="button" onClick={fetchCountries}>국가 선택</button>
          {formData.country && <span style={{ marginLeft: "10px" }}>{formData.country}</span>}
        </div>

        {/* 도시 */}
        <div className="form-group">
          <label>도시</label>
          <button
            type="button"
            onClick={() => {
              if (formData.country) {
                fetchCities(formData.country);
              } else {
                alert("먼저 국가를 선택하세요.");
              }
            }}
          >
            도시 선택
          </button>
          {formData.city && <span style={{ marginLeft: "10px" }}>{formData.city}</span>}
        </div>

        {/* 등록하기 */}
        <button type="submit" className="submit-button">등록하기</button>
      </form>
      {/* 모달 팝업 */}
      {popupStep && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="modal-close" onClick={() => setPopupStep(null)}>❌</button>

            {popupStep === "country" && (
              <>
                <h3>국가 선택</h3>
                <div className="modal-grid">
                  {currentCountries.map((country) => (
                    <button
                      key={country}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, country, city: "" }));
                        fetchCities(country);
                      }}
                    >
                      {country}
                    </button>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {countries.length > (countryPage + 1) * ITEMS_PER_PAGE && (
                  <button
                    className="modal-page-button"
                    onClick={() => setCountryPage((prev) => prev + 1)}
                  >
                    ▶️ 다음
                  </button>
                )}
                {countryPage > 0 && (
                  <button
                    className="modal-page-button"
                    style={{ marginLeft: "10px" }}
                    onClick={() => setCountryPage((prev) => prev - 1)}
                  >
                    ◀️ 이전
                  </button>
                )}
              </>
            )}

            {popupStep === "city" && (
              <>
                <h3>도시 선택</h3>
                <div className="modal-grid">
                  {currentCities.map((city) => (
                    <button
                      key={city}
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, city }));
                        setPopupStep(null);
                        setCountryPage(0);
                        setCityPage(0);
                      }}
                    >
                      {city}
                    </button>
                  ))}
                </div>

                {/* 페이지네이션 */}
                {cities.length > (cityPage + 1) * ITEMS_PER_PAGE && (
                  <button
                    className="modal-page-button"
                    onClick={() => setCityPage((prev) => prev + 1)}
                  >
                    ▶️ 다음
                  </button>
                )}
                {cityPage > 0 && (
                  <button
                    className="modal-page-button"
                    style={{ marginLeft: "10px" }}
                    onClick={() => setCityPage((prev) => prev - 1)}
                  >
                    ◀️ 이전
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div> 
  );
};

export default CreateEvent;
