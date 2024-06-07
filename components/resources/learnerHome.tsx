import React from 'react'
import Link from 'next/link';
import { getLearnerClasses } from '@/actions/actions';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';


const LearnerHome = async () => {
  const classes = await getLearnerClasses();
  return (
    <div className='w-full'>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium '>
            <h1>Resources</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>Here is a list of all your classes.</p>
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
                <Link
                    href={`/resources/${grade?.classid}/notes`}
                    className='border border-[#A5BE00] text-white rounded-md p-0.5 px-2 font-medium bg-[#A5BE00] hover:text-[#A5BE00] hover:bg-white'
                  >
                    Notes
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

export default LearnerHome;