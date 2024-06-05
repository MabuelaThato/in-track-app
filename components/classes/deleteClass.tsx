"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteClass } from '@/actions/actions';
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

const DeleteClass = ({classId} : {classId: string}) => {

  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteClass(classId);
      setDeleting(true)
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
          deleting ? (<div>...</div>) : (<FaTrash />)
        }
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your class
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

export default DeleteClass;