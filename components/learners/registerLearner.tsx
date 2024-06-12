"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { DialogFooter } from '../ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { addLearner
  
  , registerLearner } from '@/actions/actions';
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { fireAuth } from '../provider';

const formSchema = z.object({
    firstname: z.string().min(2).max(50),
    lastname: z.string().min(2).max(50),
    email: z.string().min(5).max(50),
  })

const RegisterLearner = ({classId, user}: {classId: string, user: any}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          firstname: "",
          lastname: "",
          email: "",
        },
      })

      const [uploading, setUploading] = useState(false);

      function generatePassword(length: number = 10): string {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+~`|}{[]:;?><,./-=';
        let password = '';
        const charactersLength = characters.length;
    
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * charactersLength);
            password += characters.charAt(randomIndex);
        }
    
        return password;
    }
    
    const password = generatePassword();

    async function onSubmit(values: z.infer<typeof formSchema>) {

      setUploading(true);

      try{
        await createUserWithEmailAndPassword(fireAuth, values.email, password);

        await registerLearner(values);
        await addLearner(values, classId);
        const auth = fireAuth;

        sendPasswordResetEmail(auth, values.email)
        .then(async() => {
          alert("A password reset email has been sent to your email.");
          window.location.reload();
        })
        .catch((error: any) => {
          const errorCode = error.code;
          const errorMessage = error.message;
            console.log("Error Message:  ",errorMessage)
            setUploading(false);
        });

      } catch(err){
        console.log(err);
        alert("Email already in use, try add learner instead.")
        setUploading(false);
      }
      }

  return (
   
<Dialog>
<DialogTrigger asChild>
  <div className='bg-[#A5BE00] text-xs md:text-sm lg:text-base hover:border hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white p-2 px-3 rounded-md text-white flex gap-2 items-center'>
    <FaPlus />
    <span>Register Learner</span>
  </div>
</DialogTrigger>
<DialogContent className="max-w-[350px] md:max-w-[425px] rounded">
  <DialogHeader>
    <DialogTitle>Create a new learner</DialogTitle>
    <DialogDescription>
      Enter all the learner's information. Click the add button when you're done. This will register the learner and send a link to their email to reset their password.
      <br />
      The learner will be automatically added to the class.
    </DialogDescription>
</DialogHeader>
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
  <FormField
    control={form.control}
    name="firstname"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input placeholder="eg. Mpho" {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="lastname"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Surname</FormLabel>
        <FormControl>
          <Input placeholder="eg. Radebe" {...field}/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
  <FormField
    control={form.control}
    name="email"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input placeholder="eg. mpho@gmail.com" {...field}/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <DialogFooter>
    <Button type="submit" disabled={uploading} className='mt-2'>
    {
        uploading ? (
        <div>Adding...</div>
        ) : (
        <div>Add</div>
          )
      }
    </Button>
  </DialogFooter>
  </form>
</Form>
</DialogContent>
</Dialog>

  )
}

export default RegisterLearner