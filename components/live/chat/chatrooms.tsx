'use client'
import { db } from '@/components/provider';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const ChatRooms = ({classId, userId} : {classId: string, userId: string}) => {

    const [loading, setLoading] = useState(false);
    const [userChatrooms, setUserChatrooms] = useState<any>([])

    useEffect( () => {
        setLoading(true);

        const chatroomQuery = query(collection(db,'chatrooms'),where('classId','==',classId),where('userIds', 'array-contains', userId));
       
        const unsubscribe = onSnapshot(chatroomQuery, (querySnapshot) => {

          const chatrooms = querySnapshot.docs.map((doc) => ({
              id: doc.id,
              ...doc.data(),
          }));

          setUserChatrooms(chatrooms);
          setLoading(false);
      }, (error) => {
          console.error('Error fetching chatrooms:', error);
          setLoading(false);
      });

      return () => unsubscribe();
    },[classId])

  return (
    <div className='mt-4'>
      {
        loading ? (
          <div className='w-full flex justify-center items-center gap-2 mt-12'>
            <div className='green-loader'></div>
            <span>Loading...</span>
          </div>
        ): (
          <div className='w-full flex flex-col gap-2 lg:gap-4'>
            {
              userChatrooms.map((room: any, index: any) => {
                return (
                  <Link key={room.id} href={`/live/${classId}/chat/${room.id}`} className='bg-white border border-gray-200 p-2 px-6 lg:p-4 lg:px-12 rounded-md'>
                   <div>
                    
                        <h2 className='font-medium text-lg'>
                        {
                          userId == room.users[0].id ? (
                            <div className='flex gap-4 items-center'>
                              <p className={`rounded-full w-8 h-8 ${index % 2 == 0 ? 'bg-[#A5BE00]' : 'bg-[#064789]'} text-white align-middle flex justify-center items-center`}>
                                <span>{room.users[1].userName.charAt(0)}</span>
                              </p>
                              <div>
                              <span>{room.users[1].userName}</span>
                              <p className='text-gray-500 truncate text-base font-base'>{room.lastMessage}</p>
                            </div>
                            </div>
                          ):(
                            <div className='flex gap-4 items-center'>
                            <p className={`rounded-full w-8 h-8 ${index % 2 == 0 ? 'bg-[#A5BE00]' : 'bg-[#064789]'} text-white align-middle flex justify-center items-center`}>
                              <span>{room.users[0].userName.charAt(0)}</span>
                            </p>
                            <div>
                              <span>{room.users[0].userName}</span>
                              <p className='text-gray-500 truncate text-base font-base'>{room.lastMessage}</p>
                            </div>
                          </div>
                          )
                        }
                      </h2>
                  
                   </div>
                  </Link>
                )
              })
            }
          </div>
      )
      }
    </div>
  )
}

export default ChatRooms
