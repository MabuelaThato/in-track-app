"use client"
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';
import { FaFilePdf, FaTrash } from "react-icons/fa6";

const PdfQuestions = ({assignments} : {assignments:any}) => {

    const [downloadUrls, setDownloadUrls] = useState<string[]>([]);

    useEffect(() => {
        const fetchDownloadUrls = async () => {
            const urls = await Promise.all(
                assignments.rows.map(async (assignment: any) => {
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
        <div className='flex gap-4'>
            {assignments.rows?.map((assignment:any, index:any) => {
                const downloadUrl = downloadUrls[index];
                return (
                    <div key={index} className='w-96'>
                        <p>
                            {downloadUrl ? (
                                <div>
                                    <a href={downloadUrl} download={assignment.filename} target='blank' className='border flex rounded shadow min-h-20'>
                                        <div className='p-4 flex items-center justify-center'>
                                            <FaFilePdf size={32} color='red' />
                                        </div>
                                        <div className='border-l p-4 flex items-center justify-center'>
                                            <div>{assignment.filename}</div>
                                        </div>
                                    </a>
                                    <button className='underline text-sm mt-1 ml-1'>Delete</button>
                                </div>
                            ) : (
                                <p>Loading...</p>
                            )}
                        </p>
                    </div>
                );
            })}
        </div>
    );
}

export default PdfQuestions