"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteClass } from '@/actions/actions';

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
     <button
        onClick={handleDelete}
        disabled={deleting}
        className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border rounded-md border-[#064789] md:px-2 p-1'
      >
        {
          deleting ? (<div>...</div>) : (<FaTrash />)
        }
      </button>
  );
};

export default DeleteClass;