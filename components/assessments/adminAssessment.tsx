import { deleteAdminAssignment, getAdminAssessment, getPdfQuestion, getQuestions } from '@/actions/actions';
import React from 'react'
import AddQuestion from './addQuestion';
import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { FaPlus } from 'react-icons/fa6';
import { Label } from '../ui/label';
import { Separator } from '../ui/separator';
import AddAssignment from './addAssignment';
import Questions from './questions';
import PdfQuestions from './pdfQuestions';
import Link from 'next/link';

const AdminAssessment = async ({classId, assessmentId}: {classId: string, assessmentId: string}) => {

    const assessment = await getAdminAssessment(classId, assessmentId);
    const assignments = await getPdfQuestion(classId, assessmentId);
    const questions = await getQuestions(classId, assessmentId);
    const assignmentsLength = assignments?.rows.length;
    const questionsLength = questions?.length;
    const maxLength = 1;

  return (
    <div>
    <div className='flex flex-col gap-6 lg:gap-0 mb-6 lg:mb-0 lg:flex-row lg:justify-between'>
        <div>
            <h1 className='text-xl md:text-2xl lg:text-4xl font-medium'>{assessment?.title}</h1>
            <p className='text-xs md:text-sm text-gray-500 lg:mb-6'>{assessment?.instruction}</p>
        </div>
        <div>
            <div className='flex flex-row gap-4 mb-4 md:mb-0'>
              {
                assessment?.assessmenttype === "quiz" ? (
                <div className='w-40'>
                  <AddQuestion classId={classId} assessmentId={assessmentId} />
                </div>
                ) : (
                  <div>
                    {
                      (assignmentsLength ?? 0) >= maxLength ? (
                      ''
                      ) : (
                        <div className='w-40'>
                          <AddAssignment classId={classId} assessmentId={assessmentId} />
                        </div>
                      )
                    }
                  </div>
                )
              }
               
            </div>
            <div>
              <Link href={`/classes/${classId}/assessments/${assessmentId}/submissions`} className="p-1 px-2 rounded-md bg-[#064789] border border-[#064789] text-white hover:bg-white hover:text-[#064789] text-xm md:text-base flex justify-center w-40">
                  <div>Submissions</div>
              </Link>
            </div>
        </div>
    </div>
    <div>
      {
        assessment?.assessmenttype === "quiz" ? (
        <div>
          {
            (questionsLength ?? 0) == 0 ? (
              <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
                You do not have any questions. Click add question.
              </div>
            ):(
              <Questions questions={questions} classId={classId} assessmentId={assessmentId} />
            )
          }
        </div>
        ) : (
          <div>
            {
            (assignmentsLength ?? 0) == 0 ? (
              <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
                You do not have any assignments. Click assignment.
              </div>
            ):(
              <div className='md:mt-6 lg:mt-0'>
                <PdfQuestions assignments={assignments} classId={classId} assessmentId={assessmentId}/>
              </div>
            )
          }
          </div>
        )
      }
    </div>
</div>
  )
}

export default AdminAssessment