
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


const Assessments = async ({ params }: { params: { classId: string } }) => {

  const user = await getUser()
  if (!user) redirect("/");

  
    const userRole = user?.role;
    const { classId } = params;
    const currentClass = await getClass(classId);
    const subject = currentClass?.subject;
    const division = currentClass?.division;
   
    const adminAssessments = await getAdminAssessments(classId);
    const LearnerAssessments = await getlearnerAssessments(classId);
  

  return (
    <div className='w-full min-h-screen p-10'>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-4xl font-medium'>Assessments</h1>
          <p className='text-sm text-zinc-500 mb-6'>Here are all your assessments(your quizzes and written assignments) for class {division} - {subject}</p>
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
             { adminAssessments?.length === 0 ? (
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
                                <div>{assessment?.title} - {assessment?.assessmenttype}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {assessment?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assessment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <DeleteQuiz classId={classId} quizType={assessment?.assessmenttype} assessmentId={assessment?.assessmentid}/>
                              <Link href={`/classes/${classId}/assessments/${assessment.assessmentid}`}>
                                <Button 
                                className='bg-[#A5BE00] border border-[#A5BE00] hover:text-[#A5BE00] font-medium hover:bg-white'>
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
          { LearnerAssessments?.length === 0 ? (
            <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
             You do not have any assessments.
             </div>
             ) : (
          <div className='flex flex-wrap gap-8'>
  
              {
                LearnerAssessments?.map((assessment, index) => {
                      return (
                        <Card key={index} className='w-64 flex flex-col'>
                          <CardHeader>
                            <CardTitle>
                              <div>
                                <div>{assessment?.title} - {assessment?.assessmenttype}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {assessment?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assessment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex  flex-col justify-end gap-4 grow'>
                              <div className='grid w-full'>
                                <Link href={`/classes/${classId}/assessments/${assessment.assessmentid}`} className='place-self-end'>
                                  <Button className='bg-[#A5BE00] border border-[#A5BE00] hover:text-[#A5BE00] font-medium hover:bg-white'>
                                    Start
                                  </Button>
                                </Link>
                              </div>
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