import { getUser } from '@/actions/actions'
import AdminSubmissions from '@/components/submissions/adminSubmissions';
import { redirect } from 'next/navigation';
import React from 'react'

const Submissions = async({ params }: { params: { classId: string, assessmentId: string } }) => {
    const { classId } = params;
    const { assessmentId } = params;
    const user = await getUser();

  if (!user) redirect("/");
    const userRole = user?.role;


  return (
    <div className='p-4 md:p-6 lg:p-12 min-h-screen '>
        {
          userRole === "admin" ? (
            <AdminSubmissions classId={classId} assessmentId={assessmentId} />
          ) : (
            <div></div>
          )
        }
    </div>
  )
}

export default Submissions