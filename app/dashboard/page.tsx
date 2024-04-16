import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/adminDashboard";
import LearnerDashboard from "@/components/dashboard/learnerDashboard";
import { sql } from "@vercel/postgres";
import firebaseAdmin from "@/components/firebaseAdmin";
import { FaArrowRightLong } from "react-icons/fa6";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const Dashboard = async () => {

  const token = cookies().get("token")?.value!;
  const currentUser = await firebaseAdmin.auth().verifyIdToken(token);

  if (!currentUser) redirect("/register");

  const userId = currentUser.uid
 
  const { rows } = await sql`SELECT * from users where userid=${userId}`;
  
  const userRole = rows[0]?.role;
  const userName = rows[0]?.firstname;
 
  return (
    <div className="min-h-screen p-12 bg-[#F4F4F4]">
      <div className="flex justify-between">
        <div>
          <div className='text-4xl font-medium '>
            <h1>Hello {userName}</h1>
          </div>
          <p className='text-sm text-zinc-500 mb-6'>Here are your stats for today.</p>
        </div>
        <Link href="/classes">
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