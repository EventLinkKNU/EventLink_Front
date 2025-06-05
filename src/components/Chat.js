
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import ChatRoom from "./ChatRoom";

// const Chat = () => {
//   const [chatRooms, setChatRooms] = useState([]);
//   const [currentUser, setCurrentUser] = useState(null);
//   const [selectedRoom, setSelectedRoom] = useState(null); // ✅ 현재 선택된 room

//   useEffect(() => {
//     axios
//       .get("http://localhost:8080/api/v1/events/get-current-user", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         const user = res.data;
//         setCurrentUser(user);

//         return axios.post(
//           `http://localhost:8080/api/v1/chats/${user.id}`,
//           null,
//           { withCredentials: true }
//         ).then((res) => {
//           const rooms = res.data.map((room) => {
//             const isSender = room.sendID.id === user.id;
//             const opponent = isSender ? room.receiveID : room.sendID;

//             return {
//               chatId: room.chatId,
//               roomId: room.roomId,
//               message: room.message,
//               receiverId: opponent.id,
//               receiverName: opponent.name,
//             };
//           });

//           const uniqueRoomsMap = new Map();
//           rooms.forEach((room) => {
//             if (!uniqueRoomsMap.has(room.roomId)) {
//               uniqueRoomsMap.set(room.roomId, room);
//             }
//           });

//           const uniqueRooms = Array.from(uniqueRoomsMap.values());
//           setChatRooms(uniqueRooms);
//         });
//       })
//       .catch((err) => {
//         console.error("채팅방 목록 조회 실패", err);
//       });
//   }, []);

//   const handleSelectRoom = (room) => {
//     setSelectedRoom(room); // ✅ 현재 선택된 room 설정
//   };

//   return (
//     <div className="flex w-full h-[calc(100vh-140px)]"> {/* 헤더/푸터 제외 */}
//       {/* 왼쪽 채팅방 리스트 */}
//       <div className="w-[300px] bg-white p-6 border-r overflow-y-auto">
//         <h2 className="text-xl font-bold mb-4">채팅</h2>
//         <ul className="p-0 m-0">
//           {chatRooms.map((room) => (
//             <li
//               key={room.roomId}
//               onClick={() => handleSelectRoom(room)}
//               className="cursor-pointer list-none border-b border-gray-200 pb-3"
//               style={{
//                 listStyleType: "none",
//                 paddingLeft: 0,
//                 marginLeft: 0,
//                 display: "block"
//               }}
//             >
//               <div className="text-base font-semibold leading-[1.3] m-0 p-0">
//                 {room.receiverName || "알 수 없음"}
//               </div>
//               <div className="text-sm text-gray-600 leading-[1.6] m-0 p-0">
//                 {room.message || "메시지가 없습니다."}
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* 오른쪽 채팅방 내용 */}
//       <div className="flex-1 bg-[#f5f5f5] p-6">
//         {selectedRoom ? (
//           <ChatRoom
//           chatId={Number(selectedRoom.chatId)}
//           senderId={Number(currentUser?.id)}
//           receiverId={Number(selectedRoom.receiverId)}
//           roomId={Number(selectedRoom.roomId)}
//           receiverName={selectedRoom.receiverName}
//         />
        
//         ) : (
//           <div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Chat;
import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatRoom from "./ChatRoom";

const Chat = () => {
  const [chatRooms, setChatRooms] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);

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
              roomId: room.roomId,
              message: room.message,
              receiverId: opponent.id,
              receiverName: opponent.name,
            };
          });

          const uniqueRoomsMap = new Map();
          rooms.forEach((room) => {
            if (!uniqueRoomsMap.has(room.roomId)) {
              uniqueRoomsMap.set(room.roomId, room);
            }
          });

          const uniqueRooms = Array.from(uniqueRoomsMap.values());
          setChatRooms(uniqueRooms);
        });
      })
      .catch((err) => {
        console.error("채팅방 목록 조회 실패", err);
      });
  }, []);

  const handleSelectRoom = (room) => {
    setSelectedRoom(room);
  };

  return (
<div className="p-4 border-b border-gray-400">
{/* 왼쪽 채팅방 리스트 */}
  <div className="bg-white p-4 border-b border-gray-300">
  <h2 className="text-xl font-bold mb-4">채팅</h2>
    <div className="flex flex-col space-y-2">
      {chatRooms.map((room) => (
        <div
          key={room.roomId}
          onClick={() => handleSelectRoom(room)}
          className={`cursor-pointer border border-gray-200 rounded p-3 ${
            selectedRoom?.roomId === room.roomId ? "bg-gray-100" : "bg-white"
          } hover:bg-gray-50`}
        >
          <div className="text-base font-semibold">
            {room.receiverName || "알 수 없음"}
          </div>
          <div className="text-sm text-gray-600 truncate">
            {room.message || "메시지가 없습니다."}
          </div>
        </div>
      ))}
    </div>
  </div>
<hr className="my-4 border-gray-400" />

  {/* 오른쪽 채팅방 */}
  <div className="flex flex-col flex-1 bg-gray-100">
    {selectedRoom ? (
      <ChatRoom
        chatId={Number(selectedRoom.chatId)}
        senderId={Number(currentUser?.id)}
        receiverId={Number(selectedRoom.receiverId)}
        roomId={Number(selectedRoom.roomId)}
        receiverName={selectedRoom.receiverName}
      />
    ) : (
      <div>
        
      </div>
    )}
  </div>
</div>


  );
  
};

export default Chat;
