import React, { useEffect, useRef, useState } from "react";

const ChatRoom = ({ chatId, senderId, receiverId, roomId, receiverName }) => {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const rawAuthorization = localStorage.getItem("Authorization");
    const token = rawAuthorization ? rawAuthorization.replace("Bearer ", "") : undefined;

    if (!token) {
      console.error("❌ Authorization 없음 (WebSocket 연결 안 함)");
      return;
    }

    // 기존 채팅 메시지 불러오기
    fetch(`http://localhost:8080/api/v1/chats/room/${roomId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => {
        const formattedMessages = data.map(chat => ({
          roomId: chat.roomId,
          chatId: chat.chatId,
          senderId: chat.sendID.id,
          senderName: chat.sendID.name,
          receiverId: chat.receiveID.id,
          content: chat.message,
          createdAt: chat.createdAt
        }));
        setMessages(formattedMessages);
      })
      .catch(err => {
        console.error("❌ 기존 메시지 불러오기 실패", err);
      });

    // WebSocket 연결
    socketRef.current = new WebSocket(`ws://localhost:8080/ws/chat?token=${token}`);

    socketRef.current.onopen = () => {
      setIsConnected(true);

      const enterMessage = {
        messageType: "ENTER",
        chatId: parseInt(chatId),
        sendId: parseInt(senderId),
        receiveId: parseInt(receiverId),
        roomId: parseInt(roomId),
        message: "",
        createdAt: new Date().toISOString()
      };
      socketRef.current.send(JSON.stringify(enterMessage));
    };

    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      const formatted = {
        chatId: message.chatId || Date.now(),
        senderId: message.sendId,
        senderName: message.sendName || "",
        receiverId: message.receiveId,
        content: message.message,
        createdAt: message.createdAt
      };
      setMessages((prev) => [...prev, formatted]);
    };

    socketRef.current.onclose = () => {
      setIsConnected(false);
    };

    socketRef.current.onerror = (error) => {
      console.error("WebSocket 에러:", error);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [chatId, senderId, receiverId, roomId]);

  const sendMessage = () => {
    if (!input.trim()) return;

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const messageObj = {
        messageType: "TALK",
        chatId: parseInt(chatId),
        sendId: parseInt(senderId),
        receiveId: parseInt(receiverId),
        roomId: parseInt(roomId),
        message: input,
        createdAt: new Date().toISOString()
      };
      socketRef.current.send(JSON.stringify(messageObj));

      const formatted = {
        chatId: messageObj.chatId,
        senderId: messageObj.sendId,
        senderName: messageObj.sendId === parseInt(senderId) ? "나" : receiverName,
        receiverId: messageObj.receiveId,
        content: messageObj.message,
        createdAt: messageObj.createdAt
      };
      setMessages((prev) => [...prev, formatted]);

      setInput("");
    } else {
      console.warn("⚠️ WebSocket이 아직 연결되지 않았습니다.");
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* 채팅방 헤더 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-3 bg-gray-100">
  {messages.map((msg, idx) => (
    <div
    key={idx}
    className="flex flex-row items-center justify-between px-4 py-2 border-b border-gray-200"
  >
    {/* 이름 */}
    <div className="w-[100px] font-semibold text-gray-800">
      {msg.senderId === parseInt(senderId) ? "나" : msg.senderName}
    </div>
  
    {/* 내용 */}
    <div className="flex-1 px-4 text-gray-900 break-words">
      {msg.content}
    </div>
  
    {/* 시간 */}
    <div className="w-[80px] text-xs text-gray-500 text-right">
      {new Date(msg.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </div>
  </div>
  

  ))}
</div>





      {/* 입력창 */}
      <div className="flex items-center p-4 bg-white border-t space-x-3">
        <button className="text-2xl cursor-pointer">😊</button>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="메시지를 입력하세요"
          className="flex-1 border rounded px-4 py-2"
        />
        <button
          onClick={sendMessage}
          className={`p-2 rounded w-24 ${
            isConnected ? "bg-blue-500 text-white" : "bg-gray-400 text-white"
          }`}
          disabled={!isConnected}
        >
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;
