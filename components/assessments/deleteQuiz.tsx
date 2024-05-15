"use client"
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';
import { deleteQuiz } from '@/actions/actions';
import { Button } from '../ui/button';

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
    <Button 
    onClick={handleDelete}
    className='hover:text-white hover:bg-[#064789] bg-white text-[#064789] border border-[#064789] '>
    {
        deleting ? (<div>Deleting...</div>) : (<div>Delete</div>)
    }
    </Button>
  );
};

export default DeleteQuiz;