
import React from 'react'
import AddClass from './addClass'
import { Button } from '../ui/button';
import Link from 'next/link';

const AdminClassesHeader = () => {
  return (
    <div className='w-full'>
      <div className="flex justify-between">
        <div>
          <div className='text-4xl font-medium '>
            <h1>Classes</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>A list of all your classes.</p>
        </div>
        
          <div>
            <AddClass />
              {/*<Button className='text-white bg-[#064789] hover:bg-white hover:text-[#064789] border rounded-md border-[#064789] p-2'>
                Add Class
              </Button>*/}

          </div>
      </div>
    </div>
  )
}

export default AdminClassesHeader;