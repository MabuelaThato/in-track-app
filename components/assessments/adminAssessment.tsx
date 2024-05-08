import { getAdminAssessment, getQuestions } from '@/actions/actions';
import React from 'react'
import AddQuestion from './addQuestion';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FaPlus } from 'react-icons/fa6';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import AddAssignment from './addAssignment';

const AdminAssessment = async ({classId, assessmentId}: {classId: string, assessmentId: string}) => {

    const assessment = await getAdminAssessment(classId, assessmentId)
    const questions = await getQuestions(classId, assessmentId);

  return (
    <div>
    <div className='flex justify-between'>
        <div>
            <h1 className='text-4xl font-medium'>{assessment?.title}</h1>
            <p className='text-sm text-zinc-500 mb-6 mt-2'>{assessment?.instruction}</p>
        </div>
        <div className='flex gap-4 items-center'>
            <div>
              <Popover>
                <PopoverTrigger className='p-1 px-2 rounded-md bg-[#A5BE00] text-white hover:bg-white hover:text-[#A5BE00] border border-[#A5BE00] flex gap-2 items-center'>
                  <FaPlus />
                  <span>Add questions</span>
                </PopoverTrigger>
                <PopoverContent >
                  <Label className='text-base font-semibold'>Question type</Label>
                  <Separator className='my-2'/>
                  <AddQuestion classId={classId} assessmentId={assessmentId}/>
                  <AddAssignment classId={classId} assessmentId={assessmentId}/>
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <div className="p-1 px-2 rounded-md bg-[#064789] border border-[#064789] text-white hover:bg-white hover:text-[#064789]">
                  Submissions
              </div>
            </div>
        </div>
    </div>
    <div>
    { questions?.length === 0 ? (
     <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
      You do not have any questions for this assessment. Click add question.
      </div>
      ) : (
        <div className='bg-white p-12 border rounded-lg mt-10'>
            <h1 className='font-bold text-2xl mb-6'>Questions</h1>
            <div className='flex flex-col gap-6'>
            {questions?.map((question, index) => {
                  return (
                    <div key={index} className='w-64 flex flex-col gap-4'>
                        <h2 className='font-semibold'>Question {index + 1} - <span  className="bg-gray-300 hover:border hover:border-gray-300 hover:text-gray-300 hover:bg-white rounded-md px-2 py-0.5 text-white text-sm font-medium">Edit</span></h2>
                        <p>{question?.question}</p>
                        <div className='text-left'>
                            <p><span className='font-medium'>1.</span> {question?.options[0]}</p>
                            <p><span className='font-medium'>2.</span> {question?.options[1]}</p>
                            <p><span className='font-medium'>3.</span> {question?.options[2]}</p>
                            <p><span className='font-medium'>4.</span> {question?.options[3]}</p>
                        </div>
                    </div>
                  )
                }
              )}
            </div>
      </div>
    )}
    </div>
</div>
  )
}

export default AdminAssessment