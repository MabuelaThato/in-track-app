"use client"
import { deleteObject, getDownloadURL, ref } from 'firebase/storage';
import React, { useEffect, useState } from 'react'
import { storage } from '../provider';
import { FaFilePdf } from "react-icons/fa6";
import { deleteLearnerAssignment } from '@/actions/actions';
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

const Pdfs = ({pdf, classId, assessmentId, isPassed} : {pdf: any, classId: string, assessmentId: string, isPassed: string}) => {
    const [downloadUrl, setDownloadUrl] = useState("");
    const [deleting, setDeleting] = useState(false);

    useEffect(() => {
        const getLearnerUrl = async () => {
            try {
                const pathReference = ref(storage, `learners/${pdf.filename}`);
                const url = await getDownloadURL(pathReference);
                setDownloadUrl(url);
            } catch (error) {
                console.error('Error getting learner URL:', error);
            }
        };

        getLearnerUrl();
    }, [pdf]);

    async function handleDelete(){
        try {
            setDeleting(true);
            await deleteLearnerAssignment(classId, assessmentId);
            const desertRef = ref(storage, `learners/${classId}/${pdf.filename}`);
    
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
    
            <div className='flex flex-col gap-6'>
                <div>
                    <h1 className='text-xl md:text-2xl lg:text-4xl font-medium '>Submission</h1>
                    <p className='text-xs md:text-sm text-gray-500 lg:mb-6'>
                        Here is your submission. If you would like to change your submission you can click delete then upload another pdf.
                        <br />
                        Please note that you will not be able to make any changes after the due date passes.
                    </p>
                </div>
                <div>
                    {downloadUrl ? (
                        <div className='w-full md:w-96'>
                            <a href={downloadUrl} download={pdf.filename} target='blank' className='border flex rounded shadow min-h-20 bg-white'>
                                <div className='p-4 flex items-center justify-center'>
                                    <FaFilePdf size={32} color='red' />
                                </div>
                                <div className='border-l p-4 flex items-center justify-center'>
                                    <div>{pdf.filename}</div>
                                </div>
                            </a>
                            {
                                isPassed === 'false' ? (
                                    <div>
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
                                    <div>
                                    </div>
                                )
                            }
                        </div>
                    ) : (
                        <div className='blue-loader'></div>
                    )}
                </div>
            </div>
  )
}

export default Pdfs