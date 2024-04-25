import { getAdminAssessment } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import React from 'react'

const Assessment = async({ params }: { params: { classId: string, assessmentId: string } }) => {
    const { classId } = params;
    const { assessmentId } = params;

    const assessment = await getAdminAssessment(classId, assessmentId)
  return (
    <div className='min-h-screen w-full p-10'>
        <div className='flex justify-between'>
            <div>
                <h1 className='text-4xl font-medium'>{assessment?.title}</h1>
                <p className='text-sm text-zinc-500 mb-6 mt-2'>{assessment?.instruction}</p>
            </div>
            <div className='flex gap-4'>
                <Button>Add question</Button>
                <Button></Button>
            </div>
        </div>
    </div>
  )
}

export default Assessment