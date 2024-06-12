import { getUser } from '@/actions/actions';
import { redirect } from 'next/navigation';
import React from 'react'

const Chat = async () => {
    const user = await getUser();
    if (!user) redirect("/");
  return (
    <div>
      
    </div>
  )
}

export default Chat
