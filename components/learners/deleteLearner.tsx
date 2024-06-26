"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteLearner } from '@/actions/actions';
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

const DeleteLearner= ({classId, learnerId} : {classId: string, learnerId: string}) => {

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteLearner(classId, learnerId);
      setDeleting(true);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
      <AlertDialog>
      <AlertDialogTrigger
      className='hover:bg-gray-400 border border-gray-400 hover:text-white text-gray-400 rounded-md px-2 h-8'
      >
        {
          deleting ? (<div>...</div>) : (<FaTrash />)
        }
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your learner
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

export default DeleteLearner;