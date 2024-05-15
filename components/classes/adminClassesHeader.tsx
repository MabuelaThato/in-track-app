import React from 'react'
import AddClass from './addClass'
import { getUser } from '@/actions/actions'


const AdminClassesHeader = () => {

  async function getUserName(){
    const user = await getUser();
    const userName = user?.firstname;

    return userName;
  }

  const userName = getUserName();

  return (
    <div className='w-full'>
      <div className="flex justify-between">
        <div>
          <div className='text:xl md:text-2xl lg:text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-xs md:text-sm text-zinc-500 mb-6'>Here is a list of all your classes.</p>
        </div>
        
          <div>
            <AddClass />
          </div>
      </div>
    </div>
  )
}

export default AdminClassesHeader;