import React from 'react'
import { getUser } from '@/actions/actions';

const LearnerClassesHeader = () => {

  async function getUserName(){
    const user = await getUser();
    const userName = user?.firstname;

    return userName;
  }

  const userName = getUserName();

  return (
    <div className="">
        <div>
          <div className='text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>Here is a list of all your classes.</p>
        </div>
      </div>
  )
}

export default LearnerClassesHeader