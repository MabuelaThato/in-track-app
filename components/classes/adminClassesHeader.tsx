import React from 'react'
import AddClass from './addClass'
import { getUser } from '@/actions/actions'
import Link from 'next/link';
import { PiNewspaper } from 'react-icons/pi';


const AdminClassesHeader = () => {

  async function getUserName(){
    const user = await getUser();
    const userName = user?.firstname;

    return userName;
  }

  const userName = getUserName();

  return (
    <div className='w-full'>
      <div className="flex lg:justify-between flex-col lg:flex-row gap-4 lg:gap-0 lg:mb-4">
        <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 lg:mb-6'>Here is a list of all your classes.</p>
        </div>
        
          <div className='flex flex-wrap items-center gap-2 mb-6 lg:mb-0'>
            <AddClass />
            <Link 
            href={`/resources`}
            className='bg-[#A5BE00] text-xs md:text-sm lg:text-base hover:border hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white text-white rounded-md p-1 px-2 md:px-3 flex gap-1 md:gap-2 items-center h-8'
            >
              <PiNewspaper />
              Resources
            </Link>
            <Link 
            href={`/live`}
            className='text-xs md:text-sm lg:text-base bg-gray-400 hover:border hover:border-gray-400 hover:text-gray-400 hover:bg-white rounded-md text-white p-1 px-2 md:px-3 flex gap-1 md:gap-2 items-center justify-center w-44 h-8'
            >
              <PiNewspaper />
              Communication
            </Link>
          </div>
      </div>
    </div>
  )
}

export default AdminClassesHeader;