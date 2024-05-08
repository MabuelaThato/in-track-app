import { getUser } from '@/actions/actions';
import AdminAssessment from '@/components/assessments/adminAssessment';
import LearnerAssessment from '@/components/assessments/learnerAssessment';
import React from 'react'

const Assessment = async({ params }: { params: { classId: string, assessmentId: string } }) => {
    const { classId } = params;
    const { assessmentId } = params;
    const user = await getUser();
    const userRole = user?.role;
   
  return (
    <div className='min-h-screen w-full p-10'>
        {
          userRole === "admin" ? (
            <AdminAssessment classId={classId} assessmentId={assessmentId} />
          ) : (
            <LearnerAssessment classId={classId} assessmentId={assessmentId} />
          )
        }
    </div>
  )
}

export default Assessment