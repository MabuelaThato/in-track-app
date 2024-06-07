"use client"
import React, { useEffect, useState } from 'react'
import Link from 'next/link';
import { getAdminClasses, getUser } from '@/actions/actions';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { QueryResultRow } from '@vercel/postgres';

const AdminHome = () => {
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
    <div className='w-full'>
      <div className="flex md:justify-between flex-col md:flex-row gap-4 md:gap-0">
        <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium '>
            <h1>Resources</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 md:mb-6'>Here is a list of all your classes.</p>
        </div>
      </div>
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

export default AdminHome;