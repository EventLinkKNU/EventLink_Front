import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import axios from "axios";
import "./style.css";

const Main = () => {
  const navigate = useNavigate();

  const [allEvents, setAllEvents] = useState([]);
  const [newEvents, setNewEvents] = useState([]);
  const [koreaEvents, setKoreaEvents] = useState([]);
  const [foreignEvents, setForeignEvents] = useState([]);

  const bannerImages = [
    "/images/banner1.jpeg",
    "/images/banner2.png",
    "/images/banner3.jpeg",
  ];

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    arrows: false,
  };

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/get-all-events", { withCredentials: true }) // CORS cookie 필요 시 withCredentials
      .then((res) => {
        const data = res.data.result || res.data || [];

        setAllEvents(data);

        // 최신순 정렬 (createdAt 내림차순)
        const sorted = [...data]
          .filter((e) => e.createdAt)
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

        setNewEvents(sorted.slice(0, 2));

        setKoreaEvents(data.filter((e) => e.country === "South Korea"));
        setForeignEvents(data.filter((e) => e.country && e.country !== "South Korea"));
      })
      .catch((err) => {
        console.error("이벤트 전체 조회 실패", err);
      });
  }, []);

  const renderEventList = (events) => {
    return (
      <div className="event-grid">
        {events.slice(0, 5).map((event) => (
          <div
            key={event.id} // 고유 id 키 사용 (중복 방지)
            className="event-card"
            onClick={() => navigate(`/event-detail/${event.id}`)}
            style={{ cursor: "pointer" }}
          >
            <h4>{event.title}</h4>
            <p>{event.country}</p>
            <p>
              {event.startDate?.slice(0, 10)} ~ {event.closeDate?.slice(0, 10)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  // OAuth 로그인 페이지로 리다이렉트 (axios 호출 금지)
  const handleGoogleLogin = () => {
    window.location.href =
      "https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=882731622107-8jr0m9a3pp223rjup5n0vpgnldsqs1s6.apps.googleusercontent.com&scope=profile%20email&redirect_uri=http://localhost:8080/login/oauth2/code/google&prompt=consent%20select_account";
  };

  return (
    <div className="screen" data-model-id="2:7">
      <div className="div">
        {/* 배너 슬라이더 */}
        <Slider {...sliderSettings} className="banner-slider">
          {bannerImages.map((src, index) => (
            <div key={index}>
              <img src={src} alt={`Banner ${index + 1}`} className="banner-image" />
            </div>
          ))}
        </Slider>

       {/* 전체 이벤트 보기 버튼 */}
        <div className="view-all-button-container">
          <button onClick={() => navigate("/get_allEvents")} className="view-all-button">
            전체 이벤트 보기 →
          </button>
        </div>


        {/* NEW 이벤트 */}
        <div className="group-2">
          <div className="text-wrapper">NEW</div>
          {renderEventList(newEvents)}
        </div>

        {/* 국내 핫 이벤트 */}
        <div className="group-3">
          <div className="text-wrapper">국내 핫 이벤트</div>
          {renderEventList(koreaEvents)}
        </div>

        {/* 해외 핫 이벤트 */}
        <div className="group-4">
          <div className="text-wrapper">해외 핫 이벤트</div>
          {renderEventList(foreignEvents)}
        </div>

      </div>
    </div>
  );
};

export default Main;
