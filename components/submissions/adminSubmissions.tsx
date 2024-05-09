import { getClass, getLearnerAssignmentSubmissions } from '@/actions/actions'
import React from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Button } from '../ui/button';

const AdminSubmissions = async({classId, assessmentId} : {classId: string, assessmentId: string}) => {
    const currentClass = await getClass(classId)
    const submissions = await getLearnerAssignmentSubmissions(classId, assessmentId);
    
  return (
    <div>
        <div>
          <div className='text-4xl font-medium '>
            <h1>Learner Submissions</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>All assignments submitted by your learners for class {currentClass?.division} - {currentClass?.subject}</p>
        </div>

        <div className=" border bg-white rounded-lg p-6">
      <Table>
        <TableCaption>Learner submissions.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>File name</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {submissions?.map((submission: any, index: any) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission?.name}</TableCell>
                <TableCell>{submission?.filename}</TableCell>
                <TableCell className='flex items-center gap-2'>
                  <Button
                    className='border border-[#A5BE00] text-[#A5BE00] rounded-md p-0.5 px-2 font-medium hover:bg-[#A5BE00] hover:text-white'
                  >
                    View
                  </Button>
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

export default AdminSubmissions