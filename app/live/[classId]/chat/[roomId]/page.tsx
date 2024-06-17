import { getToken, getUser } from "@/actions/actions";
import ChatRoom from "@/components/live/chat/chatRoom";
import { redirect } from "next/navigation";
import React, { useState } from "react";

const Room = async({params}: {params: {roomId: string}}) => {
  const { roomId } = params;
  const user = await getUser();
  if (!user) redirect("/");

  const currentUser = await getToken();
  
 return ( 
  <div className="w-full h-screen flex justify-center items-center bg-[#F1F1F2]">
    <ChatRoom roomId={roomId} userId={currentUser}/>
  </div>
  )
};

export default Room;