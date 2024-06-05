"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteQuestion } from '@/actions/actions';
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


const DeleteQuestion = ({classId, assessmentId, questionId} : {classId: string, assessmentId: string, questionId: string}) => {

    const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
            await deleteQuestion(classId, assessmentId, questionId);
            setDeleting(true);
            window.location.reload();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
  <AlertDialog>
  <AlertDialogTrigger
  className='text-gray-300 hover:text-gray-600 font-medium'>
    {
      deleting ? (<div>Deleting...</div>) : (<FaTrash />)
    }
  </AlertDialogTrigger>
  <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
    <AlertDialogHeader>
      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone. This will permanently delete your question
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

export default DeleteQuestion;