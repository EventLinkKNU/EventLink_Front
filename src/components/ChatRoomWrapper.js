import { useParams, useLocation } from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatRoomWrapper = () => {
  const { chatId, senderId, receiverId, roomId } = useParams();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const receiverName = queryParams.get("receiverName");

  return (
    <ChatRoom
      chatId={parseInt(chatId)}
      senderId={parseInt(senderId)}
      receiverId={parseInt(receiverId)}
      roomId={parseInt(roomId)}
      receiverName={receiverName}
    />
  );
};

export default ChatRoomWrapper;
