
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { getClass, getLearners } from '@/actions/actions';
import { Button } from '@/components/ui/button';
import { FaPlus } from 'react-icons/fa6';
import AddLearner from '@/components/learners/addLearner';
import { IoSettingsSharp } from "react-icons/io5";

const Learners = async ({ params }: { params: { classId: string } }) => {

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
          <div>
            <AddLearner classId={classId}/>
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
          {learners.map((learner: any, index: any) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{learner?.name}</TableCell>
                <TableCell>{learner?.surname}</TableCell>
                <TableCell>
                  <Link
                    
                    href={`/dashboard/classes/${classId}/${learner?.learnerid}`}
                  >
                    View
                  </Link>
                  
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