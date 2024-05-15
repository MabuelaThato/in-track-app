import React from 'react'
import { getUser } from '@/actions/actions';
import SignOut from './sign-out';
import { Concert_One } from "next/font/google";
import { Separator } from './ui/separator';
import Link from 'next/link';

const concertOne = Concert_One({weight: ['400'],style: ['normal'],subsets: ['latin']});

const Nav = async () => {

    const user = await getUser();

  return (
    <div className='w-full'>
        <div className='p-2 flex justify-between px-6 md:px-8 lg:px-12 items-center'>

          <div className={concertOne.className}>
            <Link href="/classes" className='font-black'>
                <span className='text-[#A5BE00] text-sm md:text-base lg:text-lg'>in</span><span  className='text-base md:text-lg lg:text-xl text-[#064789]'>Track</span>
            </Link>
          </div>

          <div className='flex gap-1 lg:gap-2 items-center'>
            <div className='text-gray-600 font-medium lg:font-semibold text-sm md:text-base lg:text-lg'>{user?.role.toUpperCase()}</div>
            <SignOut />
          </div>

        </div>
        <Separator />
      </div>
  )
}

export default Nav
