'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'
import { RiRobot2Fill } from 'react-icons/ri';

const GetTibbey = () => {
    const pathname = usePathname();
    
  return (
    <div>
        {
            pathname === '/tibbey' ? ('') : (
            <Link 
        href={`/tibbey`}
        className='flex gap-1 items-center text-sm md:text-base lg:text-lg'
        >
            <RiRobot2Fill />
            <span>Tibbey</span>
        </Link>
            )
        }
    </div>
  )
}

export default GetTibbey
