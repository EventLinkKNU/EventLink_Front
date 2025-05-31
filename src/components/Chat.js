import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/v1/events/get-current-user", {
        withCredentials: true,
      })
      .then((res) => {
        const user = res.data;
        setCurrentUser(user);

        return axios.post(
          `http://localhost:8080/api/v1/chats/${user.id}`,
          null,
          { withCredentials: true }
        ).then((res) => {
          const rooms = res.data.map((room) => {
            const isSender = room.sendID.id === user.id;
            const opponent = isSender ? room.receiveID : room.sendID;

            return {
              chatId: room.chatId,
              message: room.message,
              receiverId: opponent.id,
              receiverName: opponent.name,
            };
          });

          setChatRooms(rooms);
        });
      })
      .catch((err) => {
        console.error("채팅방 목록 조회 실패", err);
      });
  }, []);

  const handleEnterChatRoom = (chatId, receiverId) => {
    if (!currentUser) {
      console.error("현재 사용자 정보 없음!");
      return;
    }

    const senderId = currentUser.id;
    console.log("✅ 이동할 URL:", `/chatroom/${chatId}/${senderId}/${receiverId}`);

    // ✅ 수정: URL 에 receiverId 까지 넣기!
    navigate(`/chatroom/${chatId}/${senderId}/${receiverId}`);
  };

  return (
    <div className="flex w-full h-full">
      <div className="w-[300px] bg-white p-6 border-r">
        <h2 className="text-xl font-bold mb-4">채팅</h2>
        <ul className="p-0 m-0">
          {chatRooms.map((room) => (
            <li
              key={room.chatId}
              onClick={() => handleEnterChatRoom(room.chatId, room.receiverId)} // ✅ 요거 유지
              className="cursor-pointer list-none border-b border-gray-200 pb-3"
              style={{
                listStyleType: "none",
                paddingLeft: 0,
                marginLeft: 0,
                display: "block"
              }}
            >
              <div className="text-base font-semibold leading-[1.3] m-0 p-0">
                {room.receiverName || "알 수 없음"}
              </div>
              <div className="text-sm text-gray-600 leading-[1.6] m-0 p-0">
                {room.message || "메시지가 없습니다."}
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex-1 bg-[#f5f5f5] p-6">
        {/* 선택된 채팅방 내용 자리 */}
      </div>
    </div>
  );
};

export default Chat;
