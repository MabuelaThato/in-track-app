import React from 'react'
import Link from 'next/link';
import { getLearnerClasses } from '@/actions/actions';
import DeleteClass from './deleteClass';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';


const LearnerClasses = async () => {
  const classes = await getLearnerClasses();
  return (
    <div className=" border bg-white rounded-lg p-6">
      <Table>
        <TableCaption>A list of all classes.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes?.map((grade, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{grade?.subject}</TableCell>
                <TableCell>{grade?.division}</TableCell>
                <TableCell className=''>
                  <Link href={`/dashboard/classes/${grade?.classid}/assessments`} className="bg-[#A5BE00] hover:border hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white rounded-md px-2 py-1 text-white">
                   <span>Assessments</span>
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default LearnerClasses;