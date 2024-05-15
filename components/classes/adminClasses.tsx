"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { getAdminClasses } from '@/actions/actions';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import DeleteClass from './deleteClass';
import { QueryResultRow } from '@vercel/postgres';


const AdminClasses = () => {
  const [classes, setClasses] = useState<QueryResultRow[]>([]);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await getAdminClasses();
        if (classesData) {
          setClasses(classesData);
        } else {
          console.error('Error fetching classes: Data is undefined');
        }
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);


  return (
    <div className=" border bg-white rounded-lg p-2 md:p-4 lg:p-6">
      <Table className='text-xs md:text-base'>
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
                    href={`/classes/${grade?.classid}`}
                    className='border border-[#A5BE00] text-[#A5BE00] rounded-md p-0.5 px-2 font-medium hover:bg-[#A5BE00] hover:text-white'
                  >
                    View
                  </Link>

                  <DeleteClass classId={grade?.classid}/>
                  
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

export default AdminClasses;