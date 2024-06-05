"use client"
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';
import { FaFilePdf } from "react-icons/fa6";
import PdfSubmission from './pdfSubmission';
import Pdfs from './pdfs';


const LearnerPdfAssignments = ({assignments, classId, assessmentId, lastPdf, isPassed} : {assignments:any, classId: string, assessmentId: string, lastPdf: any, isPassed: string}) => {
    const [downloadUrls, setDownloadUrls] = useState<string[]>([]);

    console.log("Due date passed: ",isPassed)

    useEffect(() => {
        const fetchDownloadUrls = async () => {
            const urls = await Promise.all(
                assignments.map(async (assignment: any) => {
                   
                    try {
                        const pathReference = ref(storage, `files/${assignment.filename}`);
                        const url = await getDownloadURL(pathReference);
                        return url;
                    } catch (error) {
                        console.error('Error getting download URL:', error);
                        return null;
                    }
                })
            );
            setDownloadUrls(urls);
        };

        fetchDownloadUrls();
    }, [assignments]);
    
    return (
       <div className='flex flex-col gap-20'>

        <div className='flex flex-col gap-6'>
            <div>
                <h1 className='text-4xl font-medium mb-1'>Written assignment</h1>
                <p className='text-sm text-gray-600'>Here are your questions and instructions to your assignment. Click to download then click 'submit assignment' to upload your pdf.</p>
            </div>
        <div className='flex gap-4'>
            {assignments?.map((assignment:any, index:any) => {
                const downloadUrl = downloadUrls[index];
                return (
                    <div key={index} className='w-96'>
                        <div>
                            {downloadUrl ? (
                                <div>
                                    <a href={downloadUrl} download={assignment.filename} target='blank' className='border flex rounded shadow min-h-20 bg-white'>
                                        <div className='p-4 flex items-center justify-center'>
                                            <FaFilePdf size={32} color='red' />
                                        </div>
                                        <div className='border-l p-4 flex items-center justify-center'>
                                            <div>{assignment.filename}</div>
                                        </div>
                                    </a>
                                    <div>
                                        {
                                            lastPdf ? (
                                               
                                                            <div  className='w-96'>
                                                                
                                                            </div>
                                                      
                                            ) : (
                                                <div className='mt-1'>
                                                    {
                                                        isPassed === 'true' ? (
                                                            <div>Due date has passed</div>
                                                        ) : (
                                                            <PdfSubmission classId={classId} assessmentId={assessmentId}/>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                </div>
                            ) : (
                                <div className='blue-loader'></div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
        </div>
        <div>
        {
            lastPdf ? (
                
             <Pdfs pdf={lastPdf} classId={classId} assessmentId={assessmentId} isPassed={isPassed}/>
                        
            ) : (
                <div>
                   
                </div>
            )
        }
        </div>
       </div>
    );
}

export default LearnerPdfAssignments