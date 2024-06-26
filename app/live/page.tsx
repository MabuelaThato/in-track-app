import React from 'react'
import { getUser } from '@/actions/actions';
import { redirect } from 'next/navigation';
import AdminHome from '@/components/live/adminHome';
import LearnerHome from '@/components/live/learnerHome';


const Live = async () => {
  const user = await getUser();
  if (!user) redirect("/");
  const userRole = user?.role;

  return (
    <div className='min-h-screen p-4 md:p-6 lg:p-12'>
        {
          userRole === "admin" ? (
           <div>
            <AdminHome />
           </div>
          ) : (
            <LearnerHome />
          )
        }
    </div>
  )
}

export default Live