import { getAdminAssessments, getClass } from '@/actions/actions';
import AddAssessment from '@/components/assessments/addAssessment';
import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const Assessments = async ({ params }: { params: { classId: string } }) => {

    const { classId } = params;
    const currentClass = await getClass(classId);
    const subject = currentClass?.subject;
    const division = currentClass?.division;
   
    const assessments = await getAdminAssessments(classId);

  return (
    <div className='w-full min-h-screen p-10'>
      <div className='flex justify-between'>
        <div>
          <h1 className='text-4xl font-medium'>Assessments</h1>
          <p className='text-sm text-zinc-500 mb-6'>Here are all your assessments for class {division} - {subject}</p>
        </div>
        <AddAssessment classId={classId}/>
      </div>

      <div>
        { assessments.length === 0 ? (
         <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
          You do not have any assessments. Click create assessment.
          </div>
          ) : (
            <div className='flex space-x-12 flex-wrap'>
                {assessments?.map((assessment, index) => {
                      return (
                        <Card key={index} className='w-64'>
                          <CardHeader>
                            <CardTitle>{assessment?.title}</CardTitle>
                          </CardHeader>
                          <CardContent className='text-gray-600'>
                            <p>{assessment.instruction}</p>
                          </CardContent>
                          <CardFooter className='flex justify-end gap-4'>
                              <Button className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border border-[#064789] '>
                                Edit
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
    </div>
  )
}

export default Assessments