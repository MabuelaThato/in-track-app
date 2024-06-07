"use client"
import React, { useState } from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FaPlus } from "react-icons/fa6";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";  
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogFooter } from '@/components/ui/dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from '@/components/ui/textarea';
import { createAnnounment } from '@/actions/communications';


const formSchema = z.object({
    title: z.string().min(2).max(50),
    details: z.string().min(2),

  })

const AddAnnouncement = ({classId}: {classId: string}) => {

  const [uploading, setUploading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
          title: "",
          details: "",
        },
      })

      
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const day = today.getDate();
  const date = day + '-' + month + '-' + year;

    async function onSubmit(values: z.infer<typeof formSchema>) {
        await createAnnounment(classId, values, date);
        setUploading(true);
        window.location.reload();
      }

  return (
    <Dialog>
    <DialogTrigger asChild className='bg-[#A5BE00] hover:border hover:cursor-pointer hover:border-[#A5BE00] hover:text-[#A5BE00] hover:bg-white rounded-md p-2 px-3 text-white flex gap-2 items-center justify-center w-48 lg:w-auto h-10'>
      <div>
        <FaPlus />
        <span className='lg:grow text-sm'>Add announcement</span>
      </div>
    </DialogTrigger>
    <DialogContent className="max-w-[380px] rounded">
      <DialogHeader>
        <DialogTitle>Create a new announcement</DialogTitle>
        <DialogDescription>Enter all the information. Click create when you're done.</DialogDescription>
    </DialogHeader>
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem className='max-w-[350px]'>
            <FormLabel>Title of announcement</FormLabel>
            <FormControl>
              <Input placeholder="eg. Test on 3 March" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
     
      <FormField
        control={form.control}
        name="details"
        render={({ field }) => (
          <FormItem className='max-w-[350px]'>
            <FormLabel>Announcement details</FormLabel>
            <FormControl>
              <Textarea placeholder="eg. Study chapters 1, 2 and 3." {...field}/>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
 
      <DialogFooter className='max-w-[350px]'>
        <Button type="submit">
        {
            uploading ? (<div>Creating...</div>) : (<div>Create announcement</div>)
        }

        </Button>
      </DialogFooter>
      </form>
    </Form>
    </DialogContent>
  </Dialog>
  )
}

export default AddAnnouncement