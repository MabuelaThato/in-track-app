import { sql } from '@vercel/postgres';
import { redirect } from "next/navigation";
import firebaseAdmin from './firebaseAdmin';

export default async function getProfile(token: string | undefined) {
    if (!token) return redirect("/");
  
    try {
      const session = await firebaseAdmin.auth().verifyIdToken(token);
  
      if (!session) return redirect("/");

      const userData = await sql`SELECT * from users where userid=${session.uid}`;
  
      return userData.rows;
    } catch (error) {
      return redirect("/");
    }
  }