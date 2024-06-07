"use server"

import firebaseAdmin from "@/components/firebaseAdmin";
import { sql } from "@vercel/postgres";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function AddPdfNote(fileName: string, classId: string, day: string) {
  const token = cookies().get("token")?.value!;
  if (!token) return redirect("/");
  try {
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);

    await sql`INSERT INTO notes (classid, teacherid, filename, date) 
    VALUES (${classId}, ${currentUser.uid}, ${fileName}, ${day});`;
  } catch (error) {
    console.error('Error creating question:', error);
    
  }
}

export async function GetNote(){

}


export async function GetNotes(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const notes = await sql`SELECT * FROM notes 
      WHERE classid = ${classId};`;
      
      return notes.rows
      
    } catch (error) {
      console.error('Error creating question:', error);
      
    }

}

export async function deleteNote(classId: string, noteId: string){
  const token = cookies().get("token")?.value!;
  if (!token) return redirect("/");
  try {

    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;
  
    await sql`DELETE FROM notes WHERE teacherid = ${userId} AND classid = ${classId} AND noteid = ${noteId};`;

  } catch (error) {
    console.log("ERROR IN AWAIT SQL DELETE", error)
  }

}