import React from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FaUsers, FaUser, FaTrophy } from "react-icons/fa6";
import { ImStatsBars } from "react-icons/im";
import { TbRosetteNumber1, TbRosetteNumber2, TbRosetteNumber3 } from "react-icons/tb";

const AdminDashboard = () => {
  return (
    <div className='w-full mt-6'>
      <div className='flex flex-row gap-6'>

          <div className='flex flex-row gap-6'>
              <div className='flex flex-col gap-6'>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex gap-2 items-center text-base'>
                      <FaUser />
                      <span className='font-medium title'>Total Learners</span>
                    </CardTitle>

                  </CardHeader>
                  <CardContent>
                    <p className='text-4xl font-black'>64</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className='flex gap-2 items-center'>
                      <FaUsers />
                      <span className='font-medium title'>Total Classes</span>
                    </CardTitle>

                  </CardHeader>
                  <CardContent>
                    <p className='text-4xl font-black'>2</p>
                  </CardContent>
                </Card>
              </div>
              <div className='flex flex-col'>
                <Card className='grow px-4'>
                  <CardHeader>
                    <CardTitle className='flex gap-2 items-center'>
                      <FaTrophy />
                      <span className='font-medium title'>Top Learners</span>
                    </CardTitle>

                  </CardHeader>
                  <CardContent>
                    <p className='flex flex-col gap-8'>
                      <div className='flex gap-2 items-center'>
                        <TbRosetteNumber1 size={32} className=''/>
                        <div className='text-xs'>
                          <div className='font-semibold'>Learner's Name</div>
                          <div className='text-zinc-600'>Class Name</div>
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <TbRosetteNumber2 size={32} className=''/>
                        <div className='text-xs'>
                          <div className='font-semibold'>Learner's Name</div>
                          <div className='text-zinc-600'>Class Name</div>
                        </div>
                      </div>
                      <div className='flex gap-2 items-center'>
                        <TbRosetteNumber3 size={32} className=''/>
                        <div className='text-xs'>
                          <div className='font-semibold'>Learner's Name</div>
                          <div className='text-zinc-600'>Class Name</div>
                        </div>
                      </div>
                    </p>
                  </CardContent>
                </Card>
              </div>
          </div>

              <Card className='grow'>
                <CardHeader>
                  <CardTitle className='flex gap-2 items-center'>
                    <ImStatsBars />
                    <span className='font-medium title'>Class Averages</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p>Card Content</p>
                </CardContent>
              </Card>
            </div>
          </div>

  )
}

export default AdminDashboard;