import ChatRoom from "@/components/live/chat/chatRoom";
import React from "react";

const Room = ({params}: {params: {roomId: string}}) => {
  const { roomId } = params

  return roomId ? <ChatRoom roomId={roomId} /> : null;
};

export default Room;