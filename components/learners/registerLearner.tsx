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
import { addLearner, registerLearner } from '@/actions/actions';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { fireAuth } from '../provider';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),
    email: z.string().min(5).max(50),
    password: z.string().min(8).max(50),
  })

const RegisterLearner = ({classId}: {classId: string}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          surname: "",
          email: "",
          password: "",
        },
      })

      const [uploading, setUploading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try{
        await createUserWithEmailAndPassword(fireAuth, values.email, values.password);
        await registerLearner(values);
        await addLearner(values, classId);
        setUploading(true);
        window.location.reload();
      } catch(err){
        console.log(err);
        console.log("USER ALREADY HAS AN ACCOUNT");
      }
      }

  return (
   
<Dialog>
<DialogTrigger asChild>
  <div className='bg-[#A5BE00] hover:border hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white p-2 px-3 rounded-md text-white flex gap-2 items-center'>
    <FaPlus />
    <span>Register Learner</span>
  </div>
</DialogTrigger>
<DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Create a new learner</DialogTitle>
    <DialogDescription>
      Enter all the learner's information. Click the add button when you're done.
      <br />
      This will automatically add the learner to your class.
    </DialogDescription>
</DialogHeader>
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
  <FormField
    control={form.control}
    name="name"
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
    name="surname"
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
  <FormField
    control={form.control}
    name="password"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Password</FormLabel>
        <FormControl>
          <Input type='password' {...field}/>
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