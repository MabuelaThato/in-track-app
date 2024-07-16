"use client"
import React, { useState } from 'react';
import { deleteQuiz } from '@/actions/actions';
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

const DeleteQuiz = ({classId, quizType, assessmentId} : {classId: string, quizType: string, assessmentId: string}) => {

    const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
            await deleteQuiz(classId,quizType, assessmentId);
            setDeleting(true);
            window.location.reload();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
      className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border rounded-md border-[#064789] md:px-2 p-1'>
        {
          deleting ? (<div>Deleting...</div>) : (<div>Delete</div>)
        }
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your questions and learner submissions
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
  );
};

export default DeleteQuiz;