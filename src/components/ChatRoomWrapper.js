import { useParams } from "react-router-dom";
import ChatRoom from "./ChatRoom";

const ChatRoomWrapper = () => {
  const { chatId, senderId } = useParams();
  return <ChatRoom chatId={parseInt(chatId)} senderId={parseInt(senderId)} />;
};

export default ChatRoomWrapper;