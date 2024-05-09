
import React from 'react'
import { getUser } from '@/actions/actions';
import AdminClasses from '@/components/classes/adminClasses';
import LearnerClasses from '@/components/classes/learnerClasses';
import LearnerClassesHeader from '@/components/classes/learnerClassesHeader';
import AdminClassesHeader from '@/components/classes/adminClassesHeader';
import { redirect } from 'next/navigation';


const Classes = async () => {
  const user = await getUser();
  if (!user) redirect("/");
  const userRole = user?.role;

  return (
    <div className='min-h-screen p-12'>
        {
          userRole === "admin" ? (
           <div>
            <AdminClassesHeader />
           </div>
          ) : (
            <LearnerClassesHeader />
          )
        }

        <div>
        {
          userRole === "admin" ? (
            <AdminClasses />
          ) : (
            <LearnerClasses />
          )
        }
        </div>
    </div>
  )
}

export default Classes