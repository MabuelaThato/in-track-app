"use client"
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { addLearner } from '@/actions/actions';
import { revalidatePath } from 'next/cache';
import { DialogFooter } from '../ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { fireAuth } from '../provider';

const formSchema = z.object({
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),
    email: z.string().min(5).max(50),
    password: z.string().min(8).max(50),
  })

const AddLearner = ({classId}: {classId: string}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          surname: "",
          email: "",
          password: "",
        },
      })

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try{
        await addLearner(values, classId);
        await createUserWithEmailAndPassword(fireAuth, values.email, values.password)
        revalidatePath(`/students/${classId}`) 
      } catch(err){
        console.log(err);
      }
      }

  return (
   
<Dialog>
<DialogTrigger asChild>
  <Button className='bg-[#064789] hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white flex gap-2 items-center'>
    <FaPlus />
    <span>Add Learner</span>
  </Button>
</DialogTrigger>
<DialogContent className="sm:max-w-[425px]">
  <DialogHeader>
    <DialogTitle>Create a new learner</DialogTitle>
    <DialogDescription>Enter all the learner's information. Click the add button when you're done.</DialogDescription>
</DialogHeader>
<Form {...form}>
<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
          <Input {...field}/>
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />

  <DialogFooter>
    <Button type="submit">Add</Button>
  </DialogFooter>
  </form>
</Form>
</DialogContent>
</Dialog>

  )
}

export default AddLearner