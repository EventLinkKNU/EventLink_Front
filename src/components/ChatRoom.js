import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom"; 

const ChatRoom = () => {
    const { chatId, senderId, receiverId } = useParams(); 
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [isConnected, setIsConnected] = useState(false);
    const socketRef = useRef(null);

    useEffect(() => {
        const rawAuthorization = localStorage.getItem("Authorization");
        const token = rawAuthorization ? rawAuthorization.replace("Bearer ", "") : undefined;

        console.log("✅ Authorization(localStorage) 값:", token);

        if (!token) {
            console.error("❌ Authorization 없음 (WebSocket 연결 안 함)");
            return;
        }

        // ✅ 기존 채팅 메시지 먼저 불러오기
    fetch(`http://localhost:8080/api/v1/chats/room/${chatId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }
    })
    .then(response => response.json())
    .then(data => {
        const formattedMessages = data.map(chat => ({
            chatId: chat.chatId,
            senderId: chat.sendID.id,
            receiverId: chat.receiveID.id,
            content: chat.message,
            createdAt: chat.createdAt
        }));
        setMessages(formattedMessages);
        console.log("✅ 기존 메시지 불러오기 성공:", formattedMessages);
    })
    .catch(err => {
        console.error("❌ 기존 메시지 불러오기 실패", err);
    });

        socketRef.current = new WebSocket(`ws://localhost:8080/ws/chat?token=${token}`);

        socketRef.current.onopen = () => {
            console.log("✅ WebSocket 연결 성공");
            setIsConnected(true);
        };

        socketRef.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            setMessages((prev) => [...prev, message]);
        };

        socketRef.current.onclose = () => {
            console.log("❌ WebSocket 연결 종료됨");
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
    }, [chatId, senderId, receiverId]);

    const sendMessage = () => {
        if (!input.trim()) return;

        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            const messageObj = {
                messageType: "TALK",
                chatId: parseInt(chatId),
                sendId: parseInt(senderId),
                receiveId: parseInt(receiverId),
                message: input,
                createdAt: new Date().toISOString(),
            };
            socketRef.current.send(JSON.stringify(messageObj));
            console.log("✅ 메시지 전송:", messageObj);
            setInput("");
        } else {
            console.warn("⚠️ WebSocket이 아직 연결되지 않았습니다.");
        }
    };

    return (
        <div className="p-6">
            <h2 className="text-xl font-bold mb-4">채팅방</h2>

            <div className="mb-4 h-[300px] overflow-y-scroll bg-gray-100 p-2 rounded">
                {messages.map((msg, idx) => (
                    <p key={idx}>
                        <b>{msg.senderId === parseInt(senderId) ? "나" : "상대"}:</b> {msg.content}
                    </p>
                ))}
            </div>

            <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="메시지를 입력하세요"
                className="border p-2 mr-2"
            />
            <button
                onClick={sendMessage}
                className={`p-2 rounded ${isConnected ? "bg-blue-500 text-white" : "bg-gray-400 text-white"}`}
                disabled={!isConnected}
            >
                전송
            </button>
        </div>
    );
};

export default ChatRoom;
