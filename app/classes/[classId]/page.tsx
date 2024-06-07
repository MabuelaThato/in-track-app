
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { getClass, getLearners, getUser } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import AddLearner from '@/components/learners/addLearner';
import { IoSettingsSharp } from "react-icons/io5";
import RegisterLearner from '@/components/learners/registerLearner';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { redirect } from 'next/navigation';
import DeleteLearner from '@/components/learners/deleteLearner';


const Learners = async ({ params }: { params: { classId: string } }) => {

  const user = await getUser()
  if (!user) redirect("/");

  const { classId } = params;

  const learners = await getLearners(classId);

  learners?.sort((a: any, b: any) => {
    if (a.surname < b.surname) return -1;
    if (a.surname > b.surname) return 1;
    return 0;
  });

  const currentClass = await getClass(classId);
  const division = currentClass?.division;
  const subject = currentClass?.subject;

  return (
    <div className="p-4 md:p-6 lg:p-12 min-h-screen ">
        <div className="flex flex-col gap-6 lg:gap-0 mb-6 lg:mb-0 lg:flex-row md:justify-between">
          <div className='flex flex-col md:gap-1'>
            <div className='text:xl md:text-2xl lg:text-4xl font-medium'>
              <h1>Learners</h1>
            </div>
            <p className='text-xs md:text-sm text-gray-600 lg:mb-6'>
              A list of all your learners for class <span className='font-semibold'>{division} - {subject}</span>.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><RegisterLearner classId={classId} /></TooltipTrigger>
                <TooltipContent>
                  <p className='text-xs md:text-base'>
                    For new learners who don't have an account
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><AddLearner classId={classId}/></TooltipTrigger>
                <TooltipContent>
                  <p className='text-xs md:text-base'>
                    For learner learners who already have an app account
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      <div className=' border bg-white rounded-lg p-2 md:p-4 lg:p-6'>
      <Table className='text-xs md:text-base'>
        <TableCaption className='text-xs md:text-base'>A list of all learners.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Surname</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {learners?.map((learner: any, index: any) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{learner?.name}</TableCell>
                <TableCell>{learner?.surname}</TableCell>
                <TableCell className='flex items-center gap-2'>
                  
                  <Link 
                  href={`/classes/${classId}/assessments/assessmentId/submissions/${learner?.learnerid}`}
                  as={`/classes/${classId}/assessments/assessmentId/submissions/${learner?.learnerid}`}
                  className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border rounded-md border-[#064789] md:px-2 p-1'
                  
                  >
                    Submissions
                  </Link>
                  <DeleteLearner classId={classId} learnerId={learner?.learnerid}/>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    </div>
  )
}

export default Learners