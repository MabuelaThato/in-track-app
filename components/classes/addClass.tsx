"use client";
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { addAdminClass } from '@/actions/actions';
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
  subject: z.string().min(2).max(50),
  division: z.string().min(2).max(50),
})

const AddClass = () => {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          subject: "",
          division: "",
        },
      })

      const [uploading, setUploading] = useState(false);

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await addAdminClass(values);
        setUploading(true);
        window.location.reload();
      }

  return (
  <Dialog>
    <DialogTrigger asChild>
      <button className='bg-[#064789] text-xs md:text-sm lg:text-base hover:border hover:border-[#064789] hover:text-[#064789] hover:bg-white text-white rounded-md p-1 px-2 md:p-1.5 md:px-3 flex gap-1 md:gap-2 items-center'>
        <FaPlus />
        <span>Add Class</span>
      </button>
    </DialogTrigger>
    <DialogContent className="max-w-[350px] md:max-w-[425px] rounded">
      <DialogHeader>
        <DialogTitle>Create a new class</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
      <FormField
        control={form.control}
        name="subject"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Subject</FormLabel>
            <FormControl>
              <Input placeholder="eg. English" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="division"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Grade</FormLabel>
            <FormControl>
              <Input placeholder="eg. 11c" {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
 
      <DialogFooter>
        <Button type="submit" disabled={uploading}>
          {
            uploading ? (<div>Creating...</div>) : (<div>Create class</div>)
          }
        </Button>
      </DialogFooter>
      </form>
    </Form>
    </DialogContent>
  </Dialog>
  )
}

export default AddClass