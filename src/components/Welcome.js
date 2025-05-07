import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Welcome = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const queryParams = new URLSearchParams(location.search);
  const userName = queryParams.get("user_nm");

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/logout",
        {},
        { withCredentials: true }
      );
      toast.success("로그아웃 되었습니다 👋");
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error("로그아웃 실패 😢");
      console.error(error);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      "정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
    );
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(
        "http://localhost:8080/api/user/delete",
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        toast.success("탈퇴되었습니다. 😢");
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error("탈퇴 실패. 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("탈퇴 실패:", error);
      toast.error("탈퇴 실패. 다시 시도해 주세요.");
    }
  };

  const goToMyPage = () => {
    navigate("/mypage");
  };
  const createEvent = () =>{
    navigate("/event-create");
  }
  const getMyEvents = () =>{
    navigate("/get-myEvents");
  }
  const getAllEvents = () =>{
    navigate("/get_allEvents");
  }
  return (
    <div>
      <h2>로그인 되신 것을 환영합니다, {userName}님!</h2>
      <p>이제 귀하의 대시보드에 액세스할 수 있습니다.</p>
      <button onClick={handleLogout}>로그아웃</button>
      <button onClick={handleDelete}>탈퇴</button>
      <button onClick={goToMyPage}>마이페이지</button>
      <button onClick={getMyEvents}>내 이벤트조회</button>
      <button onClick={getAllEvents}>모든 이벤트 조회</button>
      <button onClick={createEvent}>이벤트생성</button>
    
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
      />
    </div>
  );
};

export default Welcome;
