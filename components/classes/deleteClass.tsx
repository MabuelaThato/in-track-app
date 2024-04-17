import React from 'react'
import { FaTrashCan } from "react-icons/fa6";
import { deleteClass } from '@/actions/actions';
import { Button } from '../ui/button';

const DeleteClass = ({
    classSubject,
    classDivision
  }: {
    classSubject: string;
    classDivision: string;
  }) => {

  return (
   <Button className='border border-[#064789] text-[#064789] bg-white hover:bg-[#064789] hover:text-white'
   onClick={async () => deleteClass(classSubject, classDivision)}
   >
    <FaTrashCan />
   </Button>
  )
}

export default DeleteClass