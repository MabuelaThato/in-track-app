import React from 'react'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { getClass, getUser } from '@/actions/actions';
import { redirect } from 'next/navigation';
import { GetNotes } from '@/actions/resourcesActions';
import PdfNotes from '@/components/resources/notes';
import AddNote from '@/components/resources/addNote';

const Notes = async ({ params }: { params: { classId: string } }) => {
    const user = await getUser()
    if (!user) redirect("/");

    const { classId } = params;
    
  async function GetClass(){
    const currentClass = await getClass(classId);
      const subject = currentClass?.subject;
      const division = currentClass?.division;

      const className = division + " " + subject;

      return className;
  }

    const className = GetClass();
    
  return (
    <div className='p-4 md:p-6 lg:p-12 min-h-screen '>
      {/* HEADER*/}
    <div className='flex flex-col gap-6 lg:gap-0 mb-6 lg:mb-0 lg:flex-row lg:justify-between'>
      <div>
        <h1 className='text-xl md:text-2xl lg:text-4xl font-medium '>Notes</h1>
        <p className='text-xs md:text-sm text-gray-600 lg:mb-6'>Here are all your notes for class {className}</p>
      </div>
      {
        user?.role === "admin" ? (
         
          <div className='w-32 h-6'>
            <AddNote classId={classId} />
          </div>
  
        ) : (
          ""
        )
      }
    </div>

    <div className='mt-8 lg:mt-6'>
     <PdfNotes classId={classId} userRole={user?.role} />
  </div>
  </div>
  )
}

export default Notes
