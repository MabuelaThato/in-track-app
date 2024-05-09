import { getUser } from '@/actions/actions'
import AdminSubmissions from '@/components/submissions/adminSubmissions';
import LearnerSubmission from '@/components/submissions/learnerSubmissions';
import { redirect } from 'next/navigation';
import React from 'react'

const Submissions = async({ params }: { params: { classId: string, assessmentId: string } }) => {
    const { classId } = params;
    const { assessmentId } = params;
    const user = await getUser();

  if (!user) redirect("/");
    const userRole = user?.role;


  return (
    <div className='min-h-screen w-full p-10'>
        {
          userRole === "admin" ? (
            <AdminSubmissions classId={classId} assessmentId={assessmentId} />
          ) : (
            <LearnerSubmission classId={classId} assessmentId={assessmentId} />
          )
        }
    </div>
  )
}

export default Submissions