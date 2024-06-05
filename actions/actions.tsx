"use server";
import firebaseAdmin from "@/components/firebaseAdmin";
import getProfile from "@/components/getProfile";
import { fireAuth } from "@/components/provider";
import { sql } from "@vercel/postgres";
import { signOut } from "firebase/auth";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect, useRouter } from "next/navigation";
import { destroyCookie } from "nookies";

export async function redirectUser(){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
  
    const user = await getProfile(token);
    if (!user) {
        redirect("/sign-up");
    } else {
        redirect("/classes");
    }
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
      redirect("/classes");
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

export async function getLearner(learnerId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
   try {
 
     const { rows } = await sql`SELECT * FROM learners
     WHERE learnerid = ${learnerId};`;
     const currentLearner = rows[0];
 
     return currentLearner;
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



  //QUIZZES

  export async function createQuiz(form: any, classId: string, dueDate: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        await sql`INSERT INTO quizzes (title, instruction, teacherid, classId, duedate, passpercentage, assessmenttype) VALUES (${form.title}, ${form.instruction}, ${currentUser.uid}, ${classId}, ${dueDate}, ${form.passPercentage}, ${form.quizType});`;
        
    } catch (error) {
      console.error('Error creating quiz:', error);
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
      
    } catch (error) {
      console.error('Error creating question:', error);
      
    }
  }
  export async function addPdfQuestion(fileName: string, classId: string, assessmentId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      await sql`INSERT INTO assignments (assessmentid, classid, teacherid, filename) 
      VALUES (${assessmentId}, ${classId}, ${currentUser.uid}, ${fileName});`;
    } catch (error) {
      console.error('Error creating question:', error);
      
    }
  }
  export async function getPdfQuestion(classId: string, assessmentId: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const assignments = await sql`SELECT * FROM assignments 
      WHERE classid = ${classId} AND assessmentid = ${assessmentId};`;
      
      return assignments
    } catch (error) {
      console.error('Error creating question:', error);
      
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
      
    }
  }

  //SUBMISSIONS


  export async function submitQuizResult(classId: string, assessmentId: string, fullName: any, score: any,percentage: any, status: any){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      await sql`INSERT INTO quizsubmissions (assessmentid, classid, learnerid, fullname, score, percentage, status) 
      VALUES (${assessmentId}, ${classId}, ${currentUser.uid}, ${fullName}, ${score}, ${percentage}, ${status});`;

    } catch (error) {
      console.error('Error submitting quiz results:', error);
      
    }
  }

  export async function getLearnerAssignmentSubmissions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
        const { rows } = await sql`SELECT * FROM assignmentsubmissions WHERE assessmentid=${assessmentId} AND classid=${classId} AND learnerid=${currentUser.uid};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error fetching submissions:', error);
      
    }
  }

  //all learners' assignments
  export async function getAssignmentSubmissions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
      
        const { rows } = await sql`SELECT * FROM assignmentsubmissions WHERE assessmentid=${assessmentId} AND classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error fetching submissions:', error);
      
    }
  }

  //all assignments for each learner for a specific class
  export async function getEachLearnerAssignments(classId: string, learnerId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
      
        const { rows } = await sql`SELECT * FROM assignmentsubmissions WHERE learnerid=${learnerId} AND classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error fetching submissions:', error);
      
    }
  }

  //all learners' quizzes
  export async function getLearnerQuizSubmissions(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM quizsubmissions WHERE assessmentid=${assessmentId} AND classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error fetching submissions:', error);
      
    }
  }

  //all quizzes for each learner for a specific class
  export async function getLearnerQuizzes(classId: string, learnerId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");

    try {
        const { rows } = await sql`SELECT * FROM quizsubmissions WHERE learnerid=${learnerId} AND classid=${classId};`;
        
        const assessments = rows;
    
        return assessments;

    } catch (error) {
      console.error('Error fetching submissions:', error);
      
    }
  }

  export async function submitPdfAnswer(fileName: string, classId: string, assessmentId: string, assignmentTitle: string) {
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
      const userDetails = await getUser();
      const userName = userDetails?.firstname + " " + userDetails?.lastname;
      await sql`INSERT INTO assignmentsubmissions (assessmentid, classid, learnerid, filename, name, assignmenttitle) 
      VALUES (${assessmentId}, ${classId}, ${currentUser.uid}, ${fileName}, ${userName}, ${assignmentTitle});`;
    } catch (error) {
      console.error('Error submitting pdf:', error);
      
    }
  }






  //DELETES

  export async function deleteClass(classId:string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;

    await sql`DELETE FROM classes WHERE classid = ${classId} AND teacherid = ${userId};`
    await sql`DELETE FROM learners WHERE classid = ${classId} AND teacherid = ${userId};`
    await sql`DELETE FROM quizzes WHERE classid = ${classId} AND teacherid = ${userId};`
    await sql`DELETE FROM questions WHERE classid = ${classId} AND teacherid = ${userId};`
    await sql`DELETE FROM assignments WHERE classid = ${classId} AND teacherid = ${userId};`

    revalidatePath("/dashboard/classes");
  }

  export async function deleteQuiz(classId:string, quizType: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
    
      const userId = currentUser.uid;
  
      await sql`DELETE FROM quizzes WHERE classid = ${classId} AND teacherid = ${userId} AND assessmentid = ${assessmentId};`

      if (quizType == "quiz") {
      await sql`DELETE FROM questions WHERE classid = ${classId} AND teacherid = ${userId} AND assessmentid = ${assessmentId};`
      } else{
      await sql`DELETE FROM assignments WHERE classid = ${classId} AND teacherid = ${userId} AND assessmentid = ${assessmentId};`
      }
       
    } catch (error) {
      console.log(error)
    }

    revalidatePath("/dashboard/classes");
  }

export async function deleteLearner(classId: string, learnerId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;

    await sql`DELETE FROM learners WHERE teacherid = ${userId} AND classid = ${classId} AND learnerid = ${learnerId};`
    await sql`DELETE FROM quizsubmissions WHERE classid = ${classId} AND learnerid = ${learnerId};`
    await sql`DELETE FROM assignmentsubmissions WHERE classid = ${classId} AND learnerid = ${learnerId};`

}
export async function deleteQuestion(classId: string, assessmentId: string, questionId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
  
    const userId = currentUser.uid;

    await sql`DELETE FROM questions WHERE teacherid = ${userId} AND classid = ${classId} AND assessmentid = ${assessmentId} AND questionid = ${questionId};`

}

export async function deleteLearnerAssignment(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
    
      const userId = currentUser.uid;
    
      await sql`DELETE FROM assignmentsubmissions WHERE learnerid = ${userId} AND classid = ${classId} AND assessmentid = ${assessmentId};`;
    } catch (error) {
      console.log("ERROR IN AWAIT SQL DELETE", error)
    }

}

export async function deleteAdminAssignment(classId: string, assessmentId: string){
    const token = cookies().get("token")?.value!;
    if (!token) return redirect("/");
    try {
      const currentUser = await firebaseAdmin.auth().verifyIdToken(token);
    
      const userId = currentUser.uid;
    
      await sql`DELETE FROM assignments WHERE teacherid = ${userId} AND classid = ${classId} AND assessmentid = ${assessmentId};`;
    } catch (error) {
      console.log("ERROR IN AWAIT SQL DELETE", error)
    }

}