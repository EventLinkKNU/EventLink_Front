import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
    const [keyword, setKeyword] = useState(""); 
    const navigate = useNavigate();             

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          const trimmed = keyword.trim();
          navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
        }
      };
      

    const headerStyle = {
        backgroundColor: "#000",
        height: "60px",
        padding: "10px 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "fixed",  // 상단 고정
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,  // 다른 요소 위에 표시되도록 설정
    };

    const leftStyle = {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        width: "60%",
    };

    const rightStyle = {
        display: "flex",
        gap: "15px",
        fontSize: "20px",
        cursor: "pointer",
    };

    const titleStyle = {
        color: "#fff",
        margin: 0,
        textDecoration: "none",
        fontSize: "24px",
        padding: "0 20px",
    };

    const inputStyle = {
        padding: "5px",
        borderRadius: "4px",
        width: "100%",
        border: "1px solid #ccc",
    };

    return (
        <header style={headerStyle}>
            {/* <div style={leftStyle}>
                <Link to="/main" style={titleStyle}>EventLink</Link>
                <input style={inputStyle} type="text" placeholder="이벤트를 검색해보세요." />
            </div> */}
            <div style={leftStyle}>
                <Link to="/main" style={titleStyle}>EventLink</Link>
                <input
                    style={inputStyle}
                    type="text"
                    placeholder="이벤트를 검색해보세요."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div style={rightStyle}>
                <Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>💬</Link>
                <Link to="/mypage" style={{ textDecoration: 'none', color: 'inherit' }}>👤</Link>
                <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>🔔</Link>
            </div>
        </header>
    );
};

export default Header;
