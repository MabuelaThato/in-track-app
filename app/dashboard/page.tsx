import React from "react";
import AdminDashboard from "@/components/dashboard/adminDashboard";
import LearnerDashboard from "@/components/dashboard/learnerDashboard";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getUser } from "@/actions/actions";

const Dashboard = async () => {
  const user = await getUser();
  const userRole = user.role;
  const userName = user.firstname;
 
  return (
    <div className="min-h-screen p-12 ">
      <div className="flex justify-between">
        <div>
          <div className='text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>Here are your stats for today.</p>
        </div>
        <Link href="/dashboard/classes">
          <Button className="bg-[#064789] hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white flex gap-2 itemse-center">
            <span>Classes</span>
            <FaArrowRightLong />
          </Button>
        </Link>
      </div>
      {
        userRole === "admin" ? (
          <AdminDashboard />
        ) : (
          <LearnerDashboard />
        )
      }
       
    </div>
  );
};

export default Dashboard;