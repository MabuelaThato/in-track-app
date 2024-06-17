import { getUser } from '@/actions/actions';
import { redirect } from 'next/navigation';
import React from 'react'

const Tibbey = async () => {
    const user = await getUser();
    if (!user) redirect("/");
    const userRole = user?.role;
  return (
    <div className='min-h-screen p-4 md:p-6 lg:p-12'>
      welcom to tibbey
    </div>
  )
}

export default Tibbey
