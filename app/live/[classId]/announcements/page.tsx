
import { deleteAdminAssignment, deleteQuiz, getAdminAssessments, getClass, getUser, getlearnerAssessments, getlearnerAssignments } from '@/actions/actions';
import React from 'react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import AddQuiz from '@/components/assessments/addQuiz';
import { redirect } from 'next/navigation';
import DeleteQuiz from '@/components/assessments/deleteQuiz';
import AddAnnouncement from '@/components/live/announcements/addAnnouncement';
import { getAnnouncements } from '@/actions/communications';
import DeleteAnnouncement from '@/components/live/announcements/deleteAnnouncement';
import AdminAnnouncements from '@/components/live/announcements/adminAnnouncements';
import LearnerAnnouncements from '@/components/live/announcements/learnerAnnouncements';


const Announcements = async ({ params }: { params: { classId: string } }) => {

  const user = await getUser()
  if (!user) redirect("/");

  
    const userRole = user?.role;
    const { classId } = params;
    const currentClass = await getClass(classId);
    const subject = currentClass?.subject;
    const division = currentClass?.division;
   
    const announcements = await getAnnouncements(classId);
  

  return (
    <div className='p-4 md:p-6 lg:p-12 min-h-screen '>
      <div className='flex flex-col gap-6 lg:gap-0 mb-6 lg:mb-0 lg:flex-row lg:justify-between'>
        <div>
          <h1 className='text-xl md:text-2xl lg:text-4xl font-medium'>Announcements</h1>
          <p className='text-xs md:text-sm text-gray-600 lg:mb-6'>Here are all your announcements for class {division} - {subject}</p>
        </div>
        {
          userRole === "admin" ? (
           
            <AddAnnouncement classId={classId} />
    
          ) : (
            ""
          )
        }
      </div>

      <div className='mt-8 lg:mt-6'>
       {
        userRole === "admin" ? (
          <div>
             { announcements?.length === 0 ? (
         <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
          You do not have any announcements. Click create announcement.
          </div>
          ) : (
          <AdminAnnouncements classId={classId} />
        )}
          </div>
        ) : (
          <div>
          { announcements?.length === 0 ? (
            <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
             You do not have any announcements.
             </div>
             ) : (
          <LearnerAnnouncements classId={classId} />
        )
       }
      </div>
        )}
      </div>
    </div>
  )
}

export default Announcements;