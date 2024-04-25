"use server";
import firebaseAdmin from "@/components/firebaseAdmin";
import getProfile from "@/components/getProfile";
import { fireAuth } from "@/components/provider";
import { sql } from "@vercel/postgres";
import { signOut } from "firebase/auth";
import { revalidatePath } from "next/cache";
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


export async function addLearner(form: any, classId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    if (token) {
        const user = await firebaseAdmin.auth().verifyIdToken(token);
            try {
              const userRecord = await firebaseAdmin.auth().getUserByEmail(form.email);
              //console.log("USER RECORD:  ", userRecord);
              await sql`INSERT INTO learners (classid, teacherid, name, surname, learnerid)
                VALUES (${classId}, ${user.uid}, ${form.name}, ${form.surname}, ${userRecord.uid});`;
                revalidatePath(`/dashboard/classes/${classId}`)
            } catch (error) {
              console.error('Error fetching user data:', error);
              return null;
            }
        
    } else {      
        console.error('Token is undefined. Unable to verify.');
        redirect("/");
    }
}



export async function getUser(){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      
        const userId = currentUser.uid
       
        const { rows } = await sql`SELECT * from users where userid=${userId};`;
        
        const user = rows[0];
    
        return user;
    } catch (error) {
        console.log(error);
    }
}

export async function getAdminClasses(){

    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      
        const userId = currentUser.uid
       
        const { rows } = await sql`SELECT * from classes where teacherid=${userId};`;
        
        const classes = rows;
    
        return classes;
    } catch (error) {
        console.log(error);
    }

}
export async function getLearnerClasses(){

    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      
        const userId = currentUser.uid

        const { rows } = await sql`SELECT classes.classid, classes.subject, classes.division
        FROM classes
        INNER JOIN learners ON classes.classid=learners.classid WHERE learners.learnerid=${userId};`;
        
        const classes = rows;
    
        return classes;
    } catch (error) {
        console.log(error);
    }

}

export async function addAdminClass(form: any){
    const token = cookies().get("token")?.value!;

    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      
        const userId = currentUser.uid
        await sql`INSERT INTO classes(subject, division, teacherid)
        VALUES (${form.subject}, ${form.division}, ${userId});`;
          revalidatePath("/classes");
        
    } catch (error) {
        console.log(error);
    }
}

export async function getLearners(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
   try {
     const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
 
     const { rows } = await sql`SELECT * FROM learners
     WHERE classid = ${classId} AND teacherid = ${currentUser.uid};`;
     const currentClass = rows;
 
     return currentClass;
   } catch (error) {
    console.log(error);
   }
}

export async function getClass(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        
        const { rows } = await sql`SELECT * FROM classes
        WHERE classid = ${classId} AND teacherid = ${currentUser.uid};`;
        const currentClass = rows[0];
        
        return currentClass;
    } catch (error) {
        console.log(error);
    }
}

export async function deleteClass(classSubject: string, classDivision: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;

    await sql`DELETE FROM classes WHERE classid = ${userId} AND subject = ${classSubject} AND division = ${classDivision};`

    revalidatePath("/dashboard/classes");
  }

export async function deleteLearner(classSubject: string, classDivision: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;

    await sql`DELETE FROM classes WHERE classid = ${userId} AND subject = ${classSubject} AND division = ${classDivision};`

    revalidatePath("/dashboard/classes");
  }

  //QUIZZES

  export async function createQuiz(form: any, classId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        const result = await sql`INSERT INTO quizzes (title, instruction, teacherid, classId) VALUES (${form.title}, ${form.instruction}, ${currentUser.uid}, ${classId});`;
        const createdQuiz = result.rows[0];
        return createdQuiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }

  export async function createQuestion(quizId: number, text: string) {
    try {
      const result = await sql`INSERT INTO questions (quiz_id, text) VALUES (${quizId}, ${text});`;
      const createdQuestion = result.rows[0];
      return createdQuestion;
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Internal server error');
    }
  }

  export async function createAnswer(questionId: number, text: string, isCorrect: boolean) {
    try {
      const result = await client.query(
        'INSERT INTO answers (question_id, text, is_correct) VALUES ($1, $2, $3) RETURNING *',
        [questionId, text, isCorrect]
      );
      const createdAnswer = result.rows[0];
      return createdAnswer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw new Error('Internal server error');
    }
  }

  export async function getAdminAssessments(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        const { rows } = await sql`SELECT * FROM quizzes WHERE teacherid=${currentUser.uid} AND classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }
  export async function getAdminAssessment(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM quizzes WHERE assessmentid=${assessmentId} AND classid=${classId};`;
        
        const assessments = rows[0];
    
        return assessments;

    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }