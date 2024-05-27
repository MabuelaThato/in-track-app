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
    const maxLength = 1;

  return (
    <div>
    <div className='flex justify-between w-full'>
        <div>
            <h1 className='text-4xl font-medium'>{assessment?.title}</h1>
            <p className='text-sm text-zinc-500 mb-6'>{assessment?.instruction}</p>
        </div>
        <div className='flex gap-4 items-center'>
            <div>
            {
              assessment?.assessmenttype === "quiz" ? (
              <div>
                <AddQuestion classId={classId} assessmentId={assessmentId} />
              </div>
              ) : (
                <div>
                  {
                    assignmentsLength >= maxLength ? (
                    <div></div>
                    ) : (
                      <AddAssignment classId={classId} assessmentId={assessmentId} />
                    )
                  }
                </div>
              )
            }
               
            </div>
            <div>
              <Link href={`/classes/${classId}/assessments/${assessmentId}/submissions`} className="p-1 px-2 rounded-md bg-[#064789] border border-[#064789] text-white hover:bg-white hover:text-[#064789]">
                  Submissions
              </Link>
            </div>
        </div>
    </div>
    <div>
      {
        assessment?.assessmenttype === "quiz" ? (
        <div>
          <Questions questions={questions} classId={classId} assessmentId={assessmentId} />
        </div>
        ) : (
          <PdfQuestions assignments={assignments} classId={classId} assessmentId={assessmentId}/>
        )
      }
    </div>
</div>
  )
}

export default AdminAssessment