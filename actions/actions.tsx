"use server";
import firebaseAdmin from "@/components/firebaseAdmin";
import getProfile from "@/components/getProfile";
import { fireAuth } from "@/components/provider";
import { sql } from "@vercel/postgres";
import { signOut } from "firebase/auth";
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

export async function logOut(){
    await signOut(fireAuth);
    return redirect("/")
}

export async function registerUser(form: any) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    console.log("Token", token);
    if (token) {
        const user = await firebaseAdmin.auth().verifyIdToken(token);
        
        try {
            await sql`INSERT INTO users (userid, lastname, firstname, role)
                VALUES (${user.uid}, ${form.lastname}, ${form.firstname}, 'admin');`;
      } catch (error) {
        
      }
      redirect("/dashboard");
    } else {      
        console.error('Token is undefined. Unable to verify.');
    }
}

export async function getUser(){
    const token = cookies().get("token")?.value!;
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid
   
    const { rows } = await sql`SELECT * from users where userid=${userId}`;
    
    const user = rows[0];

    return user;
}