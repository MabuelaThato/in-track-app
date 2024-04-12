"use server";
import firebaseAdmin from "@/components/firebaseAdmin";
import getProfile from "@/components/getProfile";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function redirectUser(){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
  
    const user = await getProfile(token);
    if (!user) {
        redirect("/sign-up");
    } else {
        redirect("/dashboard");
    }
  }

export async function registerUser(form: any) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    
    if (token) {
        const user = await firebaseAdmin.auth().verifyIdToken(token);
        try {
            await sql`INSERT INTO users
                VALUES (${user.uid}, ${form.lastname}, ${form.firstname}), "admin";`;
      } catch (error) {
        console.log(error);
      }
      redirect("/dashboard");
    } else {      
        console.error('Token is undefined. Unable to verify.');
    }
}