"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteQuestion } from '@/actions/actions';


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
    <button 
    onClick={handleDelete}
    className="text-gray-300 hover:text-gray-600 font-medium">
    {
        deleting ? (<div>Deleting...</div>) : (<div><FaTrash /></div>)
    }
    </button>
    
  );
};

export default DeleteQuestion;