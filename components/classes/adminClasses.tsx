import React from 'react'
import Link from 'next/link';
import { getAdminClasses } from '@/actions/actions';
import DeleteClass from './deleteClass';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';

const AdminClasses = async () => {

  const classes = await getAdminClasses();
  return (
    <div className="m-10">
      <Table>
        <TableCaption>A list of all students.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead>Division</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map((grade, index) => {
            return (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{grade?.subject}</TableCell>
                <TableCell>{grade?.division}</TableCell>
                <TableCell>
                  <Link
                    
                    href={`/classes/${grade?.classid}`}
                  >
                    View
                  </Link>
                  <DeleteClass classSubject={grade?.subject} classDivision={grade?.division}/>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminClasses