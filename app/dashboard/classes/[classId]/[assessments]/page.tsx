
import { getAdminAssessments, getClass, getUser, getlearnerAssessments, getlearnerAssignments } from '@/actions/actions';
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
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';


const Assessments = async ({ params }: { params: { classId: string } }) => {

  const user = await getUser()
  if (!user) redirect("/");

  
    const userRole = user?.role;
    const { classId } = params;
    const currentClass = await getClass(classId);
    const subject = currentClass?.subject;
    const division = currentClass?.division;
   
    const adminAssessments = await getAdminAssessments(classId);
    const learnerQuizzes = await getlearnerAssessments(classId);
    const learnerAssignments = await getlearnerAssignments(classId)

  return (
    <div className='w-full min-h-screen p-10'>
      <div className='flex justify-between'>
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
                               <Button>View</Button>
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
          { learnerQuizzes.length === 0 ? (
            <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
             You do not have any assessments.
             </div>
             ) : (
          <div>
            <h2 className='text-xl font-semibold mb-6'>Quizzes</h2>
            <div className='flex gap-12 flex-wrap'>
                {learnerQuizzes?.map((quiz, index) => {
                      return (
                        <Card key={index} className='w-64'>
                          <CardHeader>
                            <CardTitle>
                              <div>
                                <div>{quiz?.title}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {quiz?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{quiz.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <Link href={`/dashboard/classes/${classId}/assessments/${quiz.assessmentid}`}>
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
              <h2 className='text-xl font-semibold my-6'>Written Assignments</h2>
              <div className='flex gap-12 flex-wrap'>
              {learnerAssignments?.map((assignment, index) => {
                      return (
                        <Card key={index} className='w-64'>
                          <CardHeader>
                            <CardTitle>
                              <div>
                                <div>{assignment?.title}</div>
                                <span className='text-xs font-light text-red-600'>Due date: {assignment?.duedate}</span>
                              </div>
                            </CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assignment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <Link href={`/dashboard/classes/${classId}/assessments/${assignment.assessmentid}`}>
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