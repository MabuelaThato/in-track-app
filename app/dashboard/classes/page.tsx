import React from 'react'
import { FaPlus } from "react-icons/fa6";
import { Button } from '@/components/ui/button'
import { getUser } from '@/actions/actions';
import AdminClasses from '@/components/classes/adminClasses';
import LearnerClasses from '@/components/classes/learnerClasses';


const Classes = async () => {
  const user = await getUser();
  const userRole = user?.role;

  return (
    <div className='min-h-screen p-12'>
      <div className="flex justify-between">
        <div>
          <div className='text-4xl font-medium '>
            <h1>Classes</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>A list of all your classes.</p>
        </div>
        
          <Button className="bg-[#064789] hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white flex gap-2 itemse-center">
            <FaPlus />
            <span>Add Class</span>
          </Button>
      </div>

      <div>
      {
        userRole === "admin" ? (
          <AdminClasses />
        ) : (
          <LearnerClasses />
        )
      }
      </div>
    </div>
  )
}

export default Classes