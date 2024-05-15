import React from 'react'
import { FaTrashCan } from 'react-icons/fa6'
import DeleteQuestion from './deleteQuestion'

const Questions = ({questions, classId, assessmentId} : {questions:any, classId: string, assessmentId: string}) => {
  return (
    <div>
    { questions?.length === 0 ? (
     <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
      You do not have any questions for this assessment. Click add question.
      </div>
      ) : (
        <div className='bg-white p-12 border rounded-lg mt-10'>
            <h1 className='font-bold text-2xl mb-6'>Questions</h1>
            <div className='flex flex-col gap-6'>
            {questions?.map((question:any, index:any) => {
                  return (
                    <div key={index} className='w-full flex flex-col gap-4'>
                      <div className='flex items-center gap-2'>
                        <h2 className='font-semibold'>
                            Question {index + 1} 
                        </h2>
                        <span className='font-semibold'>-</span>
                        <DeleteQuestion classId={classId} assessmentId={assessmentId} questionId={question?.questionid}/>
                      </div>
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
  )
}

export default Questions