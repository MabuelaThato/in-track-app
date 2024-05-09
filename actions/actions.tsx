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
export async function registerLearner(form: any) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    console.log("Token", token);
    if (token) {
        const user = await firebaseAdmin.auth().getUserByEmail(form.email);
        
        try {
            await sql`INSERT INTO users (userid, lastname, firstname, role)
                VALUES (${user.uid}, ${form.name}, ${form.surname}, 'learner');`;
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

        
        const { rows } = await sql`SELECT * FROM classes
        WHERE classid = ${classId};`;
        const currentClass = rows[0];
        
        return currentClass;
    } catch (error) {
        console.log(error);
    }
};

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

  export async function createQuiz(form: any, classId: string, dueDate: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        const result = await sql`INSERT INTO quizzes (title, instruction, teacherid, classId, duedate, passpercentage, assessmenttype) VALUES (${form.title}, ${form.instruction}, ${currentUser.uid}, ${classId}, ${dueDate}, ${form.passPercentage}, ${form.quizType});`;
        const createdQuiz = result.rows[0];
        return createdQuiz;
    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }

  export async function addQuestion(form: any, classId: string, assessmentId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      const optionsArray = [form.option1, form.option2, form.option3, form.option4];
      const optionsLiteral = `{${optionsArray.join(',')}}`;
      await sql`INSERT INTO questions (assessmentid, classid, teacherid, question, correctanswer, options) 
      VALUES (${assessmentId}, ${classId}, ${currentUser.uid}, ${form.question}, ${form.correctAnswer}, ${optionsLiteral});`;
      revalidatePath(`/classes/${classId}/assessments/${assessmentId}`);
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Internal server error');
    }
  }
  export async function addPdfQuestion(fileName: string, classId: string, assessmentId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      await sql`INSERT INTO assignments (assessmentid, classid, teacherid, filename) 
      VALUES (${assessmentId}, ${classId}, ${currentUser.uid}, ${fileName});`;
      revalidatePath(`/classes/${classId}/assessments/${assessmentId}`);
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Internal server error');
    }
  }
  export async function getPdfQuestion(classId: string, assessmentId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const assignments = await sql`SELECT * FROM assignments 
      WHERE classid = ${classId} AND assessmentid = ${assessmentId};`;
      revalidatePath(`/classes/${classId}/assessments/${assessmentId}`);
      return assignments
    } catch (error) {
      console.error('Error creating question:', error);
      throw new Error('Internal server error');
    }
  }

  export async function getQuestions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        
        const { rows } = await sql`SELECT * FROM questions
        WHERE classid = ${classId} AND teacherid = ${currentUser.uid} AND assessmentid = ${assessmentId};`;
        
        return rows;
    } catch (error) {
        console.log(error);
    }
  }
  export async function getLearnerQuestions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        
        const { rows } = await sql`SELECT * FROM questions
        WHERE classid = ${classId} AND assessmentid = ${assessmentId};`;
        
        return rows;
    } catch (error) {
        console.log(error);
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
  export async function getlearnerAssessments(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM quizzes WHERE classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }
  export async function getlearnerAssignments(classId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM assignments WHERE classid=${classId};`;
        
        const assignments = rows;
    
        return assignments;

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

  //SUBMISSIONS


  export async function getLearnerAssignmentSubmissions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM assignmentsubmissions WHERE assessmentid=${assessmentId} AND classid=${classId};`;
        
        const assessments = rows[0];
    
        return assessments;

    } catch (error) {
      console.error('Error creating quiz:', error);
      throw new Error('Internal server error');
    }
  }
