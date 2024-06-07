import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { FaArrowLeft } from 'react-icons/fa6'

const Results = ({classId, lastResult, isPassed} : {classId: string, lastResult: any, isPassed: string}) => {
  console.log(lastResult?.score);
  return (
    <div className='flex flex-col gap-8'>
                    <div className='text-gray-600 text-center'>
                      {
                        isPassed === 'true' ? (<span>
                          The due date has passed, here are your results.
                        </span>) : (
                          <span>You have used up all your attempts. Here are your results.</span>
                        )
                      }
                    </div>

                <div className='flex justify-center'>
                      <div className='flex flex-col gap-8 bg-white border shadow rounded-md p-12 py-8'>
                        <div>
                          <h1 className='font-bold text-2xl'>Results</h1>
                          <h3 className='text-gray-600 text-sm'> Here are your results from the quiz.</h3>
                        </div>
                        <table className='table'>
                          <tbody className='flex flex-col gap-2'>
                            <tr className='flex justify-between border-b pb-2'>
                              <td className='font-medium'>Total Score : </td>
                              <td>{lastResult?.score}</td>
                            </tr>
                            <tr className='flex justify-between border-b pb-2'>
                              <td  className='font-medium'>Percentage : </td>
                              <td>{lastResult?.percentage}%</td>
                            </tr>
                            <tr className='flex justify-between '>
                              <td className='font-medium'>Status : </td>
                              <td>{lastResult?.status}</td>
                            </tr>
                          </tbody>
                        </table>

                        <div className='grid w-full mt-4'>
                          <Link href={`/classes/${classId}/assessments`} className='place-self-end'>
                          <Button
                          className='flex gap-2 items-center bg-[#064789] hover:border hover:border-[#064789] hover:bg-white hover:text-[#064789]'
                          >
                            <FaArrowLeft />
                            <span>Assessments</span>
                          </Button>
                        </Link>
                        </div>
                      </div>
                    </div>
                  </div>
  )
}

export default Results