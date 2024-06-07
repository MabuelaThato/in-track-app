import React from 'react'
import { getUser } from '@/actions/actions';
import Link from 'next/link';
import { PiNewspaper } from "react-icons/pi";
import { MdOutlineLaunch } from "react-icons/md";

const LearnerClassesHeader = () => {

  async function getUserName(){
    const user = await getUser();
    const userName = user?.firstname;

    return userName;
  }

  const userName = getUserName();

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:justify-between mb-6 lg:mb-0">
        <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 lg:mb-6'>Here is a list of all your classes.</p>
        </div>
        <div className='flex items-center gap-2'>
          <Link href={`/resources`} 
          className="flex items-center justify-center gap-1 w-40 h-10 hover:text-[#064789] text-white hover:bg-white bg-[#064789] hover:text-[#064789] border rounded-md border-[#064789] md:px-2 p-1">
            <PiNewspaper />
            <span>Resources</span>
          </Link>
          <Link href={`/live`} 
          className="flex items-center gap-1 w-44 h-10 justify-center bg-[#A5BE00] hover:border hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white rounded-md px-2 py-1 text-white">
            <MdOutlineLaunch />
            <span>Communication</span>
          </Link>
        </div>
      </div>
  )
}

export default LearnerClassesHeader