import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchPanel from "../../components/SearchPanel";

const Header = () => {
  const [keyword, setKeyword] = useState("");
  const [recentKeywords, setRecentKeywords] = useState([]);
  const [popularKeywords] = useState(["별별춘식 팝업스토어", "코엑스 축제", "벚꽃 명소"]);
  const [showPanel, setShowPanel] = useState(false);
  const navigate = useNavigate();

  // 최근 검색어 저장
  const saveToRecent = (newKeyword) => {
    if (!newKeyword) return;
    const saved = JSON.parse(localStorage.getItem("recentKeywords")) || [];
    const updated = [newKeyword, ...saved.filter(k => k !== newKeyword)].slice(0, 5);
    localStorage.setItem("recentKeywords", JSON.stringify(updated));
    setRecentKeywords(updated);
  };

  // 컴포넌트 로딩 시 localStorage에서 불러오기
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("recentKeywords")) || [];
    setRecentKeywords(saved);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      const trimmed = keyword.trim();
      
      if (trimmed) {
        saveToRecent(trimmed); // 검색어가 있을 때만 저장
      }
  
      // 검색어가 없어도 navigate는 항상 실행
      navigate(`/search?keyword=${encodeURIComponent(trimmed)}`);
      setShowPanel(false);
    }
  };
  
  const headerStyle = {
    backgroundColor: "#000",
    height: "60px",
    padding: "10px 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
  };

  const leftStyle = {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    width: "60%",
    position: "relative",
  };

  const rightStyle = {
    display: "flex",
    gap: "15px",
    fontSize: "20px",
    cursor: "pointer",
    paddingRight: "20px",
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
      <div style={leftStyle}>
        <Link to="/main" style={titleStyle}>EventLink</Link>
        <input
          style={inputStyle}
          type="text"
          placeholder="이벤트를 검색해보세요."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onFocus={() => setShowPanel(true)}
          onKeyDown={handleKeyDown}
        />
        {showPanel && (
          <SearchPanel
            recent={recentKeywords}
            popular={popularKeywords}
            onClickItem={(item) => {
                setKeyword(item);
                saveToRecent(item); // 이건 항상 저장해도 OK
                navigate(`/search?keyword=${encodeURIComponent(item)}`);
                setShowPanel(false);
              }}
              
            onDelete={(item) => {
              const updated = recentKeywords.filter(k => k !== item);
              localStorage.setItem("recentKeywords", JSON.stringify(updated));
              setRecentKeywords(updated);
            }}
            onClose={() => setShowPanel(false)}
          />
        )}
      </div>
      <div style={rightStyle}>
      <Link to="/chat" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src="/images/chat.png" alt="Chat Icon" style={{ width: "24px", height: "24px" ,cursor:"pointer" }} />
      </Link>
      <Link to="/mypage" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src="/images/mypage.png" alt="Mypage Icon" style={{ width: "24px", height: "24px" ,cursor:"pointer" }} />
      </Link>
      <Link to="/notifications" style={{ textDecoration: 'none', color: 'inherit' }}>
        <img src="/images/notice.png" alt="Notice Icon" style={{ width: "24px", height: "24px",cursor:"pointer" }} />
      </Link>
    </div>

    </header>
  );
};

export default Header;
