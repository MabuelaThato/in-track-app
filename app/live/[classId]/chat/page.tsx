import { getToken, getUser } from '@/actions/actions';
import AddChatRoom from '@/components/live/chat/addChatRoom';
import ChatRooms from '@/components/live/chat/chatrooms';
import { redirect } from 'next/navigation';
import React from 'react';


const Chat = async ({params}: {params: {classId: string}}) => {
    const user = await getUser();
    if (!user) redirect("/");
    const userId = await getToken();

    const { classId } = params;
  return (
    <div className='min-h-screen p-4 md:p-6 lg:p-12'>
      <div className='flex flex-col gap-6 lg:gap-0 lg:flex-row lg:justify-between'>
        <div>
          <h1 className='text-xl md:text-2xl lg:text-4xl font-medium '>Chats</h1>
          <p className='text-xs md:text-sm text-gray-500 lg:mb-6'>Here is a list of all your chats, click 'add chat' to create a new chat.</p>
        </div>
        <div>
          <AddChatRoom classId={classId}/>
        </div>
      </div>
      <ChatRooms classId={classId} userId={userId} />
      
    </div>
  )
}

export default Chat
