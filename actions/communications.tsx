"use server"
import firebaseAdmin from "@/components/firebaseAdmin";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function createAnnounment(classId: string, form: any, date: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {

        await sql`INSERT INTO announcements (classid, title, details, day) VALUES (${classId}, ${form.title}, ${form.details}, ${date});`;
        
    } catch (error) {
      console.error('Error creating quiz:', error);
    }
}

export async function getAnnouncements(classId: string){
  const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        const { rows } = await sql`SELECT * FROM announcements WHERE classid=${classId};`;
        
        const announcements = rows;
    
        return announcements;

    } catch (error) {
      console.error('Error creating quiz:', error);
      
    }
}

export async function deleteAdminAnnouncement(classId: string, announcementId: string){
  const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      
      await sql`DELETE FROM announcements WHERE classid = ${classId} AND announcementid = ${announcementId} ;`
       
    } catch (error) {
      console.log(error)
    }
}