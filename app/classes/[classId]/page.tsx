
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

  const currentClass = await getClass(classId);
  const division = currentClass?.division;
  const subject = currentClass?.subject;

  return (
    <div className="p-10 min-h-screen ">
        <div className="flex justify-between">
          <div className='flex flex-col gap-1'>
            <div className='text-4xl font-medium '>
              <h1>Learners</h1>
            </div>
            <p className='text-sm text-zinc-500 mb-6'>
              A list of all your learners for class <span className='font-semibold'>{division} - {subject}</span>.
            </p>
          </div>
          <div className='flex items-center gap-2'>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><RegisterLearner classId={classId} /></TooltipTrigger>
                <TooltipContent>
                  <p>For new learners who don't have an account</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger><AddLearner classId={classId}/></TooltipTrigger>
                <TooltipContent>
                  <p>
                    For learner learners who already have an app account
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      <div className=' border bg-white rounded-lg p-6'>
      <Table>
        <TableCaption>A list of all learners.</TableCaption>
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