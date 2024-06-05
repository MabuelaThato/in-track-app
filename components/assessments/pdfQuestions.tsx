"use client"
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';
import { FaFilePdf } from "react-icons/fa6";
import { deleteAdminAssignment} from '@/actions/actions';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"

const PdfQuestions = ({assignments, classId, assessmentId} : {assignments:any, classId: string, assessmentId:string}) => {

    const [downloadUrls, setDownloadUrls] = useState<string[]>([]);
    const [deleting, setDeleting] = useState(false);

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

    async function handleDelete(){
        try {
            setDeleting(true);
            await deleteAdminAssignment(classId, assessmentId);
            const filename = assignments.rows[0].filename
            console.log(filename)
            const desertRef = ref(storage, `files/${filename}`);
    
            deleteObject(desertRef).then(() => {
            console.log("FILE DELETED SUCCESSFULLY")
            }).catch((error) => {
            console.log("ERROR DELETING FROM FIREBASE:  ", error)
            });
        } catch (error) {
            console.log("ERROR DELETING:   ",error)
        }
        window.location.reload();
     
    }

    return (
        <div className='flex gap-4'>
            {assignments.rows?.map((assignment:any, index:any) => {
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
                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            {
                                                deleting ? (<div className='text-sm mt-1 ml-1'>Deleting...</div>) : (<div className='underline text-sm mt-1 ml-1'>Delete</div>)
                                            }
                                        </AlertDialogTrigger>
                                        <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
                                            <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your assignment
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                            onClick={handleDelete}
                                            disabled={deleting}
                                            >
                                            Delete
                                            </AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            ) : (
                                <div className='flex gap-2'>
                                    <div className='blue-loader'></div>
                                    <span>Loading assignment</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

export default PdfQuestions