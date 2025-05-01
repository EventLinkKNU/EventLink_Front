import React from "react";

const Footer = () => {
  const footerStyle = {
    backgroundColor: "#000",
    color: "#fff",
    padding: "30px 60px",
    display: "flex",
    flexDirection: "column", // 세로 정렬
    gap: "10px",
    fontFamily: "Noto Sans, sans-serif"
  };

  const brandStyle = {
    fontWeight: "700",
    fontSize: "18px",
    color: "#fff"
  };

  const infoStyle = {
    fontSize: "14px",
    color: "#ccc",
    lineHeight: "1.6"
  };

  return (
    <footer style={footerStyle}>
      <div style={brandStyle}>㈜ EventLink</div>
      <div style={infoStyle}>
        대표이사: 김선우, 안정빈, 차지현<br />
        사업자 등록번호: ***-**-02515<br />
        메일: bin052512@gmail.com
      </div>
    </footer>
  );
};

export default Footer;
