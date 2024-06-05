"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { QueryResultRow } from '@vercel/postgres';
import { getDownloadURL, ref } from 'firebase/storage';
import { getClass, getEachLearnerAssignments, getLearner, getLearnerQuizzes } from '@/actions/actions';
import { storage } from '@/components/provider';
import AdminPdfDownload from '@/components/submissions/adminPdfDownload';

interface LearnerSubmissionProps {
    params: {
      classId: string;
      assessmentId: string;
      learnerSubmissions: string;
    };
  }

const LearnerSubmissions: React.FC<LearnerSubmissionProps> = ({ params }) => {

  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
    const [quizSubmissions, setQuizSubmissions] = useState<any[]>([]);
    const [quizType, setQuizType] = useState<any>(null);
    const [downloadUrls, setDownloadUrls] = useState<QueryResultRow>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [learner, setLearner] = useState("");

    const { classId, assessmentId, learnerSubmissions } = params;

    useEffect(() => {
      const fetchData = async () => {
          try {
              const assignmentData = await getEachLearnerAssignments(classId, learnerSubmissions);
              const quizData = await getLearnerQuizzes(classId, learnerSubmissions);
              const currentLearner = await getLearner(learnerSubmissions);
              const learnerName = currentLearner?.name + " " + currentLearner?.surname;

              setLearner(learnerName)

              if (assignmentData) {
                  setAssignmentSubmissions(assignmentData);
                } else {
                  console.error('Error fetching assignments: Data is undefined');
                }

                const newData = (assignmentData ?? []).map((assignment: any) => ({
                  name: assignment.name,
                  filename: assignment.filename,
                  assignmenttitle: assignment.assignmenttitle
                }));
              
                setAssignmentSubmissions(newData);
              

                if (quizData) {
                  setQuizSubmissions(quizData);
                  console.log("QUIZ DATA:   ", quizData)
                } else {
                  console.error('Error fetching quizzes: Data is undefined');
                } 

              setAssignmentSubmissions(newData);
              setQuizType(quizType)

              if (quizType === 'assignment') {
                  const urls = await Promise.all(
                      newData.map(async (assignment: any) => {
                        try {
                          const pathReference = ref(storage, `learners/${assignment.filename}`);
                          const url = await getDownloadURL(pathReference);
                          return url;
                        } catch (error) {
                          console.error('Error getting download URL:', error);
                          return null;
                        }
                      })
                    );
                  setDownloadUrls(urls);
                  
              }

              setLoading(false);
          } catch (error) {
              console.error('Error fetching data:', error);
          }
      };

      fetchData();
  }, [setAssignmentSubmissions]);

  if (loading) {
      return (<div className='flex justify-center gap-4 items-center h-screen'>
                  <div className='green-loader'></div>
                  <span className='text-gray-600 font-medium'>Loading</span>
              </div>);
  }

  console.log("QUIZ SUBMISSIONS", quizSubmissions)
  console.log("Assignment SUBMISSIONS", assignmentSubmissions)

  return (
    <div className='p-4 md:p-6 lg:p-12 min-h-screen  '>

      <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium'>
            <h1>{learner}</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 mb-6 lg:mt-2'>
            All quiz submissions by the learner.
          </p>
        </div>

      <div>
          <div className='md:text-lg lg:text-xl font-medium'>
            <h1>Quiz Submissions</h1>
          </div>
        </div>
      <div className="mt-2 border bg-white rounded-lg p-2 pb-6 md:p-6">
       <Table>
          <TableCaption>Quiz submissions.</TableCaption>
          <TableHeader>
          <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Assessment title</TableHead>
              <TableHead>Score</TableHead>
              <TableHead>Percentage</TableHead>
              <TableHead>Result</TableHead>
          </TableRow>
          </TableHeader>
          <TableBody>
          {quizSubmissions?.map((submission: any, index: any) => {
              return (
              <TableRow key={index}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{submission?.assessmenttitle}</TableCell>
                  <TableCell>{submission?.score}</TableCell>
                  <TableCell>{submission?.percentage}%</TableCell>
                  <TableCell>
                      {
                          submission?.status === "Pass" ? (<div className='text-[#A5BE00] font-semibold'>{submission?.status}</div>) : (<div className='text-red-600 font-semibold'>{submission?.status}</div>)
                      }
                  </TableCell>
              </TableRow>
              );
          })}
          </TableBody>
      </Table>
      </div>

      <div className='mt-12'>
          <div className=' md:text-lg lg:text-xl font-medium'>
            <h1>Assignment Submissions</h1>
          </div>
        </div>
      <div className="mt-2 border bg-white rounded-lg p-2 pb-6 md:p-6">
      <Table>
        <TableCaption>Written assignment submissions.</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Assessment title</TableHead>
            <TableHead>Pdf submission</TableHead>
        </TableRow>
        </TableHeader>
        <TableBody>
        {assignmentSubmissions?.map((submission: any, index: any) => {
            const downloadUrl = downloadUrls[index];
            console.log(downloadUrl)
            return (
            <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{submission?.assignmenttitle}</TableCell>
                <TableCell>
                    <AdminPdfDownload index={index} assignmentSubmissions={assignmentSubmissions} submission={submission} />
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

export default LearnerSubmissions;