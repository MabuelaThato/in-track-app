'use client'
import { getLearners } from '@/actions/actions';
import React, { useEffect, useState } from 'react'

interface Submission {
    learnerid: string;
    fullname: string;
    score: string;
    percentage: string;
  }

const Stats = ({submissions, classId}:{submissions: Submission[], classId: string}) => {

    const [totalLearners, setTotalLearners] = useState<number>(0);

    useEffect(() => {
      async function fetchLearners() {
        const learners = await getLearners(classId);
        setTotalLearners(learners ? learners.length : 0);
      }
      fetchLearners();
    }, [classId]);

    const totalScores = submissions.reduce((sum, submission) => sum + parseFloat(submission.percentage), 0);
    const classAverage = Math.round(totalScores / submissions.length);
  
    const sortedSubmissions = submissions.sort((a, b) => parseFloat(b.score) - parseFloat(a.score));
    const top3Learners = sortedSubmissions.slice(0, 3);
    const bottom3Learners = sortedSubmissions.slice(-3);
  
    const numberOfSubmissions = submissions.length;
    const numberOfLearners = new Set(submissions.map(submission => submission.learnerid)).size;

  return (
    <div className='mb-8'>
      <h2 className='text-lg md:text-xl lg:text-2xl font-medium mb-2 lg:mb-4'>Statistics</h2>
      <div className='flex flex-wrap gap-4'>
        <div className='flex flex-col gap-4 w-3/12 '>
            <div className='bg-white border border-gray-200 rounded-md shadow w-full p-6 flex flex-col gap-6'>
                <p className='text-gray-500 font-medium'>Class Average:</p>
                <span className='text-xl font-medium'>{classAverage} %</span>
            </div>

            <div className='bg-white border border-gray-200 rounded-md shadow w-full p-6 flex flex-col gap-6'>
                <p className='text-gray-500 font-medium'>Learners Did Assessment:</p>
                <span className='text-xl font-medium'>{numberOfSubmissions} / {totalLearners} learners</span>
            </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-md shadow w-3/12 p-8 flex flex-col'>
            <div className='grow-0 lg:grow'>
                <h2 className='mb-4 text-gray-500 font-medium'>Top 3 Learners:</h2>
                <div className='flex flex-col gap-4'>
                    {top3Learners.map((learner, index) => (
                        <div className='flex gap-2 items-center'>
                            <p className={`rounded-full w-6 h-6 ${index % 2 == 0 ? 'bg-[#A5BE00]' : 'bg-[#064789]'} text-white align-middle flex justify-center items-center`}>
                                <span>{index + 1}</span>
                            </p>
                            <span key={learner.learnerid}>{learner.fullname} - {learner.percentage} %</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        <div className='bg-white border border-gray-200 rounded-md shadow w-3/12  p-8 flex flex-col'>
        <div className='grow-0 lg:grow'>
            <h2 className='mb-4 text-gray-500 font-medium'>Bottom 3 Learners</h2>
            <div className='flex flex-col gap-4'>
                {bottom3Learners.map((learner, index) => (
                   <div className='flex gap-2 items-center'>
                     <p className={`rounded-full w-6 h-6 ${index % 2 == 0 ? 'bg-[#A5BE00]' : 'bg-[#064789]'} text-white align-middle flex justify-center items-center`}>
                        <span>{index + 1}</span>
                    </p>
                    <span key={learner.learnerid}>{learner.fullname} - {learner.percentage} %</span>
                   </div>
                ))}
            </div>
            </div>
        </div>
        
      </div>
    </div>
  )
}

export default Stats
