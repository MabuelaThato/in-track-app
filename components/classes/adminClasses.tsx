
import React from 'react'
import Link from 'next/link';
import { getAdminClasses } from '@/actions/actions';
import DeleteClass from './deleteClass';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { FaTrash } from 'react-icons/fa6';


const AdminClasses = async () => {
  const classes = await getAdminClasses();
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
                  <Link
                    href={`/dashboard/classes/${grade?.classid}`}
                    className='border border-[#A5BE00] text-[#A5BE00] rounded-md p-0.5 px-2 font-medium hover:bg-[#A5BE00] hover:text-white'
                  >
                    View
                  </Link>
                  <FaTrash className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border rounded-md border-[#064789] px-2 py-0.5' size={28}/>
                  <Link href={`/dashboard/classes/${grade?.classid}/assessments`} className="bg-gray-400 hover:border hover:border-gray-400 hover:text-gray-400 hover:bg-white rounded-md px-2 py-1 text-white">
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

export default AdminClasses;