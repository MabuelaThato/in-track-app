import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";
import AdminDashboard from "@/components/dashboard/adminDashboard";
import LearnerDashboard from "@/components/dashboard/learnerDashboard";
import { sql } from "@vercel/postgres";
import firebaseAdmin from "@/components/firebaseAdmin";

const Dashboard = async () => {

  const token = cookies().get("token")?.value!;
  const currentUser = await firebaseAdmin.auth().verifyIdToken(token);

  if (!currentUser) redirect("/register");

  const userId = currentUser.uid
  console.log(userId);
  const { rows } = await sql`SELECT * from users where userid=${userId}`;
  console.log("Rows: ", rows)
  const userRole = rows[0]?.role;
  console.log("Role:", rows[0]?.role)
  return (
    <div className="m-8">
      {
        userRole === "Admin" ? (
          <AdminDashboard />
        ) : (
          <LearnerDashboard />
        )
      }
       
    </div>
  );
};

export default Dashboard;