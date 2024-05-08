import { getAdminAssessments, getClass, getUser, getlearnerAssessments } from '@/actions/actions';
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import { FaPlus } from 'react-icons/fa6';
import AddQuiz from '@/components/assessments/addQuiz';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';


const Assessments = async ({ params }: { params: { classId: string } }) => {
    const user = await getUser();
    const userRole = user?.role;
    const { classId } = params;
    const currentClass = await getClass(classId);
    const subject = currentClass?.subject;
    const division = currentClass?.division;
   
    const adminAssessments = await getAdminAssessments(classId);
    const learnerAssessments = await getlearnerAssessments(classId);

  return (
    <div className='w-full min-h-screen p-10'>
      <div className='flex justify-between'>
        <div>
          <h1 className='text-4xl font-medium'>Assessments</h1>
          <p className='text-sm text-zinc-500 mb-6'>Here are all your assessments for class {division} - {subject}</p>
        </div>
        {
          userRole === "admin" ? (
           <div>
            <AddQuiz classId={classId} />
           </div>
          ) : (
            <div></div>
          )
        }
      </div>

      <div className='mt-6'>
       {
        userRole === "admin" ? (
          <div>
             { adminAssessments.length === 0 ? (
         <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
          You do not have any assessments. Click create assessment.
          </div>
          ) : (
            <div className='flex gap-12 flex-wrap'>
                {adminAssessments?.map((assessment, index) => {
                      return (
                        <Card key={index} className='w-64'>
                          <CardHeader>
                            <CardTitle>
                              <div>
                                <div>{assessment?.title}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {assessment?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assessment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <Button className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border border-[#064789] '>
                                Delete
                              </Button>
                              <Link href={`/dashboard/classes/${classId}/assessments/${assessment.assessmentid}`}>
                                <Button className='bg-[#A5BE00] border border-[#A5BE00] hover:text-[#A5BE00] font-medium hover:bg-white'>
                                  View
                                </Button>
                              </Link>
                          </CardFooter>
                        </Card>
                      )
                    }
                  )}
          </div>
        )}
          </div>
        ) : (
          <div>
          { learnerAssessments.length === 0 ? (
            <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
             You do not have any assessments.
             </div>
             ) : (
          <div className='flex gap-12 flex-wrap'>
                {learnerAssessments?.map((assessment, index) => {
                      return (
                        <Card key={index} className='w-64'>
                          <CardHeader>
                            <CardTitle>
                              <div>
                                <div>{assessment?.title}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {assessment?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assessment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <Link href={`/dashboard/classes/${classId}/assessments/${assessment.assessmentid}`}>
                                <Button className='bg-[#A5BE00] border border-[#A5BE00] hover:text-[#A5BE00] font-medium hover:bg-white'>
                                  Start
                                </Button>
                              </Link>
                          </CardFooter>
                        </Card>
                      )
                    }
                  )}
          </div>
        )
       }
      </div>
        )}
      </div>
    </div>
  )
}

export default Assessments