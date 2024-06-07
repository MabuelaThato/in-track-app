import { getAdminAssessment, getLearnerAssignmentSubmissions, getLearnerQuizSubmissions, getPdfQuestion, getUser } from '@/actions/actions';
import AdminAssessment from '@/components/assessments/adminAssessment';
import LearnerAssessment from '@/components/assessments/learnerAssessment';
import LearnerPdfAssignments from '@/components/assessments/learnerPdfAssignments';
import Results from '@/components/assessments/results';
import { redirect } from 'next/navigation';
import React from 'react'

const Assessment = async({ params }: { params: { classId: string, assessmentId: string } }) => {
  const user = await getUser();
  if (!user) redirect("/");
  
  const { classId } = params;
  const { assessmentId } = params;
  const userRole = user?.role;
  const assessment = await getAdminAssessment(classId, assessmentId); //getting the assessment(quiz)
  const assessmentType = assessment?.assessmenttype;
  const dueDate = assessment?.duedate;
  const dueTime = assessment?.duetime;
  const submissions = await getLearnerQuizSubmissions(classId, assessmentId); //learner quiz attempts
  const submissionsLength = submissions?.length;
  const lastIndex = submissionsLength ? submissionsLength - 1 : 0;
  const lastResult = submissions ? submissions[lastIndex] : null;
  const assignments = await getPdfQuestion(classId, assessmentId); //the ones that the teacher uploaded
  const pdfSubmissions = await getLearnerAssignmentSubmissions(classId, assessmentId); // the pdfs that the learner submitted
  const lastPdf = pdfSubmissions ? pdfSubmissions[lastIndex] : null; 
  const attempts = assessment?.attempts;

  function hasDateTimePassed(dateString: string, timeString: string): string {

    const dateTimeString = `${dateString} ${timeString}`;
    
    const inputDateTime = new Date(dateTimeString);

    const currentDateTime = new Date();

    if (currentDateTime > inputDateTime) {
        return 'true';
    } else {
        return 'false';
    }
}

const fetchedDate = dueDate; 
const fetchedTime = dueTime; 
const isPassed = hasDateTimePassed(fetchedDate, fetchedTime);

  return (
    <div className='p-4 md:p-6 lg:p-12 min-h-screen '>
        {
          userRole === "admin" ? (
            <div className='w-full'>
             
                  <AdminAssessment classId={classId} assessmentId={assessmentId} />
          
            </div>
          ) : (
            <div>
              {
                assessmentType === "quiz" ? (
                  <div>
                    {
                      isPassed === 'true' ? (
                        <div>
                          {submissionsLength !== undefined && submissionsLength >= attempts ? (
                            <Results classId={classId} lastResult={lastResult} isPassed={isPassed}/>
                          ) : (
                            <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
                              You have missed the due date. You are not able to make any submissions for this assessment.
                            </div>

                          )}
                        </div>
                      ) : (
                        <div>
                          {submissionsLength !== undefined && submissionsLength >= attempts ? (
                            <Results classId={classId} lastResult={lastResult} isPassed={isPassed}/>
                          ) : (
                            <LearnerAssessment classId={classId} assessmentId={assessmentId} attempts={attempts} submissionsLength={submissionsLength}/>

                          )}
                        </div>
                        
                      )
                    }
                  </div>
                ) : (
                  <LearnerPdfAssignments assignments={assignments?.rows} classId={classId} assessmentId={assessmentId} lastPdf={lastPdf} isPassed={isPassed} />
                )
              }
              
            </div>
          )
        }
    </div>
  )
}

export default Assessment

