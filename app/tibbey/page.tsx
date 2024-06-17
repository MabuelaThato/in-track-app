import { getUser } from '@/actions/actions';
import TibbeyComponent from '@/components/tibbey/tibbey';
import { redirect } from 'next/navigation';
import React from 'react'

const Tibbey = async () => {
    const user = await getUser();
    if (!user) redirect("/");
    const userRole = user?.role;

  return (
    <div className='w-full h-screen flex justify-center items-center bg-[#F1F1F2]'>
      <TibbeyComponent />
    </div>
  )
}

export default Tibbey
