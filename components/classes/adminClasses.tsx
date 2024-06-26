"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { getAdminClasses } from '@/actions/actions';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import DeleteClass from './deleteClass';
import { QueryResultRow } from '@vercel/postgres';

const AdminClasses = () => {
  const [classes, setClasses] = useState<QueryResultRow[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const classesData = await getAdminClasses();
        if (classesData) {
          setClasses(classesData);
        } else {
          console.error('Error fetching classes: Data is undefined');
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching classes:', error);
      }
    };

    fetchClasses();
  }, []);

  if (loading) {
    return (<div className='flex justify-center gap-4 items-center h-screen'>
                <div className='green-loader'></div>
                <span className='text-gray-600 font-medium'>Loading</span>
            </div>);
  }

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
                  
                  <Link href={`/classes/${grade?.classid}/assessments`} className="hover:bg-gray-400 border border-gray-400 hover:text-white text-gray-400 bg-white rounded-md px-2 py-1">
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