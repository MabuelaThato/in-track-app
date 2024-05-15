"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { addLearner } from '@/actions/actions';
import { DialogFooter } from '../ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

const formSchema = z.object({
    name: z.string().min(2).max(50),
    surname: z.string().min(2).max(50),
    email: z.string().min(2).max(50),
  })

const AddLearner = ({classId}: {classId: string}) => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          name: "",
          surname: "",
          email: "",
        },
      })

      const [uploading, setUploading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
      try{
        await addLearner(values, classId);
        setUploading(true);
        window.location.reload();
      } catch(err){
        console.log(err);
      }
      }

  return (
   
<Dialog>
<DialogTrigger asChild>
  <div className='bg-[#064789] text-xs md:text-sm lg:text-base hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white p-2 px-3 rounded-md text-white flex gap-2 items-center'>
    <FaPlus />
    <span>Add Learner</span>
  </div>
</DialogTrigger>
<DialogContent className="max-w-[350px] md:max-w-[425px] rounded">
  <DialogHeader>
    <DialogTitle>Create a new learner</DialogTitle>
    <DialogDescription>Enter all the learner's information. Click the add button when you're done.</DialogDescription>
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
        <FormLabel>Email Address</FormLabel>
        <FormControl>
          <Input placeholder="eg. Radebe" {...field}/>
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

export default AddLearner