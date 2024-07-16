"use client"
import React, { useState } from 'react';
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
import { deleteAdminAnnouncement } from '@/actions/communications';

const DeleteAnnouncement = ({classId, announcementId} : {classId: string, announcementId: string}) => {

    const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
            await deleteAdminAnnouncement(classId, announcementId);
            setDeleting(true);
            window.location.reload();
    } catch (error) {
      console.error('Error deleting class:', error);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
      className=' hover:bg-white bg-[#064789] text-white hover:text-[#064789] border rounded-md border-[#064789] px-3 p-1'>
        {
          deleting ? (<div>Deleting...</div>) : (<div>Delete</div>)
        }
      </AlertDialogTrigger>
      <AlertDialogContent className='max-w-[350px] md:max-w-[425px] rounded'>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your announcement
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

export default DeleteAnnouncement;