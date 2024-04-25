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
        <div className='p-2 flex justify-between px-12 items-center'>

          <div className={concertOne.className}>
            <Link href="/dashboard" className='font-black'>
                <span className='text-[#A5BE00] text-lg'>in</span><span  className='text-xl text-[#064789]'>Track</span>
            </Link>
          </div>

          <div className='flex gap-2 items-center'>
            <div className='text-zinc-700'>{user?.firstname} {user?.lastname}</div>
            <SignOut />
          </div>

        </div>
        <Separator />
      </div>
  )
}

export default Nav
