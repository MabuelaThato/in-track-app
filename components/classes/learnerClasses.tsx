import React from 'react'
import Link from 'next/link';
import { getLearnerClasses } from '@/actions/actions';
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
                <TableCell className='flex items-center gap-2'>
                  <Link href={`/classes/${grade?.classid}/assessments`} className="bg-gray-400 hover:border hover:border-gray-400 hover:text-gray-400 hover:bg-white rounded-md px-2 py-1 text-white">
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