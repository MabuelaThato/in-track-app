import { getAdminAssessment, getLearnerAssignmentSubmissions, getLearnerQuizSubmissions, getPdfQuestion, getUser } from '@/actions/actions';
import AdminAssessment from '@/components/assessments/adminAssessment';
import LearnerAssessment from '@/components/assessments/learnerAssessment';
import LearnerPdfAssignments from '@/components/assessments/learnerPdfAssignments';
import Results from '@/components/assessments/results';
import { isBefore, isEqual, parse } from 'date-fns';
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
  const submissions = await getLearnerQuizSubmissions(classId, assessmentId); //learner quiz attempts
  const submissionsLength = submissions?.length;
  const lastIndex = submissionsLength ? submissionsLength - 1 : 0;
  const lastResult = submissions ? submissions[lastIndex] : null;
  const assignments = await getPdfQuestion(classId, assessmentId); //the ones that the teacher uploaded
  const pdfSubmissions = await getLearnerAssignmentSubmissions(classId, assessmentId); // the pdfs that the learner submitted
  const lastPdf = pdfSubmissions ? pdfSubmissions[lastIndex] : null; 

  const compareDate = (dateString: string): string => {
    const dateFormat = 'dd MMM yyyy';
  
    const inputDate = parse(dateString, dateFormat, new Date());
  
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
  
    if (inputDate > currentDate) {
      return "ok";
    } else {
      return "not okay";
    }
  };

  const result = compareDate(dueDate);
  console.log("RESULT",result);

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
                result === "not okay" ? (<div>
                  {
                assessmentType === "quiz" ? (
                  <div>
                   {submissionsLength !== undefined && submissionsLength >= 1 ? (
                      <Results classId={classId} lastResult={lastResult}/>
                    ) : (
                      <LearnerAssessment classId={classId} assessmentId={assessmentId} />
                    )}
                  </div>
                ) : (
                  <LearnerPdfAssignments assignments={assignments?.rows} classId={classId} assessmentId={assessmentId} lastPdf={lastPdf} />
                )
              }
                </div>
              ) : 
                (
                  <div className='text-center text-zinc-500 flex justify-center items-center h-screen'>
                    You have missed the due date. You are not able to make any subissions for this assessment
                  </div>
                )
              }
              
            </div>
          )
        }
    </div>
  )
}

export default Assessment

