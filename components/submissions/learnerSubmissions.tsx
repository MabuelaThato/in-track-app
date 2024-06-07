"use client"
import React, { useEffect, useState } from 'react'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { QueryResultRow } from '@vercel/postgres';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../provider';
import { getClass, getEachLearnerAssignments, getLearnerQuizzes } from '@/actions/actions';
import AdminPdfDownload from './adminPdfDownload';

const LearnerSubmission = ({classId, learnerId} : {classId: string, learnerId: string}) => {
  const [assignmentSubmissions, setAssignmentSubmissions] = useState<any[]>([]);
    const [quizSubmissions, setQuizSubmissions] = useState<any[]>([]);
    const [currentClass, setCurrentClass] = useState<any>(null);
    const [quizType, setQuizType] = useState<any>(null);
    const [downloadUrls, setDownloadUrls] = useState<QueryResultRow>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const fetchData = async () => {
          try {
              const classData = await getClass(classId);
              const assignmentData = await getEachLearnerAssignments(classId, learnerId);
              const quizData = await getLearnerQuizzes(classId, learnerId);

              if (assignmentData) {
                  setAssignmentSubmissions(assignmentData);
                } else {
                  console.error('Error fetching assignments: Data is undefined');
                }

                const newData = (assignmentData ?? []).map((assignment: any) => ({
                  name: assignment.name,
                  filename: assignment.filename
                }));
              
                setAssignmentSubmissions(newData);
              

                if (quizData) {
                  setQuizSubmissions(quizData);
                  console.log("QUIZ DATA:   ", quizData)
                } else {
                  console.error('Error fetching quizzes: Data is undefined');
                } 

              setCurrentClass(classData);
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

  return (
    <div>
      <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium'>
            <h1>Quiz Submissions</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 mb-6'>
            All quiz submissions by the learner.
          </p>
        </div>
      <div className=" border bg-white rounded-lg p-2 pb-6 md:p-6">
       <Table>
          <TableCaption>Quiz submissions.</TableCaption>
          <TableHeader>
          <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Name</TableHead>
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
                  <TableCell>{submission?.fullname}</TableCell>
                  <TableCell>{submission?.score}</TableCell>
                  <TableCell>{submission?.percentage}%</TableCell>
                  <TableCell>
                      {
                          submission?.status === "Pass" ? (
                          <div className='text-[#A5BE00] font-semibold'>
                            {submission?.status}
                          </div>
                          ) : (
                          <div className='text-red-600 font-semibold'>
                            {submission?.status}
                          </div>
                          )
                      }
                  </TableCell>
              </TableRow>
              );
          })}
          </TableBody>
      </Table>
      </div>

      <div>
          <div className='text-xl md:text-2xl lg:text-4xl font-medium'>
            <h1>Assignment Submissions</h1>
          </div>
          <p className='text-xs md:text-sm text-gray-500 mb-6'>
            All assignment submissions by the learner.
          </p>
        </div>
      <div className=" border bg-white rounded-lg p-2 pb-6 md:p-6">
      <Table>
        <TableCaption>Written assignment submissions.</TableCaption>
        <TableHeader>
        <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Name</TableHead>
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
                <TableCell>{submission?.name}</TableCell>
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

export default LearnerSubmission