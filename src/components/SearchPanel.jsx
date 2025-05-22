import React from "react";

// 오늘 날짜 문자열 구하기
const getTodayString = () => {
  const today = new Date();
  return `${today.getFullYear()}.${String(today.getMonth() + 1).padStart(2, "0")}.${String(today.getDate()).padStart(2, "0")}`;
};

const panelStyle = {
  position: "absolute",
  top: "40px",
  left: "110px",
  width: "90%",
  background: "#fff",
  boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
  borderRadius: "8px",
  padding: "20px",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const sectionContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
};

const sectionStyle = {
  width: "48%",
};

const itemStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "8px",
  cursor: "pointer",
};


const SearchPanel = ({ recent, popular, onClickItem, onDelete, onClose }) => {
  return (
    <div style={panelStyle}>
      {/* 날짜 오른쪽 상단 표시 */}
      <div style={{ textAlign: "right", fontSize: "12px", color: "#888" }}>
        {getTodayString()} 기준
      </div>

      {/* 최근/인기 검색어 섹션 */}
      <div style={sectionContainerStyle}>
        <div style={sectionStyle}>
          <h4>최근 검색어</h4>
          <hr />
          {recent.map((item, idx) => (
            <div key={idx} style={itemStyle}>
              <span onClick={() => onClickItem(item)}>{item}</span>
              <button
                onClick={() => onDelete(item)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "#999",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                x
              </button>
            </div>
          ))}
        </div>

        <div style={sectionStyle}>
          <h4>인기 검색어</h4>
          <hr />
          {popular.map((item, idx) => (
          <div key={idx} style={{ marginBottom: "6px" }}>
          {idx + 1}. <span onClick={() => onClickItem(item)}>{item}</span>
          </div>
          ))}

        </div>
      </div>

      {/* 닫기 버튼 오른쪽 하단 */}
      <div style={{ textAlign: "right", marginTop: "10px" }}>
        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
};

export default SearchPanel;
