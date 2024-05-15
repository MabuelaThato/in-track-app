"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteLearner } from '@/actions/actions';

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
     <button
        onClick={handleDelete}
        disabled={deleting}
        className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border rounded-md border-[#064789] px-2 py-1'
      >
        {
          deleting ? (<div>...</div>) : (<FaTrash size={16} />)
        }
      </button>
  );
};

export default DeleteLearner;