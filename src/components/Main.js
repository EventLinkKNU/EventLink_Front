import React from "react";
import Slider from "react-slick";
import "./style.css";

const Main = () => {
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

        {/* 기존 콘텐츠 그대로 */}
        <div className="group">
          <div className="text-wrapper">주목할 만한 이벤트</div>
          <div className="rectangle-4" />
          <div className="rectangle-5" />
        </div>

        <div className="group-2">
          <div className="text-wrapper">NEW</div>
          <div className="rectangle-4" />
          <div className="rectangle-5" />
        </div>

        <div className="group-3">
          <div className="text-wrapper">국내 핫 이벤트</div>
          <div className="rectangle-6" />
          <div className="rectangle-7" />
          <div className="rectangle-8" />
          <div className="rectangle-9" />
          <div className="rectangle-10" />
        </div>

        <div className="group-4">
          <div className="text-wrapper">해외 핫 이벤트</div>
          <div className="rectangle-6" />
          <div className="rectangle-7" />
          <div className="rectangle-8" />
          <div className="rectangle-9" />
          <div className="rectangle-10" />
        </div>
      </div>
    </div>
  );
};

export default Main;
