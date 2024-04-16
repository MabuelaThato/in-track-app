"use client"
import React from 'react'
import { Button } from './ui/button'
import { LuLogOut } from 'react-icons/lu'
import { logOut } from '@/actions/actions'

const SignOut = () => {
  return (
    <div>
            <Button
            onClick={async () => logOut()}
            className='rounded-full bg-[#A5BE00] hover:border hover:border-[#A5BE00] hover:bg-white hover:text-[#A5BE00]'
            size="icon"
            >
                <LuLogOut size={16}/>
            </Button>
            </div>
  )
}

export default SignOut