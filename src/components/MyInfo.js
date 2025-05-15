import React, { useEffect, useState } from "react";
import axios from "axios";

const MyInfo = () => {
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    gender: "",
    country: "",
  });

  // 사용자 정보 불러오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/user/profile", { withCredentials: true }) // 사용자 정보 가져오는 API 호출
      .then((res) => {
        setUserInfo({
          name: res.data.name || "", // 이름이 없다면 빈 문자열로 초기화
          email: res.data.email || "", // 이메일이 없다면 빈 문자열로 초기화
          gender: res.data.gender || "", // 성별이 없다면 빈 문자열로 초기화
          country: res.data.country || "", // 국가가 없다면 빈 문자열로 초기화
        });
      })
      .catch((err) => {
        console.error("유저 정보 불러오기 실패", err);
      });
  }, []);

  // 사용자 정보 수정 (input 값 변경 시 상태 업데이트)
  const handleChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // 사용자 정보 수정 제출
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .put(
        "http://localhost:8080/api/user",
        {
          gender: userInfo.gender,
          country: userInfo.country,
        },
        {
          withCredentials: true, // ✅ 쿠키 보내기!
        }
      )
      .then(() => {
        alert("수정 완료!");
      })
      .catch((err) => {
        console.error("수정 실패", err);
        alert("수정 실패!");
      });
  };

  return (
    <div className="mypage-form">
      <h2>마이페이지</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>이름</label>
          <input type="text" value={userInfo.name} readOnly />
          {/* 이름은 수정할 수 없도록 readOnly 처리 */}
        </div>

        <div>
          <label>이메일</label>
          <input type="email" value={userInfo.email} readOnly />
          {/* 이메일도 수정할 수 없도록 readOnly 처리 */}
        </div>

        <div>
          <label>성별</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="boy"
              checked={userInfo.gender === "boy"} // 성별이 'boy'일 경우 체크
              onChange={handleChange} // 변경 시 handleChange 호출
            />{" "}
            남자
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="girl"
              checked={userInfo.gender === "girl"} // 성별이 'girl'일 경우 체크
              onChange={handleChange} // 변경 시 handleChange 호출
            />{" "}
            여자
          </label>
        </div>

        <div>
          <label>국가</label>
          <input
            type="text"
            name="country"
            value={userInfo.country} // 수정된 국가 값 반영
            onChange={handleChange} // 입력 시 handleChange 호출
            placeholder="예: Korea"
          />
        </div>

        <button type="submit">정보 수정</button>
      </form>
    </div>
  );
};

export default MyInfo;
