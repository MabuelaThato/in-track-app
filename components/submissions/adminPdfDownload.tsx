"use client"
import { QueryResultRow } from '@vercel/postgres';
import { getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';

const AdminPdfDownload = ({index, assignmentSubmissions, submission} : {index: any, assignmentSubmissions: any, submission: any}) => {

    const [downloadUrls, setDownloadUrls] = useState<QueryResultRow>([]);

    useEffect(() => {
        const fetchDownloadUrls = async () => {
            const urls = await Promise.all(
                assignmentSubmissions.map(async (assignment: any) => {
                    
                    try {
                        const pathReference = ref(storage, `learners/${assignment.filename}`);
                        const url = await getDownloadURL(pathReference);
                        
                        return url;
                    } catch (error) {
                        console.error('Error getting pdf URL:', error);
                        return null;
                    }
                })
            );
            setDownloadUrls(urls);
        };

        fetchDownloadUrls();
    }, [assignmentSubmissions]);

    const downloadUrl = downloadUrls[index]

  return (
    <div key={index} className='w-96'>
    <div>
        {downloadUrl ? (
            <div>
                <a href={downloadUrl} download={submission.filename} target='blank'>
                        <div>{submission.filename}</div>
                </a>
                
            </div>
        ) : (
            <div>Loading...</div>
        )}
    </div>
</div>
  )
}

export default AdminPdfDownload